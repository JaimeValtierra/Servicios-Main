
import { HomeIcon, UsersIcon, BriefcaseIcon, DocumentTextIcon, ClipboardListIcon, CurrencyDollarIcon, ChartBarIcon, ArrowLeftOnRectangleIcon, TagIcon } from './components/icons/Icons';
import { DocumentTypeKey } from './types';

export interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: string[];
  subItems?: NavItem[];
  section?: string;
}

// Importar UserRole desde types
import { UserRole } from './types';

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Panel de Control', path: '/', icon: HomeIcon, section: 'PRINCIPAL' },
  { name: 'Presupuestos', path: '/budgets', icon: DocumentTextIcon, section: 'GESTIÓN' },
  { name: 'Órdenes de Compra', path: '/purchase-orders', icon: ClipboardListIcon, section: 'GESTIÓN' },
  { name: 'Órdenes de Trabajo', path: '/work-orders', icon: BriefcaseIcon, section: 'GESTIÓN' },
  { name: 'Facturas', path: '/invoices', icon: CurrencyDollarIcon, section: 'GESTIÓN' },
  { 
    name: 'Generar Reportes', 
    path: '/reports', 
    icon: ChartBarIcon, 
    section: 'REPORTES', 
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER]
  },
  { 
    name: 'Clientes', 
    path: '/clients', 
    icon: UsersIcon, 
    section: 'ADMINISTRACIÓN',
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER]
  },
  { 
    name: 'Usuarios', 
    path: '/admin/users', 
    icon: UsersIcon, 
    section: 'ADMINISTRACIÓN', 
    allowedRoles: [UserRole.ADMIN] 
  },
  { 
    name: 'Gestión de Estados', 
    path: '/admin/statuses', 
    icon: TagIcon, 
    section: 'ADMINISTRACIÓN', 
    allowedRoles: [UserRole.ADMIN] 
  },
];

export const LOGOUT_ITEM: NavItem = {
  name: 'Cerrar Sesión', 
  path: '/login', 
  icon: ArrowLeftOnRectangleIcon, 
  section: 'CUENTA'
}

export const USER_AVATAR_PLACEHOLDER = 'https://picsum.photos/100/100';
export const DEFAULT_USER_NAME = 'Usuario Invitado';

export const STATUS_COLORS: Record<string, string> = {
  Pendiente: 'bg-status-pending text-white',
  Aprobado: 'bg-status-approved text-white',
  Rechazado: 'bg-status-rejected text-white',
  'En Proceso': 'bg-status-inprogress text-white',
  Completado: 'bg-status-completed text-white',
  Pagado: 'bg-status-paid text-white',
  Anulado: 'bg-status-cancelled text-white',
};

export const DOCUMENT_TYPES_LABELS: Record<DocumentTypeKey, string> = {
  Budget: 'Presupuesto',
  PurchaseOrder: 'Orden de Compra',
  WorkOrder: 'Orden de Trabajo',
  Invoice: 'Factura',
};

export const DOCUMENT_TYPE_KEYS: DocumentTypeKey[] = ['Budget', 'PurchaseOrder', 'WorkOrder', 'Invoice'];