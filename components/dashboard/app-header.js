function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const SECTION_COPY = {
  home: {
    title: "Home",
    subtitle: "Overview",
  },
  workflows: {
    title: "Workflows",
    subtitle: "Library",
  },
  executions: {
    title: "Executions",
    subtitle: "Activity",
  },
};

export function AppHeader({ activeSection }) {
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
        <div className="header-section-chip">{copy.subtitle}</div>
      </div>
    </header>
  );
}
