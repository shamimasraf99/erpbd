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
import CRMDeals from "./pages/CRMDeals";
import CRMEstimates from "./pages/CRMEstimates";
import HRMEmployees from "./pages/HRMEmployees";
import HRMAttendance from "./pages/HRMAttendance";
import HRMLeave from "./pages/HRMLeave";
import HRMPayroll from "./pages/HRMPayroll";
import HRMPerformance from "./pages/HRMPerformance";
import HRMGoals from "./pages/HRMGoals";
import FinanceInvoices from "./pages/FinanceInvoices";
import FinanceExpenses from "./pages/FinanceExpenses";
import FinancePayments from "./pages/FinancePayments";
import FinanceAccounting from "./pages/FinanceAccounting";
import FinanceProfitLoss from "./pages/FinanceProfitLoss";
import Projects from "./pages/Projects";
import ProjectTasks from "./pages/ProjectTasks";
import ProjectTimesheet from "./pages/ProjectTimesheet";
import ProjectBudget from "./pages/ProjectBudget";
import Contracts from "./pages/Contracts";
import DigitalSignature from "./pages/DigitalSignature";
import Reports from "./pages/Reports";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import InventoryStock from "./pages/InventoryStock";
import InventoryPOS from "./pages/InventoryPOS";
import InventoryBarcode from "./pages/InventoryBarcode";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import InternalChat from "./pages/InternalChat";
import EmailTemplates from "./pages/EmailTemplates";

const queryClient = new QueryClient();

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
            <Route path="/crm/deals" element={<DashboardPage><CRMDeals /></DashboardPage>} />
            <Route path="/crm/estimates" element={<DashboardPage><CRMEstimates /></DashboardPage>} />
            
            {/* HRM Routes */}
            <Route path="/hrm/employees" element={<DashboardPage><HRMEmployees /></DashboardPage>} />
            <Route path="/hrm/attendance" element={<DashboardPage><HRMAttendance /></DashboardPage>} />
            <Route path="/hrm/leave" element={<DashboardPage><HRMLeave /></DashboardPage>} />
            <Route path="/hrm/payroll" element={<DashboardPage><HRMPayroll /></DashboardPage>} />
            <Route path="/hrm/performance" element={<DashboardPage><HRMPerformance /></DashboardPage>} />
            <Route path="/hrm/goals" element={<DashboardPage><HRMGoals /></DashboardPage>} />
            
            {/* Project Routes */}
            <Route path="/projects" element={<DashboardPage><Projects /></DashboardPage>} />
            <Route path="/projects/tasks" element={<DashboardPage><ProjectTasks /></DashboardPage>} />
            <Route path="/projects/timesheet" element={<DashboardPage><ProjectTimesheet /></DashboardPage>} />
            <Route path="/projects/budget" element={<DashboardPage><ProjectBudget /></DashboardPage>} />
            
            {/* Finance Routes */}
            <Route path="/finance/invoices" element={<DashboardPage><FinanceInvoices /></DashboardPage>} />
            <Route path="/finance/payments" element={<DashboardPage><FinancePayments /></DashboardPage>} />
            <Route path="/finance/expenses" element={<DashboardPage><FinanceExpenses /></DashboardPage>} />
            <Route path="/finance/accounting" element={<DashboardPage><FinanceAccounting /></DashboardPage>} />
            <Route path="/finance/profit-loss" element={<DashboardPage><FinanceProfitLoss /></DashboardPage>} />
            
            {/* Inventory Routes */}
            <Route path="/inventory/stock" element={<DashboardPage><InventoryStock /></DashboardPage>} />
            <Route path="/inventory/pos" element={<DashboardPage><InventoryPOS /></DashboardPage>} />
            <Route path="/inventory/barcode" element={<DashboardPage><InventoryBarcode /></DashboardPage>} />
            
            {/* Contract Routes */}
            <Route path="/contracts" element={<DashboardPage><Contracts /></DashboardPage>} />
            <Route path="/contracts/signature" element={<DashboardPage><DigitalSignature /></DashboardPage>} />
            
            {/* User Management */}
            <Route path="/users" element={<DashboardPage><UserManagement /></DashboardPage>} />
            <Route path="/roles" element={<DashboardPage><UserManagement /></DashboardPage>} />
            
            {/* Other Routes */}
            <Route path="/chat" element={<DashboardPage><InternalChat /></DashboardPage>} />
            <Route path="/email-templates" element={<DashboardPage><EmailTemplates /></DashboardPage>} />
            <Route path="/reports" element={<DashboardPage><Reports /></DashboardPage>} />
            <Route path="/ai-assistant" element={<DashboardPage><AIAssistant /></DashboardPage>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<DashboardPage><Profile /></DashboardPage>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
