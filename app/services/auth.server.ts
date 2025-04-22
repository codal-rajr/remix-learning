import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";

type User = {
  email: string;
  password: string;
};

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth-session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.COOKIE_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<User>();


export async function authenticate(request: Request, returnTo?: string) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");
  console.log(user)
  if (user) return user;
  if (returnTo) session.set("returnTo", returnTo);
  throw redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
