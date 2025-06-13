
// Roles del sistema
export enum UserRole {
  ADMIN = 'Administrador',
  MANAGER = 'Gerente',
  OPERATOR = 'Operador'
}

export interface PerfilUsuario {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface User {
  id: number;
  nombre: string;
  rut: string;
  perfil: PerfilUsuario;
  telefono?: string;
  correo: string;
  password: string;
  grupo?: Grupo;
  // Campos adicionales para compatibilidad
  role?: string; // Para compatibilidad con el código existente
  avatarUrl?: string; // Para compatibilidad con el código existente
}

export interface Client {
  id: string;
  nombre: string;
  planta?: string;
  rut: string;
  contacto?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  // Campos para compatibilidad con el código existente
  name?: string; // Alias para nombre
  contactPerson?: string; // Alias para contacto
  email?: string; // Alias para correo
  phone?: string; // Alias para telefono
  address?: string; // Alias para direccion
  createdAt?: string; // Para compatibilidad
}

export enum DocumentStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado',
  IN_PROGRESS = 'En Proceso',
  COMPLETED = 'Completado',
  PAID = 'Pagado',
  CANCELLED = 'Anulado',
}

export interface BaseDocument {
  id: string;
  documentNumber: string; // This will be the internal document number
  creationDate: string;
  dueDate?: string;
  status: DocumentStatus; // This will now be filtered by ManagedDocumentStatuses
  responsibleUserId: string; // User ID
  clientId: string; // Client ID
  clientName?: string; // Denormalized for display
  responsibleUserName?: string; // Denormalized for display
  totalAmount: number;
  items?: DocumentItem[]; // Optional items for budget/invoice details
  notes?: string;
}

export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Budget extends BaseDocument {
  validityDays: number;
}

export interface PurchaseOrder extends BaseDocument {
  clientPurchaseOrderNumber: string; // Number provided by the client
}

export interface WorkOrder extends BaseDocument {
  description: string;
}

export interface Invoice extends BaseDocument {
  paymentDate?: string;
}

export interface StatusHistory {
  id: string;
  documentId: string;
  documentType: 'Budget' | 'PurchaseOrder' | 'WorkOrder' | 'Invoice';
  oldStatus?: DocumentStatus;
  newStatus: DocumentStatus;
  changedAt: string;
  changedByUserId: string; // User ID
}

export interface RecentActivity {
  id: string;
  type: 'CREATED' | 'STATUS_CHANGED' | 'UPDATED' | 'DELETED';
  description: string;
  timestamp: string;
  link?: string; // Optional link to the item
  user?: string; // User who performed action
}

export interface UpcomingDueDate {
  id: string;
  documentType: 'Budget' | 'Invoice' | 'WorkOrder';
  documentNumber: string;
  clientName: string;
  dueDate: string;
  amount: number;
  status: DocumentStatus;
}

export type AppDocument = Budget | PurchaseOrder | WorkOrder | Invoice;

export type DocumentTypeKey = 'Budget' | 'PurchaseOrder' | 'WorkOrder' | 'Invoice';

// For managing which statuses are available for each document type
export interface ManagedDocumentStatuses {
  documentTypeKey: DocumentTypeKey;
  documentTypeLabel: string;
  availableStatusNames: DocumentStatus[];
}
