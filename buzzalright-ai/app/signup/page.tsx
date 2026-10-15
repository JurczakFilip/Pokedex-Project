"use client";

import { useState } from "react";

async function SubmitSignup(username, password, setAlert) {
    try {
        const response = await fetch(
            `http://localhost:5000/signup?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        );

        const data = await response.json();

        // Map backend status codes to alert styles and icons
        const alerts = {
            0: {
                className: "alert-error",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        className="h-6 w-6 shrink-0 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                ),
            },
            1: {
                className: "alert-success",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        className="h-6 w-6 shrink-0 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7" />
                    </svg>
                ),
            },
            2: {
                className: "alert-warning",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        className="h-6 w-6 shrink-0 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
                    </svg>
                ),
            },
        };

        const alert = alerts[data.status] ?? {
            className: "alert-info",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        };

        setAlert({
            ...alert,
            message: data.message ?? "No message received.",
            visible: true,
        });

        // Keep your cookie logic for when the backend returns a token.
        if (data.sigionpex && data.end_time) {
            const expiryDate = new Date(data.end_time);

            if (!isNaN(expiryDate.getTime()) && expiryDate > new Date()) {
                document.cookie =
                    `sigionpex_cookie=${encodeURIComponent(data.sigionpex)}; ` +
                    `expires=${expiryDate.toUTCString()}; ` +
                    `path=/; SameSite=Lax`;
            }
        }

        console.log(data);

    } catch (error) {
        setAlert({
            className: "alert-error",
            message: "Could not connect to the server.",
            visible: true,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 6l12 12M18 6L6 18" />
                </svg>
            ),
        });
    }
}

export default function Signup() {
    const [alert, setAlert] = useState({
        visible: false,
        className: "alert-info",
        message: "",
        icon: null,
    });

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        SubmitSignup(username, password, setAlert);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <form
                onSubmit={handleSubmit}
                className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
            >
                <legend className="fieldset-legend">Signup</legend>

                <label htmlFor="username" className="label">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    className="input"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />

                <label htmlFor="password" className="label">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                <button type="submit" className="btn btn-neutral mt-4">
                    Sign up
                </button>

                <a
                    className="justify-self-center hover:text-blue-500"
                    href="/login"
                >
                    Already have an account?
                </a>
            </form>

            {alert.visible && (
                <div
                    role="alert"
                    className={`alert ${alert.className} w-xs`}
                    aria-live="polite"
                >
                    {alert.icon}
                    <span>{alert.message}</span>
                </div>
            )}
        </div>
    );
}