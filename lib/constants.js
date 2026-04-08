function readPublicEnv(name) {
  const value = process.env[name];

  return typeof value === "string" ? value.trim() : "";
}

export const SUPABASE_URL = readPublicEnv("NEXT_PUBLIC_SUPABASE_URL");

export const SUPABASE_ANON_KEY = readPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  "";

export const REFRESH_SECONDS = 900;

export const ADMIN_ROLES = ["cto", "admin"];

export const AUTH_SCREENS = {
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
  CONFIRM: "confirm",
  FORGOT: "forgot",
};
