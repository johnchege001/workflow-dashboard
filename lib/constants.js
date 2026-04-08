function normalizeEnvValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

export const SUPABASE_URL = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);

export const SUPABASE_ANON_KEY = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const SITE_URL =
  normalizeEnvValue(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeEnvValue(process.env.NEXT_PUBLIC_VERCEL_URL);

export const N8N_BASE_URL =
  normalizeEnvValue(process.env.NEXT_PUBLIC_N8N_BASE_URL) ||
  "https://n8n.srv1097341.hstgr.cloud";

export const REFRESH_SECONDS = 900;

export const ADMIN_ROLES = ["cto", "admin"];

export const AUTH_SCREENS = {
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
  CONFIRM: "confirm",
  FORGOT: "forgot",
};
