"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";

import { createRedirectUrl } from "@/lib/auth";
import { ADMIN_ROLES, AUTH_SCREENS } from "@/lib/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const INITIAL_ALERTS = {
  signIn: null,
  signUp: null,
  confirmError: null,
  confirmSuccess: null,
  forgotError: null,
  forgotSuccess: null,
};

function createInitialForms() {
  return {
    signIn: { email: "", password: "" },
    signUp: { name: "", email: "", password: "", confirmPassword: "" },
    forgot: { email: "" },
  };
}

function fallbackProfile(user) {
  return {
    role: "developer",
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    email: user.email,
  };
}

export function useAuthController() {
  const supabase = getSupabaseBrowserClient();

  const [screen, setScreen] = useState(AUTH_SCREENS.SIGN_IN);
  const [booting, setBooting] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [forms, setForms] = useState(createInitialForms);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [loading, setLoading] = useState({});
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendRemaining, setResendRemaining] = useState(0);

  const isAdmin = Boolean(currentProfile && ADMIN_ROLES.includes(currentProfile.role));

  function setAlert(key, message, type = "error") {
    setAlerts((current) => ({
      ...current,
      [key]: message ? { message, type } : null,
    }));
  }

  function clearAlerts() {
    setAlerts(INITIAL_ALERTS);
  }

  function setLoadingState(key, value) {
    setLoading((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateForm(section, field, value) {
    setForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function showScreen(nextScreen) {
    clearAlerts();
    startTransition(() => {
      setScreen(nextScreen);
    });
  }

  const bootUser = useEffectEvent(async (user) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    setCurrentUser(user);
    setCurrentProfile(data || fallbackProfile(user));
  });

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        if (data.session?.user) await bootUser(data.session.user);
      } finally {
        if (active) setBooting(false);
      }
    }

    void restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void bootUser(session.user);
        return;
      }

      if (!active) return;
      setCurrentUser(null);
      setCurrentProfile(null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [bootUser, supabase]);

  useEffect(() => {
    if (resendRemaining <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [resendRemaining]);

  async function signIn() {
    const email = forms.signIn.email.trim();
    const password = forms.signIn.password;

    if (!email || !password) {
      setAlert("signIn", "Please enter your email and password.");
      return;
    }

    setLoadingState("signIn", true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await bootUser(data.user);
    } catch (error) {
      setAlert("signIn", error.message || "Sign in failed. Check your credentials.");
    } finally {
      setLoadingState("signIn", false);
    }
  }

  async function signUp() {
    const name = forms.signUp.name.trim();
    const email = forms.signUp.email.trim();
    const password = forms.signUp.password;
    const confirmPassword = forms.signUp.confirmPassword;

    if (!name) return setAlert("signUp", "Please enter your full name.");
    if (!email) return setAlert("signUp", "Please enter your email.");
    if (password.length < 8) return setAlert("signUp", "Password must be at least 8 characters.");
    if (password !== confirmPassword) return setAlert("signUp", "Passwords do not match.");

    setLoadingState("signUp", true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: createRedirectUrl("/auth/callback?next=/"),
        },
      });

      if (error) throw error;

      setPendingEmail(email);
      setResendRemaining(60);
      showScreen(AUTH_SCREENS.CONFIRM);
    } catch (error) {
      setAlert("signUp", error.message || "Sign up failed. Please try again.");
    } finally {
      setLoadingState("signUp", false);
    }
  }

  async function resendConfirmation() {
    setAlert("confirmError", null);

    try {
      const { error } = await supabase.auth.resend({
        email: pendingEmail,
        type: "signup",
        options: {
          emailRedirectTo: createRedirectUrl("/auth/callback?next=/"),
        },
      });

      if (error) throw error;

      setAlert("confirmSuccess", "New confirmation email sent. Check your inbox.", "success");
      setResendRemaining(60);
    } catch (error) {
      setAlert("confirmError", error.message || "Failed to resend. Please try again.");
    }
  }

  async function requestPasswordReset() {
    const email = forms.forgot.email.trim();
    if (!email) return setAlert("forgotError", "Please enter your email.");

    setLoadingState("forgot", true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: createRedirectUrl("/auth/callback?next=/reset-password"),
      });

      if (error) throw error;

      setAlert(
        "forgotSuccess",
        `If an account exists for ${email}, a secure reset link has been sent.`,
        "success",
      );
    } catch (error) {
      setAlert(
        "forgotSuccess",
        `If an account exists for ${email}, a secure reset link has been sent.`,
        "success",
      );
    } finally {
      setLoadingState("forgot", false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentProfile(null);
    setForms((current) => ({
      ...createInitialForms(),
      signIn: { email: current.signIn.email, password: "" },
    }));
    setPendingEmail("");
    setResendRemaining(0);
    clearAlerts();
    startTransition(() => setScreen(AUTH_SCREENS.SIGN_IN));
  }

  return {
    alerts,
    booting,
    currentProfile,
    currentUser,
    forms,
    isAdmin,
    loading,
    pendingEmail,
    resendRemaining,
    screen,
    requestPasswordReset,
    resendConfirmation,
    showScreen,
    signIn,
    signOut,
    signUp,
    updateForm,
  };
}
