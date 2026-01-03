import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  Settings,
  LogOut,
  User,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export function Header({ isDarkMode, toggleDarkMode, toggleSidebar }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const notifications = [
    { id: 1, title: "নতুন লিড যোগ হয়েছে", time: "৫ মিনিট আগে", unread: true },
    { id: 2, title: "ইনভয়েস #১২৩৪ পেমেন্ট হয়েছে", time: "১ ঘন্টা আগে", unread: true },
    { id: 3, title: "প্রজেক্ট মিটিং আজ ৩টায়", time: "২ ঘন্টা আগে", unread: false },
    { id: 4, title: "নতুন টাস্ক অ্যাসাইন হয়েছে", time: "৩ ঘন্টা আগে", unread: false },
  ];

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "লগ আউট সফল",
      description: "আপনি সফলভাবে লগ আউট করেছেন",
    });
    navigate("/auth");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "ইউজার";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="অনুসন্ধান করুন..."
            className={`w-64 pl-9 transition-all duration-300 input-bangla ${
              searchFocused ? "w-80 ring-2 ring-primary/20" : ""
            }`}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Calendar className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <MessageSquare className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-destructive">
                ২
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>নোটিফিকেশন</span>
              <Badge variant="secondary" className="text-xs">২ নতুন</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  {notification.unread && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  <span className={notification.unread ? "font-medium" : ""}>
                    {notification.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground ml-4">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary cursor-pointer justify-center">
              সব নোটিফিকেশন দেখুন
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark Mode Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{initials}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              প্রোফাইল
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              সেটিংস
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              লগ আউট
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
