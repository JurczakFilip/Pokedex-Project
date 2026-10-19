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

export function VerifyCookie()
{
    const cookie = getCookie("sigionpex_cookie")
    if (cookie)
    {
        try {
            
        }
        catch (err)
        {
            console.log("VerifyCookie ERR:", err)
        }
    }
}