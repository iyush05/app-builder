'use client'
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios"
import { useState } from "react";
import { BACKEND_URL, WORKER_API_URL } from "@/config";
import { useRouter } from "next/navigation";

export function Prompt() {
    const [prompt, setPrompt] = useState("");
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    return(
        <div className="w-full max-w-2xl">
            <Textarea placeholder="Create a chess application..." value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
            <div className="flex justify-end mt-4">
            <Button variant="outline" size="icon" onClick={async () => {
                const token = await getToken()
                const response = await axios.post(`${BACKEND_URL}/project`, {
                    prompt: prompt,
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                // console.log(response.data)
                axios.post(`${WORKER_API_URL}/prompt`, {
                    projectId: response.data.projectId,
                    prompt: prompt,
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                })
                // if(isSignedIn) {
                //     router.push(`/project/${response.data.projectId}`);
                // } else { 
                //     router.push("/sign-in");
                // }
                router.push(`/project/${response.data.projectId}`);
            }}>
                <ChevronRight />
            </Button>
            </div>
        </div>
    )
}