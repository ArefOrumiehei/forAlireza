import { Link, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-neutral-100 flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-neutral-700">
          Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/stores"
            className={cn(
              "block rounded-lg px-3 py-2 hover:bg-neutral-800 transition"
            )}
          >
            Stores
          </Link>
          <Link
            to="/tags"
            className={cn(
              "block rounded-lg px-3 py-2 hover:bg-neutral-800 transition"
            )}
          >
            Tags
          </Link>
          <Link
            to="/items"
            className={cn(
              "block rounded-lg px-3 py-2 hover:bg-neutral-800 transition"
            )}
          >
            Items
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-neutral-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
