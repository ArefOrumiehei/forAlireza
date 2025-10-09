import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Store, Package, LogOut, TagIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardLayout() {
  const {logout} = useAuthStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const links = [
    { to: "/stores", label: "Stores", icon: Store },
    { to: "/items", label: "Items", icon: Package },
    { to: "/tags", label: "Tags", icon: TagIcon },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-neutral-900 text-neutral-100 flex flex-col transition-all duration-300">
        <div className="p-4 text-xl font-bold border-b border-neutral-700 hidden md:block">
          <Link to={"/"}>Dashboard</Link>
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

        {/* Logout button */}
        <div className="p-2 md:p-4 border-t border-neutral-700 flex justify-center md:justify-start">
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="text-red-400 hover:text-red-500 hover:bg-neutral-800 w-full flex items-center justify-center md:justify-start gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-neutral-50 p-6 overflow-auto">
        <Outlet />
      </main>

      {/* Logout Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
