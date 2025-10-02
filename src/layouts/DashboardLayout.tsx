import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Store, Package } from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();

  const links = [
    { to: "/stores", label: "Stores", icon: Store },
    { to: "/items", label: "Items", icon: Package },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-neutral-900 text-neutral-100 flex flex-col transition-all duration-300">
        <div className="p-4 text-xl font-bold border-b border-neutral-700 hidden md:block">
          Dashboard
        </div>
        <nav className="flex-1 p-2 md:p-4 space-y-2 flex flex-col items-center md:items-stretch">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 w-full md:justify-start justify-center transition",
                  isActive ? "bg-neutral-800" : "hover:bg-neutral-800"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-neutral-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
