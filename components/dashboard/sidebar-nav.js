"use client";

import { getAvatarInitial, getRoleClass } from "@/lib/format";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="7" height="7" rx="1.5" />
      <rect x="14" y="4" width="7" height="7" rx="1.5" />
      <rect x="14" y="13" width="7" height="7" rx="1.5" />
      <path d="M10 7.5h4" />
      <path d="M17.5 11v2" />
    </svg>
  );
}

function ExecutionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19h16" />
      <path d="M7 15 10.5 11.5 13 14l4-5" />
      <path d="m15 9 2-.5L16.5 6" />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    Icon: HomeIcon,
  },
  {
    id: "workflows",
    label: "Workflows",
    Icon: WorkflowIcon,
  },
  {
    id: "executions",
    label: "Executions",
    Icon: ExecutionIcon,
  },
];

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function SidebarNav({ activeSection, counts, currentProfile, currentUser, onSelectSection, onSignOut }) {
  const name = currentProfile?.full_name || currentUser?.email?.split("@")[0] || "User";
  const role = currentProfile?.role || "developer";
  const avatarInitial = getAvatarInitial(name, currentUser?.email);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo sidebar-logo">
          <WorkflowIcon />
        </div>
        <div>
          <div className="sidebar-title">Workflow Dashboard</div>
          <div className="sidebar-subtitle">Outsourcelab / Operations</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard sections">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`sidebar-link ${activeSection === id ? "active" : ""}`}
            onClick={() => onSelectSection(id)}
            type="button"
          >
            <span className="sidebar-link-icon">
              <Icon />
            </span>
            <span className="sidebar-link-copy">
              <span className="sidebar-link-label">{label}</span>
            </span>
            <span className="sidebar-link-count">{counts[id]}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="sidebar-profile-head">
          <div className="user-avatar sidebar-avatar">{avatarInitial}</div>
          <div className="sidebar-profile-copy">
            <div className="sidebar-profile-name">{name}</div>
            <div className="sidebar-profile-role">{role}</div>
          </div>
          <span className={`role-badge ${getRoleClass(role)}`}>{role.toUpperCase()}</span>
        </div>
        <button className="sidebar-signout" onClick={onSignOut} type="button">
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </aside>
  );
}
