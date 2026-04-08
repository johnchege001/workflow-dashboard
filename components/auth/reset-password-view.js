"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getPasswordStrength } from "@/lib/format";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function ResetPasswordView() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "info", message: "Validating recovery session..." });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const strength = getPasswordStrength(password);

  useEffect(() => {
    let active = true;

    async function validateSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (data.session?.user) {
        setHasSession(true);
        setStatus({
          type: "info",
          message: "Create a new password for your account.",
        });
      } else {
        setStatus({
          type: "error",
          message: "This recovery link is invalid or expired. Request a new one from sign in.",
        });
      }

      setLoading(false);
    }

    void validateSession();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }

      setStatus({ type: "success", message: "Password updated. Redirecting to your dashboard..." });
      window.setTimeout(() => {
        router.replace("/");
      }, 1200);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Failed to update password." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-screen active">
      <div className="auth-card">
        <div className="auth-logo">
          <LockIcon />
        </div>
        <div className="auth-title">Set your new password</div>
        <div className="auth-sub">Outsourcelab / Secure recovery</div>
        <div className={`alert ${status.type} show`}>{status.message}</div>

        {loading || !hasSession ? null : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input
                autoComplete="new-password"
                className="form-input"
                id="newPassword"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                type="password"
                value={password}
              />
              <div className="pw-strength">
                <div className="pw-strength-fill" style={{ width: strength.width, background: strength.color }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                autoComplete="new-password"
                className="form-input"
                id="confirmPassword"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                type="password"
                value={confirmPassword}
              />
            </div>
            <button className={`btn-primary ${submitting ? "loading" : ""}`} disabled={submitting} type="submit">
              <div className="spinner" />
              <span className="btn-label">Save New Password</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
