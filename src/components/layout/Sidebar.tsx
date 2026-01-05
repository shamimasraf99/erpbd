import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Clock,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Handshake,
  FileText,
  FolderKanban,
  ListTodo,
  Timer,
  Wallet,
  Receipt,
  CreditCard,
  PiggyBank,
  Calculator,
  BarChart3,
  Package,
  ShoppingCart,
  Barcode,
  FileSignature,
  Bell,
  MessageSquare,
  Mail,
  PieChart,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Building2,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
  requiredRole?: 'admin' | 'manager' | 'employee';
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", href: "/" },
  {
    icon: Users,
    label: "ইউজার ম্যানেজমেন্ট",
    requiredRole: 'admin',
    children: [
      { label: "সকল ইউজার", href: "/users" },
      { label: "রোল ও পারমিশন", href: "/roles" },
    ],
  },
  {
    icon: UserCog,
    label: "HRM",
    requiredRole: 'employee',
    children: [
      { label: "কর্মী তালিকা", href: "/hrm/employees" },
      { label: "উপস্থিতি", href: "/hrm/attendance" },
      { label: "ছুটি ব্যবস্থাপনা", href: "/hrm/leave" },
      { label: "বেতন (Payroll)", href: "/hrm/payroll" },
      { label: "পারফরম্যান্স", href: "/hrm/performance" },
      { label: "গোল ট্র্যাকিং", href: "/hrm/goals" },
    ],
  },
  {
    icon: Handshake,
    label: "CRM ও প্রি-সেল",
    requiredRole: 'employee',
    children: [
      { label: "লিড", href: "/crm/leads" },
      { label: "ডিল", href: "/crm/deals" },
      { label: "এস্টিমেট", href: "/crm/estimates" },
      { label: "ক্লায়েন্ট", href: "/crm/clients" },
    ],
  },
  {
    icon: FolderKanban,
    label: "প্রজেক্ট",
    requiredRole: 'employee',
    children: [
      { label: "সকল প্রজেক্ট", href: "/projects" },
      { label: "টাস্ক", href: "/projects/tasks" },
      { label: "টাইমশিট", href: "/projects/timesheet" },
      { label: "বাজেট", href: "/projects/budget" },
    ],
  },
  {
    icon: Calculator,
    label: "হিসাব ও ফাইন্যান্স",
    requiredRole: 'employee',
    children: [
      { label: "ইনভয়েস", href: "/finance/invoices" },
      { label: "পেমেন্ট", href: "/finance/payments" },
      { label: "খরচ", href: "/finance/expenses" },
      { label: "অ্যাকাউন্টিং", href: "/finance/accounting" },
      { label: "লাভ-ক্ষতি", href: "/finance/profit-loss" },
    ],
  },
  {
    icon: Package,
    label: "ইনভেন্টরি ও POS",
    requiredRole: 'employee',
    children: [
      { label: "স্টক ম্যানেজমেন্ট", href: "/inventory/stock" },
      { label: "POS বিলিং", href: "/inventory/pos" },
      { label: "বারকোড প্রিন্ট", href: "/inventory/barcode" },
    ],
  },
  {
    icon: FileSignature,
    label: "কনট্রাক্ট",
    requiredRole: 'manager',
    children: [
      { label: "সকল কনট্রাক্ট", href: "/contracts" },
      { label: "ডিজিটাল সিগনেচার", href: "/contracts/signature" },
    ],
  },
  { icon: MessageSquare, label: "ইন্টারনাল চ্যাট", href: "/chat" },
  { icon: Mail, label: "ইমেইল টেমপ্লেট", href: "/email-templates" },
  { icon: PieChart, label: "রিপোর্ট", href: "/reports", requiredRole: 'manager' },
  { icon: Sparkles, label: "AI সহায়তা", href: "/ai-assistant" },
  { icon: UserCircle, label: "প্রোফাইল", href: "/profile" },
  { icon: Settings, label: "সেটিংস", href: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { role, isAdmin, isManager, isEmployee } = useUserRole();
  const [expandedItems, setExpandedItems] = useState<string[]>(["HRM", "CRM ও প্রি-সেল"]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string, children?: { href: string }[]) => {
    if (href) return location.pathname === href;
    if (children) return children.some((child) => location.pathname === child.href);
    return false;
  };

  // Filter menu items based on user role
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.requiredRole) return true;
      
      switch (item.requiredRole) {
        case 'admin':
          return isAdmin;
        case 'manager':
          return isAdmin || isManager;
        case 'employee':
          return isAdmin || isManager || isEmployee;
        default:
          return true;
      }
    });
  }, [isAdmin, isManager, isEmployee]);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground overflow-hidden flex flex-col"
      style={{ background: 'var(--gradient-sidebar)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Building2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-primary-foreground">বিজনেস ERP</h1>
          <p className="text-xs text-sidebar-foreground/60">ব্যবসা ব্যবস্থাপনা</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      "sidebar-item w-full justify-between",
                      isActive(undefined, item.children) && "bg-sidebar-accent/50"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.label}</span>
                    </span>
                    {expandedItems.includes(item.label) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.label) && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            className={cn(
                              "sidebar-item text-sm",
                              location.pathname === child.href && "active"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "sidebar-item",
                    location.pathname === item.href && "active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.email?.split("@")[0] || "ইউজার"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">প্রোফাইল দেখুন</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
