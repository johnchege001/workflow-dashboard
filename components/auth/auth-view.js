"use client";

import { AUTH_SCREENS } from "@/lib/constants";
import { getPasswordStrength } from "@/lib/format";

function AlertBox({ alert }) {
  if (!alert) {
    return null;
  }

  return <div className={`alert ${alert.type} show`}>{alert.message}</div>;
}

function LoadingButton({ className = "btn-primary", loading, disabled, children, ...props }) {
  return (
    <button
      className={`${className} ${loading ? "loading" : ""}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      <div className="spinner" />
      <span className="btn-label">{children}</span>
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function AuthCard({ children }) {
  return <div className="auth-card">{children}</div>;
}

function AuthLogo({ icon }) {
  return <div className="auth-logo">{icon}</div>;
}

export function AuthView({ controller }) {
  const signUpStrength = getPasswordStrength(controller.forms.signUp.password);

  if (controller.screen === AUTH_SCREENS.SIGN_UP) {
    return (
      <section className="auth-screen active">
        <AuthCard>
          <AuthLogo icon={<ArrowIcon />} />
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Outsourcelab / Workflow Dashboard</div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void controller.signUp();
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="suName">Full Name</label>
              <input
                className="form-input"
                id="suName"
                onChange={(event) => controller.updateForm("signUp", "name", event.target.value)}
                placeholder="Jane Smith"
                type="text"
                value={controller.forms.signUp.name}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="suEmail">Email</label>
              <input
                autoComplete="email"
                className="form-input"
                id="suEmail"
                onChange={(event) => controller.updateForm("signUp", "email", event.target.value)}
                placeholder="you@company.com"
                type="email"
                value={controller.forms.signUp.email}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="suPassword">Password</label>
              <input
                autoComplete="new-password"
                className="form-input"
                id="suPassword"
                onChange={(event) => controller.updateForm("signUp", "password", event.target.value)}
                placeholder="Min. 8 characters"
                type="password"
                value={controller.forms.signUp.password}
              />
              <div className="pw-strength">
                <div className="pw-strength-fill" style={{ width: signUpStrength.width, background: signUpStrength.color }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="suPassword2">Confirm Password</label>
              <input
                autoComplete="new-password"
                className="form-input"
                id="suPassword2"
                onChange={(event) => controller.updateForm("signUp", "confirmPassword", event.target.value)}
                placeholder="........"
                type="password"
                value={controller.forms.signUp.confirmPassword}
              />
            </div>
            <LoadingButton loading={controller.loading.signUp} type="submit">Create Account</LoadingButton>
          </form>
          <AlertBox alert={controller.alerts.signUp} />
          <div className="auth-footer">
            Already have an account?{" "}
            <button onClick={() => controller.showScreen(AUTH_SCREENS.SIGN_IN)} type="button">Sign in</button>
          </div>
        </AuthCard>
      </section>
    );
  }

  if (controller.screen === AUTH_SCREENS.CONFIRM) {
    return (
      <section className="auth-screen active">
        <AuthCard>
          <AuthLogo icon={<MailIcon />} />
          <div className="auth-title">Check your inbox</div>
          <div className="auth-sub">We sent a secure confirmation link to {controller.pendingEmail}</div>
          <div className="auth-copy">
            Open the email from Outsourcelab and confirm your account. The link will bring you back here securely.
          </div>
          <AlertBox alert={controller.alerts.confirmError} />
          <AlertBox alert={controller.alerts.confirmSuccess} />
          <div className="resend-row">
            Need another link?{" "}
            <button
              disabled={controller.resendRemaining > 0}
              onClick={() => {
                void controller.resendConfirmation();
              }}
              type="button"
            >
              Resend email
            </button>
            <span>{controller.resendRemaining > 0 ? ` (${controller.resendRemaining}s)` : ""}</span>
          </div>
          <div className="auth-footer">
            <button onClick={() => controller.showScreen(AUTH_SCREENS.SIGN_IN)} type="button">Back to sign in</button>
          </div>
        </AuthCard>
      </section>
    );
  }

  if (controller.screen === AUTH_SCREENS.FORGOT) {
    return (
      <section className="auth-screen active">
        <AuthCard>
          <AuthLogo icon={<LockIcon />} />
          <div className="auth-title">Forgot password?</div>
          <div className="auth-sub">We&apos;ll send a secure reset link to your email</div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void controller.requestPasswordReset();
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="fpEmail">Email</label>
              <input
                className="form-input"
                id="fpEmail"
                onChange={(event) => controller.updateForm("forgot", "email", event.target.value)}
                placeholder="you@company.com"
                type="email"
                value={controller.forms.forgot.email}
              />
            </div>
            <LoadingButton loading={controller.loading.forgot} type="submit">Send Reset Code</LoadingButton>
          </form>
          <AlertBox alert={controller.alerts.forgotError} />
          <AlertBox alert={controller.alerts.forgotSuccess} />
          <div className="auth-footer">
            <button onClick={() => controller.showScreen(AUTH_SCREENS.SIGN_IN)} type="button">Back to sign in</button>
          </div>
        </AuthCard>
      </section>
    );
  }

  return (
    <section className="auth-screen active">
      <AuthCard>
        <AuthLogo icon={<ArrowIcon />} />
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Outsourcelab / Workflow Dashboard</div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void controller.signIn();
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="siEmail">Email</label>
            <input
              autoComplete="email"
              className="form-input"
              id="siEmail"
              onChange={(event) => controller.updateForm("signIn", "email", event.target.value)}
              placeholder="you@company.com"
              type="email"
              value={controller.forms.signIn.email}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="siPassword">Password</label>
            <input
              autoComplete="current-password"
              className="form-input"
              id="siPassword"
              onChange={(event) => controller.updateForm("signIn", "password", event.target.value)}
              placeholder="........"
              type="password"
              value={controller.forms.signIn.password}
            />
          </div>
          <div className="auth-action-row">
            <button className="btn-link" onClick={() => controller.showScreen(AUTH_SCREENS.FORGOT)} type="button">
              Forgot password?
            </button>
          </div>
          <LoadingButton disabled={controller.booting} loading={controller.loading.signIn} type="submit">Sign In</LoadingButton>
        </form>
        <AlertBox alert={controller.alerts.signIn} />
        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <button onClick={() => controller.showScreen(AUTH_SCREENS.SIGN_UP)} type="button">Create one</button>
        </div>
      </AuthCard>
    </section>
  );
}
