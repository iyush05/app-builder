import { Button } from "@/components/ui/button"
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

export function Appbar() {
    return(
        <div className="h-14 flex justify-between w-screen">
            <div className="ml-6 font-stretch-90% text-3xl items-start">Bolt</div>
            <div className="w-auto px-4">
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )
}