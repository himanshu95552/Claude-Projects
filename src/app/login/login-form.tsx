"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Card>
        <CardBody className="text-center">
          <p className="text-sm">
            If <strong>{email}</strong> is registered, a sign-in link is on its way. Check your
            inbox — the link expires in 15 minutes.
          </p>
          <p className="mt-3 text-xs text-muted">
            Running locally without email configured? Check the server console for the link.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="email"
        required
        placeholder="you@alphanodus.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send sign-in link"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-danger">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
