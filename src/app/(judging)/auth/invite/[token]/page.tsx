"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../auth.css";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function activate() {
      try {
        const res = await fetch("/api/auth/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Invalid invite link");
          return;
        }

        setStatus("success");
        if (data.alreadyActivated) {
          setMessage("Welcome back, " + data.name + ". Redirecting to login...");
        } else {
          setMessage("Account activated for " + data.name + ". Redirecting to login...");
        }

        setTimeout(() => {
          router.push("/auth/login/" + token);
        }, 2000);
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }

    if (token) {
      activate();
    }
  }, [token, router]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">HackMol 7.0</h1>
        <p className="auth-subtitle">Judge Portal</p>

        {status === "loading" && (
          <p className="auth-loading">Activating your account...</p>
        )}
        {status === "success" && (
          <p className="auth-success">{message}</p>
        )}
        {status === "error" && (
          <p className="auth-error">{message}</p>
        )}
      </div>
    </div>
  );
}
