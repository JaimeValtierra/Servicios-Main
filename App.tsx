
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import BudgetsPage from './pages/BudgetsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import WorkOrdersPage from './pages/WorkOrdersPage';
import InvoicesPage from './pages/InvoicesPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import StatusManagementPage from './pages/admin/StatusManagementPage'; // Added
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NAVIGATION_ITEMS, NavItem } from './constants';
import { UserRole } from './types';


const findNavItemByPath = (path: string, navItems: NavItem[]): NavItem | undefined => {
  for (const item of navItems) {
    if (item.path === path) return item;
    if (item.subItems) {
      const subItem = findNavItemByPath(path, item.subItems);
      if (subItem) return subItem;
    }
  }
  // Check for paths like /clients/new or /clients/:id
  const baseItem = navItems.find(item => path.startsWith(item.path) && item.path !== '/');
  if (baseItem) return baseItem;
  
  // Specific check for admin sub-routes not explicitly in NAV_ITEMS main paths
  if (path.startsWith('/admin/')) {
    const adminBase = navItems.find(item => item.path.startsWith('/admin/'));
    if (adminBase) return adminBase; // Could return specific if subItems were structured
  }

  return navItems.find(item => item.path ==='/'); // Default to dashboard
};


const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [headerTitle, setHeaderTitle] = useState('Panel de Control');

  useEffect(() => {
    const currentNavItem = findNavItemByPath(location.pathname, NAVIGATION_ITEMS);
    if (currentNavItem) {
      setHeaderTitle(currentNavItem.name);
    } else if (location.pathname.startsWith('/clients/')) {
        setHeaderTitle('Clientes');
    } else if (location.pathname.startsWith('/budgets/')) {
        setHeaderTitle('Presupuestos');
    } else if (location.pathname.startsWith('/purchase-orders/')) {
        setHeaderTitle('Órdenes de Compra');
    } else if (location.pathname.startsWith('/work-orders/')) {
        setHeaderTitle('Órdenes de Trabajo');
    } else if (location.pathname.startsWith('/invoices/')) {
        setHeaderTitle('Facturas');
    } else if (location.pathname.startsWith('/admin/users')) { // More specific admin routes first
        setHeaderTitle('Administración de Usuarios');
    } else if (location.pathname.startsWith('/admin/statuses')) {
        setHeaderTitle('Gestión de Estados');
    }
     else {
      setHeaderTitle('Panel de Control'); // Default for unmatched or dynamic routes
    }
  }, [location.pathname]);
  
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }
  
  if (isAuthenticated && location.pathname === '/login') {
     return <Navigate to="/" replace />;
  }

  if (location.pathname === '/login') {
    return <>{children}</>; // LoginPage manages its own layout
  }

  return (
    <div className="flex h-screen bg-light-gray">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64"> {/* Adjust ml value to sidebar width */}
        <Header title={headerTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-gray pt-16"> {/* Adjust pt for header height */}
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    // Optionally, redirect to an "Unauthorized" page or back to dashboard
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <PageWrapper>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
              <Route path="/clients/:id" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} /> 
              <Route path="/clients/new" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />

              <Route path="/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
              <Route path="/budgets/:id" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
              <Route path="/budgets/new" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />

              <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute>} />
              <Route path="/purchase-orders/:id" element={<ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute>} />
              <Route path="/purchase-orders/new" element={<ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute>} />

              <Route path="/work-orders" element={<ProtectedRoute><WorkOrdersPage /></ProtectedRoute>} />
              <Route path="/work-orders/:id" element={<ProtectedRoute><WorkOrdersPage /></ProtectedRoute>} />
              <Route path="/work-orders/new" element={<ProtectedRoute><WorkOrdersPage /></ProtectedRoute>} />

              <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
              <Route path="/invoices/:id" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
              <Route path="/invoices/new" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
              
              <Route path="/reports" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><ReportsPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><UsersPage /></ProtectedRoute>} />
              <Route path="/admin/statuses" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><StatusManagementPage /></ProtectedRoute>} /> {/* Added */}
              
              {/* Fallback for any other route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageWrapper>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
