import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import { sessionStorage } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  if (!user) return redirect("/login");
  return user;
}

export default function ProtectedRoute() {
  return (
    <div>
      <Form method="post" action="/logout?index" style={{marginBottom:"20px"}}>
        <button type="submit">Logout</button>
      </Form>
      <Outlet />
    </div>
  );
}
