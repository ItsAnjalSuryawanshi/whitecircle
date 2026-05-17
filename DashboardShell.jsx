"import { Link, useNavigate } from \"react-router-dom\";
import { useAuth } from \"../context/AuthContext\";
import { ShieldCheck, LogOut, Bell } from \"lucide-react\";

export function DashboardShell({ title, navItems, active, onSelect, children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className=\"min-h-screen bg-[#F5F2EA]/40 flex\">
      {/* Sidebar */}
      <aside className=\"w-64 bg-[#050E20] text-white flex flex-col\">
        <div className=\"px-6 py-6 border-b border-white/10\">
          <Link to=\"/\" className=\"flex items-center gap-3\" data-testid=\"sidebar-brand\">
            <div className=\"w-9 h-9 rounded-sm bg-[#D4AF37] flex items-center justify-center\">
              <ShieldCheck className=\"text-[#050E20]\" size={18} />
            </div>
            <div>
              <div className=\"font-serif-display text-lg\">WhiteCircle</div>
              <div className=\"label-overline text-white/50\">{user?.role}</div>
            </div>
          </Link>
        </div>
        <nav className=\"flex-1 px-3 py-4 space-y-1\">
          {navItems.map((item) => (
            <button
              key={item.key}
              data-testid={`nav-${item.key}`}
              onClick={() => onSelect(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors text-left ${
                active === item.key ? \"bg-[#0B2046] text-white\" : \"text-white/70 hover:bg-white/5 hover:text-white\"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className=\"p-3 border-t border-white/10\">
          <button
            onClick={async () => { await logout(); nav(\"/\"); }}
            data-testid=\"sidebar-logout\"
            className=\"w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-white/70 hover:bg-white/5\"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className=\"flex-1 flex flex-col\">
        <header className=\"bg-white border-b border-[#E2E8F0] h-16 flex items-center justify-between px-8\">
          <div>
            <div className=\"label-overline text-[#4A5568]\">{user?.role} workspace</div>
            <h1 className=\"font-serif-display text-xl text-[#0B2046]\">{title}</h1>
          </div>
          <div className=\"flex items-center gap-4\">
            <Bell size={18} className=\"text-[#4A5568]\" />
            <div className=\"text-right\">
              <div className=\"text-sm font-medium text-[#050E20]\">{user?.name}</div>
              <div className=\"text-xs text-[#4A5568]\">{user?.email}</div>
            </div>
            <div className=\"w-9 h-9 rounded-sm bg-[#0B2046] text-white flex items-center justify-center font-serif-display\">
              {user?.name?.[0]?.toUpperCase() || \"U\"}
            </div>
          </div>
        </header>
        <main className=\"p-8 flex-1\">{children}</main>
      </div>
    </div>
  );
}
"