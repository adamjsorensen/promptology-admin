
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight, ListPlus, Settings, Sliders } from "lucide-react";

export function Sidebar() {
  const location = useLocation();
  
  const items = [
    {
      title: "Prompts",
      icon: ListPlus,
      href: "/",
    },
    {
      title: "Parameters",
      icon: Sliders,
      href: "/parameters",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <aside className="border-r min-h-screen w-64 p-6 bg-card">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg">Prompt Admin</span>
        </div>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-accent group",
                location.pathname === item.href
                  ? "bg-accent text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
              <ChevronRight
                className={cn(
                  "ml-auto w-4 h-4 opacity-0 -translate-x-2 transition-all",
                  "group-hover:opacity-100 group-hover:translate-x-0",
                  location.pathname === item.href && "opacity-100 translate-x-0"
                )}
              />
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
