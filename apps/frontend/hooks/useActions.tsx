import { BACKEND_URL } from "@/config";
import { useEffect, useState } from "react";
import axios from "axios"
import { useAuth } from "@clerk/nextjs"

interface Action {
    id: string,
    content: string,
    type: "USER" | "SYSTEM",
    createdAt: Date;
}

export function useActions (projectId: string) {
    const [actions, setActions] = useState<Action[]>([]);
    const { getToken } = useAuth();
    
    useEffect(() => {
        async function getPrompts() {
            const token = await getToken();
            axios.get(`${BACKEND_URL}/actions/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                setActions(res.data.actions);
                // console.log("fkin actions", res.data.actions);
            })
        }
        getPrompts();
        let interval = setInterval(getPrompts, 1000);
        return () => clearInterval(interval);
    }, []);

    return actions;
}