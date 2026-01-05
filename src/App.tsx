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

import { AppRole } from "@/hooks/useUserRole";

const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="admin">
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const ManagerPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['admin', 'manager'] as AppRole[]}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const EmployeePage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['admin', 'manager', 'employee'] as AppRole[]}>
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
            
            {/* CRM Routes - Leads accessible to employees, others to managers */}
            <Route path="/crm/leads" element={<EmployeePage><CRMLeads /></EmployeePage>} />
            <Route path="/crm/clients" element={<ManagerPage><CRMClients /></ManagerPage>} />
            <Route path="/crm/deals" element={<ManagerPage><CRMDeals /></ManagerPage>} />
            <Route path="/crm/estimates" element={<ManagerPage><CRMEstimates /></ManagerPage>} />
            
            {/* HRM Routes - Manager/Admin only */}
            <Route path="/hrm/employees" element={<ManagerPage><HRMEmployees /></ManagerPage>} />
            <Route path="/hrm/attendance" element={<EmployeePage><HRMAttendance /></EmployeePage>} />
            <Route path="/hrm/leave" element={<EmployeePage><HRMLeave /></EmployeePage>} />
            <Route path="/hrm/payroll" element={<ManagerPage><HRMPayroll /></ManagerPage>} />
            <Route path="/hrm/performance" element={<ManagerPage><HRMPerformance /></ManagerPage>} />
            <Route path="/hrm/goals" element={<EmployeePage><HRMGoals /></EmployeePage>} />
            
            {/* Project Routes - Employees and above */}
            <Route path="/projects" element={<EmployeePage><Projects /></EmployeePage>} />
            <Route path="/projects/tasks" element={<EmployeePage><ProjectTasks /></EmployeePage>} />
            <Route path="/projects/timesheet" element={<EmployeePage><ProjectTimesheet /></EmployeePage>} />
            <Route path="/projects/budget" element={<ManagerPage><ProjectBudget /></ManagerPage>} />
            
            {/* Finance Routes - Manager/Admin only */}
            <Route path="/finance/invoices" element={<ManagerPage><FinanceInvoices /></ManagerPage>} />
            <Route path="/finance/payments" element={<ManagerPage><FinancePayments /></ManagerPage>} />
            <Route path="/finance/expenses" element={<EmployeePage><FinanceExpenses /></EmployeePage>} />
            <Route path="/finance/accounting" element={<ManagerPage><FinanceAccounting /></ManagerPage>} />
            <Route path="/finance/profit-loss" element={<ManagerPage><FinanceProfitLoss /></ManagerPage>} />
            
            {/* Inventory Routes - Employees and above for POS */}
            <Route path="/inventory/stock" element={<EmployeePage><InventoryStock /></EmployeePage>} />
            <Route path="/inventory/pos" element={<EmployeePage><InventoryPOS /></EmployeePage>} />
            <Route path="/inventory/barcode" element={<EmployeePage><InventoryBarcode /></EmployeePage>} />
            
            {/* Contract Routes - Manager/Admin only */}
            <Route path="/contracts" element={<ManagerPage><Contracts /></ManagerPage>} />
            <Route path="/contracts/signature" element={<ManagerPage><DigitalSignature /></ManagerPage>} />
            
            {/* User Management - Admin only */}
            <Route path="/users" element={<AdminPage><UserManagement /></AdminPage>} />
            <Route path="/roles" element={<AdminPage><UserManagement /></AdminPage>} />
            
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
