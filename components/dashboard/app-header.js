import { getAvatarInitial, getRoleClass } from "@/lib/format";

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9A9 9 0 0 1 18.36 5.64L23 10" />
      <path d="M1 14 5.64 18.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function AppHeader({ currentProfile, currentUser, lastUpdated, refreshing, onRefresh, onSignOut }) {
  const name = currentProfile?.full_name || currentUser?.email?.split("@")[0] || "\u2014";
  const role = currentProfile?.role || "developer";
  const avatarInitial = getAvatarInitial(name, currentUser?.email);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <LogoIcon />
        </div>
        <div>
          <div className="header-title">Workflow Dashboard</div>
          <div className="header-subtitle">Outsourcelab / Operations Monitor</div>
        </div>
      </div>
      <div className="header-right">
        <div className="refresh-indicator">
          <div className="pulse-dot" />
          <span>Live</span>
        </div>
        <div className="last-updated">{lastUpdated}</div>
        <button className={`btn-refresh ${refreshing ? "spinning" : ""}`} onClick={onRefresh} type="button">
          <RefreshIcon />
          Refresh
        </button>
        <div className="user-chip">
          <div className="user-avatar">{avatarInitial}</div>
          <div>
            <div className="user-name">{name}</div>
            <div className="user-role-label">{role}</div>
          </div>
          <span className={`role-badge ${getRoleClass(role)}`}>{role.toUpperCase()}</span>
        </div>
        <button className="btn-logout" onClick={onSignOut} type="button">
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </header>
  );
}
