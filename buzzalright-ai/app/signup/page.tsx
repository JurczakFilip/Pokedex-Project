"use client";

async function SubmitSignup()
{

    const username = document.getElementById("username").value || "";
    const password = document.getElementById("password").value || "";

    const response = await fetch(`http://localhost:5000/test?username=${username}&password=${password}`);

    const data = await response.json();
    console.log(data);
}

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Signup</legend>

                <label className="label">Username</label>
                <input id="username" type="username" className="input" placeholder="Username" />

                <label className="label">Password</label>
                <input id="password" type="password" className="input" placeholder="Password" />

                <button className="btn btn-neutral mt-4" onClick={SubmitSignup}>Sign up</button>

                <a className="justify-self-center hover:text-blue-500" href="/login">Already have an account?</a>
            </fieldset>
        </div>
    );
}
