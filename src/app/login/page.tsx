import { Suspense } from "react";
import { LoginForm } from "./login-form";

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: "That sign-in link is missing its token. Request a new one below.",
  expired_link: "That sign-in link has expired or was already used. Request a new one.",
  not_invited:
    "That email hasn't been added to the program yet. Ask an admin to add you as a participant.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold">Alpha Nodus Advocacy</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in with your work email — no password needed.
          </p>
        </div>

        {error && ERROR_MESSAGES[error] && (
          <div className="mb-4 rounded-lg bg-danger-muted px-4 py-3 text-sm text-danger">
            {ERROR_MESSAGES[error]}
          </div>
        )}

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
