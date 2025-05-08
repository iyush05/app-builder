import { prismaClient } from "db/client";

const BASE_WORKER_DIR = "/tmp/bolty-worker";

if(!Bun.file(BASE_WORKER_DIR).exists()) {
    Bun.write(BASE_WORKER_DIR, "");
}

export async function onFileUpdate(filePath:string, fileContent:string, projectId: string)  {
    // console.log("Writing file: ", filePath);
    await Bun.write(`${BASE_WORKER_DIR}/${filePath}`, fileContent)
    await prismaClient.action.create({
        data: {
            projectId,
            content: `Updated file ${filePath}`
        },
    })
}

export async function onShellCommand(shellCommand: string, projectId: string) {
    // const commands = shellCommand.split("&&");
    const commands = shellCommand
        .replace(/\bexpo\b/g, 'npx expo') // replace standalone 'expo' with 'npx expo'
        .split("&&")
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);
    for(const command of commands) {
        console.log(`Running command: ${command}`);
        const result = Bun.spawnSync({cmd: command.split(" "), cwd: BASE_WORKER_DIR});
        await prismaClient.action.create({
            data: {
                projectId,
                content: `Ran command: ${command}`
            }
        })
        console.log(result.stdout);
        console.log(result.stderr); //.tostring()
    }
}