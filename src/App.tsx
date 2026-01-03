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
import NotFound from "./pages/NotFound";

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
            <Route path="/crm/leads" element={<DashboardPage><CRMLeads /></DashboardPage>} />
            <Route path="/crm/clients" element={<DashboardPage><CRMClients /></DashboardPage>} />
            <Route path="/hrm/employees" element={<DashboardPage><HRMEmployees /></DashboardPage>} />
            <Route path="/finance/invoices" element={<DashboardPage><FinanceInvoices /></DashboardPage>} />
            <Route path="/projects" element={<DashboardPage><Projects /></DashboardPage>} />
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
