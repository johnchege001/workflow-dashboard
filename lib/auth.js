import { SITE_URL } from "@/lib/constants";

export function getSiteOrigin() {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  if (SITE_URL) {
    if (SITE_URL.startsWith("http://") || SITE_URL.startsWith("https://")) {
      return SITE_URL;
    }

    return `https://${SITE_URL}`;
  }

  return "http://localhost:3000";
}

export function createRedirectUrl(pathname) {
  return new URL(pathname, getSiteOrigin()).toString();
}
