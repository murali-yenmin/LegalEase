import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FolderOpen,
  Calendar,
  FileText,
  Users,
  Receipt,
  UserRoundCheck,
  Coins,
  BarChart,
  UserCog,
  Settings,
  Scale
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
];

const caseManagementItems: NavItem[] = [
  {
    path: "/cases",
    label: "Cases",
    icon: FolderOpen,
    badge: "24"
  },
  {
    path: "/hearings",
    label: "Hearings",
    icon: Calendar,
  },
  {
    path: "/evidence",
    label: "Evidence",
    icon: FileText,
  },
];

const clientRelationItems: NavItem[] = [
  {
    path: "/clients",
    label: "Clients",
    icon: Users,
    roles: ["admin", "advocate"]
  },
  {
    path: "/documents",
    label: "Documents",
    icon: FileText,
    roles: ["admin", "advocate"]
  },
  {
    path: "/invoices",
    label: "Invoicing",
    icon: Receipt,
    roles: ["admin", "advocate"]
  },
];

const administrationItems: NavItem[] = [
  {
    path: "/staff",
    label: "Staff Management",
    icon: UserRoundCheck,
    roles: ["admin"]
  },
  {
    path: "/expenses",
    label: "Expenses",
    icon: Coins,
    roles: ["admin"]
  },
  {
    path: "/reports",
    label: "Reports",
    icon: BarChart,
    roles: ["admin"]
  },
];

const settingsItems: NavItem[] = [
  {
    path: "/profile",
    label: "Profile",
    icon: UserCog,
  },
  {
    path: "/preferences",
    label: "Preferences",
    icon: Settings,
  },
];

interface NavSectionProps {
  title: string;
  items: NavItem[];
  currentPath: string;
  userRole: string;
}

const NavSection = ({ title, items, currentPath, userRole }: NavSectionProps) => {
  const { hasRole } = useAuth();

  const filteredItems = items.filter(item => 
    !item.roles || hasRole(item.roles)
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="pt-4">
      <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </p>
      {filteredItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <a
            className={cn(
              "sidebar-nav-item",
              currentPath === item.path && "active"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="ml-auto bg-primary-100 text-primary-600 text-xs font-medium"
              >
                {item.badge}
              </Badge>
            )}
          </a>
        </Link>
      ))}
    </div>
  );
};

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "w-64 bg-white shadow-sm h-screen sticky top-16 transition-all duration-300",
        isOpen ? "block" : "hidden lg:block"
      )}
    >
      <nav className="p-4 space-y-2">
        {/* Main Navigation */}
        {navigationItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a
              className={cn(
                "sidebar-nav-item",
                location === item.path && "active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}

        <NavSection
          title="Case Management"
          items={caseManagementItems}
          currentPath={location}
          userRole={user?.role || ""}
        />

        <NavSection
          title="Client Relations"
          items={clientRelationItems}
          currentPath={location}
          userRole={user?.role || ""}
        />

        <NavSection
          title="Administration"
          items={administrationItems}
          currentPath={location}
          userRole={user?.role || ""}
        />

        <NavSection
          title="Settings"
          items={settingsItems}
          currentPath={location}
          userRole={user?.role || ""}
        />
      </nav>
    </aside>
  );
};
