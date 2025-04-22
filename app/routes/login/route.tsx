import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { sessionStorage } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  if (user) return redirect("/");
  return json(null);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.formData();

    const session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );
    session.set("user", {
      email: body.get("email"),
      password: body.get("password"),
    });
    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message });
    }
    throw error;
  }
}

const Login = () => {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>Login</h1>

      {actionData?.error ? (
        <div className="error">{actionData.error}</div>
      ) : null}

      <Form method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit">Sign In</button>
      </Form>
    </div>
  );
};

export default Login;
