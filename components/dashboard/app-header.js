import { getAvatarInitial, getRoleClass } from "@/lib/format";

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
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

const SECTION_COPY = {
  home: {
    title: "Home",
    subtitle: "Core metrics and the latest execution activity",
  },
  workflows: {
    title: "Workflows",
    subtitle: "Inspect workflow health, details, and destination links",
  },
  executions: {
    title: "Executions",
    subtitle: "Review recorded outcomes and filter by success or error",
  },
};

export function AppHeader({ activeSection, currentProfile, currentUser, onSignOut }) {
  const name = currentProfile?.full_name || currentUser?.email?.split("@")[0] || "\u2014";
  const role = currentProfile?.role || "developer";
  const avatarInitial = getAvatarInitial(name, currentUser?.email);
  const copy = SECTION_COPY[activeSection] || SECTION_COPY.home;

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <LogoIcon />
        </div>
        <div>
          <div className="header-title">{copy.title}</div>
          <div className="header-subtitle">{copy.subtitle}</div>
        </div>
      </div>
      <div className="header-right">
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
