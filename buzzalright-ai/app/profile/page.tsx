"use client";

import { useEffect, useRef, useState } from "react";
import { GetUser, type User } from "@/lib/auth";

export default function profile() {
    const [user, setUser] = useState<User | null>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        GetUser().then(setUser);
    }, []);


    // {user?.id} {user?.username} {user?.created_at}
    return (
        <div className="flex justify-center items-center">
            <div className="card w-96 bg-base-200 shadow-sm">
                <div className="card-title text-2xl p-5 bg-base-300">Profile</div>
                {hasRun ? (
                    <div className="card-body">
                        <div className="flex w-52 flex-col gap-4 w-full">
                            <div className="flex items-center gap-4">
                                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                </div>
                            </div>
                            <div className="skeleton h-10 w-full"></div>
                        </div>
                    </div>
                ) : (
                    <div>
                        test
                    </div>
                )}
            </div>
        </div>
    )
}