"use client";

import { useEffect, useRef, useState } from "react";
import { GetUser, type User } from "@/lib/auth";
import { LayoutDashboard, LogOut, UserRound, UserRoundArrowLeft } from "lucide-react";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [showProfile, setShowProfile] = useState(false);
    const [theme, setTheme] = useState<"black" | "halloween">("black");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        GetUser().then(setUser);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const next = stored === "halloween" ? "halloween" : "black";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
    }, []);

    function toggleTheme() {
        const next = theme === "halloween" ? "black" : "halloween";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    }

    return (
        <nav className="relative w-full h-[80px] bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex justify-between items-center h-full">
                <a className="card-title ml-5 font-bold text-2xl" href="/"><button>Pokedex Project</button></a>
                <div className="mr-5">
                    {user ? (
                        <button onClick={() => setShowProfile(prev => !prev)} className="flex justify-between items-center gap-2">{user.username}<UserRound size={16} /></button>
                    ) : (
                        <a href="/login">
                            <button className="btn btn-dash">Login</button>
                        </a>
                    )}
                </div>
            </div>
            {
                (showProfile && user) && (
                    <div className="card absolute right-0 top-full bg-background/80 backdrop-blur-sm z-50 w-75 shadow-sm p-1 gap-y-1">
                        <a href="/dashboard"><button className="btn btn-neutral w-full justify-start"><LayoutDashboard size={16}/>Dashboard</button></a>
                        <a href="/profile"><button className="btn btn-neutral w-full justify-start"><UserRound size={16}/>Profile</button></a>
                        <a href="/logout"><button className="btn btn-error w-full justify-start"><LogOut size={16} className="-scale-x-100"/>Logout</button></a>
                        <div className="flex justify-between">
                            <p>Theme</p>
                            <input
                                type="checkbox"
                                aria-label="Toggle black and halloween theme"
                                className="toggle border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                                checked={theme === "halloween"}
                                onChange={toggleTheme}
                                />
                        </div>
                    </div>
                )
            }
        </nav>
    )
}