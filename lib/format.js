export function percent(part, total) {
  if (!total) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

export function formatRelativeDate(value) {
  if (!value) {
    return "\u2014";
  }

  const date = new Date(value);
  const now = new Date();
  const diffSeconds = Math.max(0, Math.floor((now - date) / 1000));

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  }

  if (diffSeconds < 3600) {
    return `${Math.floor(diffSeconds / 60)}m ago`;
  }

  if (diffSeconds < 86400) {
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatFullDate(value) {
  if (!value) {
    return "\u2014";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncateText(value, length) {
  if (!value) {
    return "\u2014";
  }

  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length)}...`;
}

export function getPasswordStrength(value) {
  let score = 0;

  if (value.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(value)) {
    score += 1;
  }

  if (/[0-9]/.test(value)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(value)) {
    score += 1;
  }

  const colors = ["#c0392b", "#e67e22", "#f1c40f", "#1a7a4a"];
  const widths = ["25%", "50%", "75%", "100%"];

  return {
    score,
    width: score > 0 ? widths[score - 1] : "0%",
    color: score > 0 ? colors[score - 1] : "transparent",
  };
}

export function getAvatarInitial(name, email) {
  const source = name || email || "?";
  return source.trim().charAt(0).toUpperCase();
}

export function getRoleClass(role) {
  if (role === "cto" || role === "admin" || role === "manager" || role === "developer") {
    return `role-${role}`;
  }

  return "role-developer";
}
