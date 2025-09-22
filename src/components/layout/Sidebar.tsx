import { Calendar, BarChart3, Settings, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Calendar, href: "/", label: "Calendar" },
  { icon: BarChart3, href: "/analytics", label: "Analytics" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <div className="w-16 bg-background border-r border-border flex flex-col items-center py-6 space-y-6">
      {/* Logo */}
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Calendar className="w-5 h-5 text-primary-foreground" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>

      {/* Add Button */}
      <div className="mt-auto">
        <button className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}