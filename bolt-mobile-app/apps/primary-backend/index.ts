import { prismaClient } from "db/client"
import express from "express"
import cors from "cors"
import { authMiddleware } from "./middleware"

const app = express()

app.use(express.json())
app.use(cors())

app.post("/project", authMiddleware, async (req, res) => {  //add middleware
    const { prompt } = req.body;
    const userId = req.userId!;
    //add a better way to get the name
    const description = prompt.split("\n")[0]
    const project = await prismaClient.project.create({
        data: { description, userId }
    })
    res.json({ projectId: project.id })
})

app.get("/projects", authMiddleware, async(req, res) => {
    const userId  = req.userId!;
    const projects = await prismaClient.project.findFirst({
        where: { userId }
    })

    res.json(projects);
})

app.get("/prompts/:projectId", authMiddleware, async (req, res) => {
    // const userId = req.userId;
    const projectId = req.params.projectId;
    
    const prompts = await prismaClient.prompt.findMany({
        where: {
                projectId: projectId
        }
    });
    
    // console.log(prompts);
    res.json({ prompts });
})

app.get("/actions/:projectId", authMiddleware, async (req, res) => {
    // const userId = req.userId;
    const projectId = req.params.projectId;
    
    const actions = await prismaClient.action.findMany({
        where: {
                projectId: projectId
        }
    });
    
    // console.log(prompts);
    res.json({ actions });
})

app.listen(9090, () => {
    console.log("Server is running on port 9090");
})