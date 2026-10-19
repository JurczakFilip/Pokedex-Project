"use client";

function getCookie(cname: string): string {
  if (typeof document === "undefined") {
    return "";
  }

  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export async function VerifyCookie()
{
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const cookie = getCookie("sigionpex_cookie");
    if (cookie)
    {
        try {
            console.log("[glock] Cookie found");
            const response = await fetch(
                `http://localhost:5000/verifycookie?sigionpex=${encodeURIComponent(cookie)}`
            );

            const data = await response.json();
            console.log("Data Returned!\n", data);

            if ((pathname == "/signup" || "/login") && data.status == 1)
            {
                window.location.replace("/");
            }
        }
        catch (err)
        {
            console.log("[glock] VerifyCookie ERROR:", err);
        }
    }
}

export type User = {
    username: string;
    created_at: string;
};

export async function GetUser(): Promise<User | null>
{
    const cookie = getCookie("sigionpex_cookie");
    if (cookie)
    {
        try
        {
            const response = await fetch(
                `/getuser?sigionpex=${encodeURIComponent(cookie)}`
            );
            const data = await response.json();

            if (data?.UserData)
            {
                console.log(`[${data.status}] USER DATA RETURNED!\n`, data.UserData);
                return data.UserData as User;
            }

            return null;
        }
        catch (err)
        {
            console.log("[glock] ERROR GetUser(): ", err);
            return null;
        }
    }
    else
    {
        console.log("[glock] cookie not found, didnt search for user.");
        return null;
    }
}
