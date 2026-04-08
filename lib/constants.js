export const DEFAULT_SUPABASE_URL = "https://jfezbrovapbucbjeyedk.supabase.co";

export const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZXpicm92YXBidWNiamV5ZWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjgwNjgsImV4cCI6MjA4NzIwNDA2OH0.i4vAaoY2tOttLrPBZNDtGQ8ZZQKUOPk3wxFLRWC_sp4";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? DEFAULT_SUPABASE_ANON_KEY;

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
