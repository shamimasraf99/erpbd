import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CRMLeads from "./pages/CRMLeads";
import CRMClients from "./pages/CRMClients";
import HRMEmployees from "./pages/HRMEmployees";
import FinanceInvoices from "./pages/FinanceInvoices";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import InventoryStock from "./pages/InventoryStock";
import InventoryPOS from "./pages/InventoryPOS";
import InventoryBarcode from "./pages/InventoryBarcode";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// Wrapper component for pages that need the dashboard layout
const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<DashboardPage><Dashboard /></DashboardPage>} />
            
            {/* CRM Routes */}
            <Route path="/crm/leads" element={<DashboardPage><CRMLeads /></DashboardPage>} />
            <Route path="/crm/clients" element={<DashboardPage><CRMClients /></DashboardPage>} />
            <Route path="/crm/deals" element={<DashboardPage><ComingSoon title="ডিল ম্যানেজমেন্ট" /></DashboardPage>} />
            <Route path="/crm/estimates" element={<DashboardPage><ComingSoon title="এস্টিমেট" /></DashboardPage>} />
            
            {/* HRM Routes */}
            <Route path="/hrm/employees" element={<DashboardPage><HRMEmployees /></DashboardPage>} />
            <Route path="/hrm/attendance" element={<DashboardPage><ComingSoon title="উপস্থিতি ট্র্যাকিং" /></DashboardPage>} />
            <Route path="/hrm/leave" element={<DashboardPage><ComingSoon title="ছুটি ব্যবস্থাপনা" /></DashboardPage>} />
            <Route path="/hrm/payroll" element={<DashboardPage><ComingSoon title="বেতন (Payroll)" /></DashboardPage>} />
            <Route path="/hrm/performance" element={<DashboardPage><ComingSoon title="পারফরম্যান্স রিভিউ" /></DashboardPage>} />
            <Route path="/hrm/goals" element={<DashboardPage><ComingSoon title="গোল ট্র্যাকিং" /></DashboardPage>} />
            
            {/* Project Routes */}
            <Route path="/projects" element={<DashboardPage><Projects /></DashboardPage>} />
            <Route path="/projects/tasks" element={<DashboardPage><ComingSoon title="টাস্ক ম্যানেজমেন্ট" /></DashboardPage>} />
            <Route path="/projects/timesheet" element={<DashboardPage><ComingSoon title="টাইমশিট" /></DashboardPage>} />
            <Route path="/projects/budget" element={<DashboardPage><ComingSoon title="প্রজেক্ট বাজেট" /></DashboardPage>} />
            
            {/* Finance Routes */}
            <Route path="/finance/invoices" element={<DashboardPage><FinanceInvoices /></DashboardPage>} />
            <Route path="/finance/payments" element={<DashboardPage><ComingSoon title="পেমেন্ট ট্র্যাকিং" /></DashboardPage>} />
            <Route path="/finance/expenses" element={<DashboardPage><ComingSoon title="খরচ ব্যবস্থাপনা" /></DashboardPage>} />
            <Route path="/finance/accounting" element={<DashboardPage><ComingSoon title="অ্যাকাউন্টিং" /></DashboardPage>} />
            <Route path="/finance/profit-loss" element={<DashboardPage><ComingSoon title="লাভ-ক্ষতি রিপোর্ট" /></DashboardPage>} />
            
            {/* Inventory Routes */}
            <Route path="/inventory/stock" element={<DashboardPage><InventoryStock /></DashboardPage>} />
            <Route path="/inventory/pos" element={<DashboardPage><InventoryPOS /></DashboardPage>} />
            <Route path="/inventory/barcode" element={<DashboardPage><InventoryBarcode /></DashboardPage>} />
            
            {/* Contract Routes */}
            <Route path="/contracts" element={<DashboardPage><ComingSoon title="কনট্রাক্ট ম্যানেজমেন্ট" /></DashboardPage>} />
            <Route path="/contracts/signature" element={<DashboardPage><ComingSoon title="ডিজিটাল সিগনেচার" /></DashboardPage>} />
            
            {/* User Management */}
            <Route path="/users" element={<DashboardPage><ComingSoon title="ইউজার ম্যানেজমেন্ট" /></DashboardPage>} />
            <Route path="/roles" element={<DashboardPage><ComingSoon title="রোল ও পারমিশন" /></DashboardPage>} />
            
            {/* Other Routes */}
            <Route path="/chat" element={<DashboardPage><ComingSoon title="ইন্টারনাল চ্যাট" /></DashboardPage>} />
            <Route path="/email-templates" element={<DashboardPage><ComingSoon title="ইমেইল টেমপ্লেট" /></DashboardPage>} />
            <Route path="/reports" element={<DashboardPage><ComingSoon title="রিপোর্ট" /></DashboardPage>} />
            <Route path="/ai-assistant" element={<DashboardPage><ComingSoon title="AI সহায়তা" /></DashboardPage>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<DashboardPage><Profile /></DashboardPage>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
