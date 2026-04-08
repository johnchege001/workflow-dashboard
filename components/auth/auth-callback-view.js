"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function AuthCallbackView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();
  const [status, setStatus] = useState("Completing secure sign-in...");

  useEffect(() => {
    let active = true;

    async function finishAuth() {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/";

      if (!code) {
        if (active) {
          setStatus("The authentication link is missing its code. Request a new email.");
        }
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!active) {
        return;
      }

      if (error) {
        setStatus(error.message || "This link has expired. Request a new email.");
        return;
      }

      router.replace(next);
    }

    void finishAuth();

    return () => {
      active = false;
    };
  }, [router, searchParams, supabase]);

  return (
    <section className="auth-screen active">
      <div className="auth-card">
        <div className="auth-logo">
          <MailIcon />
        </div>
        <div className="auth-title">Securing your session</div>
        <div className="auth-sub">Outsourcelab / Auth callback</div>
        <div className="alert info show">{status}</div>
      </div>
    </section>
  );
}
