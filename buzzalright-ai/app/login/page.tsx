"use client";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Username</label>
                <input type="username" className="input" placeholder="Username" />

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" />

                <button className="btn btn-neutral mt-4">Login</button>

                <a className="justify-self-center hover:text-blue-500" href="/signup">Don't have an account?</a>
            </fieldset>
        </div>
    );
}
