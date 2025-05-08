import express from "express";
import cors from "cors"
// import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { prismaClient } from "db/client";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";
import { systemPrompt } from "./systemPrompt";
// import Anthropic from "@anthropic-ai/sdk";
import { authMiddleware } from "./middleware";

const app = express();
app.use(cors());
app.use(express.json())

app.post("/prompt",  async (req, res) => {
    const { prompt, projectId } = req.body;
    console.log("Prompt:", prompt);
    console.log("ProjectId:", projectId);
    // const client = new Anthropic();
    // const client = new OpenAI();
    const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const project = await prismaClient.project.findUnique({
        where: {
            id: projectId,
        }
    });

    if(!project) {
        res.status(404).json({error: "Project not found"})
        return;
    }

    const promptDb = await prismaClient.prompt.create({
        data: {
            content: prompt,
            projectId,
            type: "USER",
        },
    });

    const allPrompts = await prismaClient.prompt.findMany({
        where: {
            projectId,
        },
        orderBy: {
            createdAt: "asc",
        },
    })

    const contents = allPrompts.map((p: any) => ({
        role: p.type === "USER" ? "user" : "model",
        parts: [{ text: p.content }],
    }));

    const systemPromptText = systemPrompt(project.type);
    contents.unshift({
        role: "user",
        parts: [{ text: systemPromptText }],
    })

    let artifactProcessor = new ArtifactProcessor("", ( filePath, fileContent ) => onFileUpdate(filePath, fileContent, projectId), (shellCommand) => onShellCommand(shellCommand, projectId));
    let artifact = "";

    const result = await model.generateContentStream({ contents });
    for await (const chunk of result.stream) {
        const text = chunk.text();
        if(text) {
            artifactProcessor.append(text);
            artifactProcessor.parse();
            artifact += text;
            console.log(text);
        }
    }

    // let response = client.messages.stream({
    //     messages: allPrompts.map((p: any) => ({
    //       role: p.type === "USER" ? "user" : "assistant",
    //       content: p.content,
    //     })),
    //     system: systemPrompt(project.type),
    //     model: "claude-3-7-sonnet-20250219",
    //     max_tokens: 8000,
    //   }).on('text', (text) => {
    //     artifactProcessor.append(text);
    //     artifactProcessor.parse();
    //     artifact += text;
    //   })
    //   .on('finalMessage', async (message) => {
    //     console.log("done!");
    //     await prismaClient.prompt.create({
    //       data: {
    //         content: artifact,
    //         projectId,
    //         type: "SYSTEM",
    //       },
    //     });
        // console.log(response);

    await prismaClient.prompt.create({
        data: {
            content: artifact,
            projectId,
            type: "SYSTEM",
        }
    })

    await prismaClient.action.create({
        data: {
            content: "Done!",
            projectId,
        }
    })

    // console.log("llm-response: ", artifact);
    res.status(200).json({message: "artifact generated"})
})
// [{ role: "user", parts: [ { text: "hello" }] }],
// })

app.listen(9091, () => {
    console.log("Server running on port: 9091")
})

