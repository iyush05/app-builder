'use client'
import { Appbar } from "@/components/Appbar"
import { Button } from "@/components/ui/button"
import { BACKEND_URL, WORKER_API_URL, WORKER_URL } from "@/config"
import { useActions } from "@/hooks/useActions"
import { usePrompts } from "@/hooks/usePrompts"
import { use } from 'react'
import { useState } from "react"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }>}) {
    const [input, setInput] = useState("")
    const {projectId} =   use(params);
    const prompts = usePrompts(projectId);
    const actions = useActions(projectId);
    const {getToken} = useAuth();
    console.log("actina :" , actions)
    console.log("prmpst" , prompts);

    async function handleClick() {
        const token = await getToken();
        const response = await axios.post(`${WORKER_API_URL}/prompt`, {
            projectId: projectId,
            prompt: input
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        setInput("");
    }
    return (<div>
        <div className="pt-3">
            <Appbar />
        </div>
        <div className="flex px-4">
                <div>
            <div className="w-sm h-3/5 flex flex-col overflow-auto dark-scrollbar">
                    Chat history
                    {prompts.filter((prompt) => prompt.type === "USER").map((prompt) => (
                        <div key={prompt.id}>
                            {prompt.content}
                        </div>
                    ))}
                    {actions.map((action) => (
                        <div key={action.id}>
                            {action.content}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-8">
                    <input type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                    }}
                    placeholder="Chat with the agent"
                    className="w-full h-10 p-2"
                    ></input>
                    <Button className="cursor-pointer hover:bg-gray-600 " onClick={handleClick}>Send</Button> 
                </div>
            </div>
            <div className="w-full h-screen place-items-end">
                <iframe src={`${WORKER_URL}/`} width={"100%"} height={"90%"}></iframe>
            </div>
        </div>
    </div>
)}