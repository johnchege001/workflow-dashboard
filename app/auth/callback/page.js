import { Suspense } from "react";

import { AuthCallbackView } from "@/components/auth/auth-callback-view";

function CallbackFallback() {
  return (
    <section className="auth-screen active">
      <div className="auth-card">
        <div className="auth-title">Securing your session</div>
        <div className="auth-sub">Outsourcelab / Auth callback</div>
        <div className="alert info show">Completing secure sign-in...</div>
      </div>
    </section>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackView />
    </Suspense>
  );
}
