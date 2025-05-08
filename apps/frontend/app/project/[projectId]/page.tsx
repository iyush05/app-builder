'use client'
import { Appbar } from "@/components/Appbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WORKER_URL } from "@/config"
import { useActions } from "@/hooks/useActions"
import { usePrompts } from "@/hooks/usePrompts"
import { use } from 'react'

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }>}) {
    const {projectId} =   use(params);
    const prompts = usePrompts(projectId);
    const actions = useActions(projectId);
    console.log("actina :" , actions)
    console.log("prmpst" , prompts);

    return (<div>
        <div className="pt-3">
            <Appbar />
        </div>
        <div className="flex px-4">
                <div>
            <div className="w-sm h-screen flex flex-col pb-60">
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
                <div className="flex justify-between items-center">
                    <Input />
                    <Button className="cursor-pointer">Send</Button> 
                </div>
            </div>
            <div className="w-full h-screen place-items-end">
                <iframe src={`${WORKER_URL}/`} width={"100%"} height={"90%"}></iframe>
            </div>
        </div>
    </div>
)}