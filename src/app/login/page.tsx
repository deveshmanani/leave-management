import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In - HLMS",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">HLMS</h1>
          <p className="text-sm text-muted-foreground">
            Haat Leave Management System
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive"
          >
            {error === "AccessDenied"
              ? "Access denied. Only @haat.delivery email addresses are allowed."
              : "An error occurred during sign in. Please try again."}
          </div>
        )}

        <LoginForm />

        <p className="text-center text-xs text-muted-foreground">
          Only <span className="font-medium">@haat.delivery</span> accounts can
          access this platform.
        </p>
      </div>
    </main>
  );
}
