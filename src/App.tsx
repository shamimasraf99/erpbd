import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CRMLeads from "./pages/CRMLeads";
import HRMEmployees from "./pages/HRMEmployees";
import FinanceInvoices from "./pages/FinanceInvoices";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component for pages that need the dashboard layout
const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crm/leads" element={<DashboardPage><CRMLeads /></DashboardPage>} />
          <Route path="/hrm/employees" element={<DashboardPage><HRMEmployees /></DashboardPage>} />
          <Route path="/finance/invoices" element={<DashboardPage><FinanceInvoices /></DashboardPage>} />
          <Route path="/projects" element={<DashboardPage><Projects /></DashboardPage>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
