"use client";

import { useEffect, useRef, useState } from "react";
import { GetUser, type User } from "@/lib/auth";
import { UserRound } from "lucide-react";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        GetUser().then(setUser);
    }, []);

    return (
        <nav className="w-full h-[80px] bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex justify-between items-center h-full">
                <h1 className="card-title ml-5 font-bold text-2xl">
                    Pokedex Project
                </h1>
                <div className="mr-5">
                    {user ? (
                        <a href="/dashboard"><div className="flex justify-between items-center gap-2">{user.username}<UserRound size={16}/></div></a>
                    ) : (
                        <a href="/login">
                            <button className="btn btn-dash">Login</button>
                        </a>
                    )}
                </div>
            </div>
        </nav>
    )
}