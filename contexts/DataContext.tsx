
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Client, Budget, PurchaseOrder, WorkOrder, Invoice, DocumentStatus, User, RecentActivity, UpcomingDueDate, AppDocument, BaseDocument, ManagedDocumentStatuses, DocumentTypeKey } from '../types';
import { useAuth } from './AuthContext';
import { DOCUMENT_TYPE_KEYS, DOCUMENT_TYPES_LABELS } from '../constants';

// Helper to generate IDs
const generateId = (prefix: string): string => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

// Helper to get user name
const getUserName = (user: User | undefined): string => {
  if (!user) return 'Sistema';
  return user.nombre || 'Usuario sin nombre';
};

// Mock Data
const MOCK_USERS: User[] = [
  {
    id: 1,
    nombre: 'Jaime Valtierra',
    rut: '12.345.678-9',
    correo: 'jvaltierra@mainingenieros.cl',
    password: 'hashedpassword123',
    telefono: '+56912345678',
    perfil: { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema' },
    grupo: { id: 1, nombre: 'Administración', descripcion: 'Equipo de administración' },
  },
  {
    id: 2,
    nombre: 'Ana López',
    rut: '18.765.432-1',
    correo: 'alopez@mainingenieros.cl',
    password: 'hashedpassword456',
    telefono: '+56987654321',
    perfil: { id: 2, nombre: 'Gerente', descripcion: 'Gestión de proyectos' },
    grupo: { id: 1, nombre: 'Administración', descripcion: 'Equipo de administración' },
  },
  {
    id: 3,
    nombre: 'Carlos Ruiz',
    rut: '15.432.765-2',
    correo: 'cruiz@mainingenieros.cl',
    password: 'hashedpassword789',
    telefono: '+56956781234',
    perfil: { id: 3, nombre: 'Operador', descripcion: 'Operaciones generales' },
    grupo: { id: 2, nombre: 'Operaciones', descripcion: 'Equipo de operaciones' },
  },
  {
    id: 4,
    nombre: 'María González',
    rut: '19.876.543-3',
    correo: 'mgonzalez@mainingenieros.cl',
    password: 'hashedpassword012',
    telefono: '+56943218765',
    perfil: { id: 2, nombre: 'Gerente', descripcion: 'Gestión de proyectos' },
    grupo: { id: 2, nombre: 'Operaciones', descripcion: 'Equipo de operaciones' },
  },
  {
    id: 5,
    nombre: 'Pedro Sánchez',
    rut: '13.456.789-4',
    correo: 'psanchez@mainingenieros.cl',
    password: 'hashedpassword345',
    telefono: '+56978901234',
    perfil: { id: 3, nombre: 'Operador', descripcion: 'Operaciones generales' },
    grupo: { id: 2, nombre: 'Operaciones', descripcion: 'Equipo de operaciones' },
  },
];

const MOCK_CLIENTS: Client[] = [
  {
     id: generateId('client'), 
     nombre: 'Tech Solutions Inc.', 
     planta: 'San Felipe', 
     rut: '76.123.456-K', 
     contacto: 'John Doe', 
     correo: 'john.doe@techsolutions.com', 
     telefono: '555-1234', 
     direccion: '123 Tech Park', 
     createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() 
  },
  
  { id: generateId('client'), planta: 'San Felipe', rut: '77.234.567-1', nombre: 'Innovatech Ltd.', contacto: 'Jane Smith', correo: 'jane.smith@innovatech.com', telefono: '555-5678', direccion: '456 Innovation Ave', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: generateId('client'), planta: 'San Felipe', rut: '78.345.678-2', nombre: 'Global Corp.', contacto: 'Robert Brown', correo: 'robert.brown@globalcorp.com', telefono: '555-8765', direccion: '789 Global St', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
];

const getRandomUser = (): User => MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
const getRandomClient = (): Client => MOCK_CLIENTS[Math.floor(Math.random() * MOCK_CLIENTS.length)];
const getRandomStatus = () => {
    const statuses = Object.values(DocumentStatus);
    return statuses[Math.floor(Math.random() * statuses.length)];
}

const createMockDocument = <T extends AppDocument>(type: DocumentTypeKey, docNumber: number): T => {
    const client = getRandomClient();
    const responsibleUser = getRandomUser();
    const creationDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const dueDate = new Date(creationDate.getTime() + Math.floor(Math.random() * 15 + 15) * 24 * 60 * 60 * 1000);

    const baseDoc: Omit<BaseDocument, 'id'> = {
        documentNumber: `${type.substring(0,1)}N-${1000 + docNumber}`,
        creationDate: creationDate.toISOString(),
        dueDate: dueDate.toISOString(),
        status: getRandomStatus(),
        responsibleUserId: responsibleUser.id.toString(),
        responsibleUserName: responsibleUser.nombre,
        clientId: client.id,
        clientName: client.name,
        totalAmount: Math.floor(Math.random() * 5000) + 500,
        notes: `Nota de ejemplo para ${type.toLowerCase()} ${1000 + docNumber}.`
    } as Omit<BaseDocument, 'id'>;

    const docWithId = {
        ...baseDoc,
        id: generateId(type.toLowerCase())
    };

    switch(type) {
        case 'Budget':
            return { ...docWithId, validityDays: 30 } as T;
        case 'PurchaseOrder':
            return { ...docWithId, clientPurchaseOrderNumber: `CPO-${docWithId.id.slice(-4)}-${Math.floor(Math.random()*900)+100}` } as T;
        case 'WorkOrder':
            return { ...docWithId, description: `Descripción detallada para la orden de trabajo ${1000 + docNumber}.` } as T;
        case 'Invoice':
            return { ...docWithId, paymentDate: baseDoc.status === DocumentStatus.PAID ? new Date().toISOString() : undefined } as T;
        default:
            return docWithId as T;
    }
};

const MOCK_BUDGETS: Budget[] = Array.from({ length: 5 }, (_, i) => createMockDocument('Budget', i));
const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = Array.from({ length: 3 }, (_, i) => createMockDocument('PurchaseOrder', i));
const MOCK_WORK_ORDERS: WorkOrder[] = Array.from({ length: 4 }, (_, i) => createMockDocument('WorkOrder', i));
const MOCK_INVOICES: Invoice[] = Array.from({ length: 6 }, (_, i) => createMockDocument('Invoice', i));


// Initial configuration for managed statuses: all statuses available for all types by default.
const initialManagedStatusesConfig: ManagedDocumentStatuses[] = DOCUMENT_TYPE_KEYS.map(docTypeKey => ({
    documentTypeKey: docTypeKey,
    documentTypeLabel: DOCUMENT_TYPES_LABELS[docTypeKey],
    availableStatusNames: Object.values(DocumentStatus),
}));


interface DataContextType {
  clients: Client[];
  budgets: Budget[];
  purchaseOrders: PurchaseOrder[];
  workOrders: WorkOrder[];
  invoices: Invoice[];
  users: User[];
  recentActivity: RecentActivity[];
  upcomingDueDates: UpcomingDueDate[];
  managedStatusesConfig: ManagedDocumentStatuses[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (client: Client) => Client | undefined;
  deleteClient: (clientId: string) => Client | undefined;
  addDocument: <T extends AppDocument>(
    docTypeKey: DocumentTypeKey, 
    document: Omit<T, 'id' | 'creationDate' | 'responsibleUserName' | 'clientName'>
  ) => T;
  updateDocument: <T extends AppDocument>(docTypeKey: DocumentTypeKey, document: T) => void;
  deleteDocument: (docTypeKey: DocumentTypeKey, docId: string) => void;
  getUsers: () => User[];
  updateUser: (user: User) => void;
  addUser: (user: Omit<User, 'id' | 'perfil' | 'grupo'> & { perfilId: number; grupoId: number }) => Promise<User>;
  getAvailableStatusesForDocumentType: (docTypeKey: DocumentTypeKey) => DocumentStatus[];
  updateManagedStatusesConfig: (docTypeKey: DocumentTypeKey, newAvailableStatuses: DocumentStatus[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: currentUser } = useAuth();
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingDueDates, setUpcomingDueDates] = useState<UpcomingDueDate[]>([]);
  const [managedStatusesConfig, setManagedStatusesConfig] = useState<ManagedDocumentStatuses[]>(initialManagedStatusesConfig);

  const addActivity = useCallback((activity: Omit<RecentActivity, 'id' | 'timestamp' | 'user'>) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: generateId('act'),
      timestamp: new Date().toISOString(),
      user: currentUser ? getUserName(currentUser) : 'Sistema'
    };
    setRecentActivity(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  }, [currentUser]);

  const addClient = (clientData: Omit<Client, 'id'| 'createdAt'>) => {
    const newClient: Client = { ...clientData, id: generateId('client'), createdAt: new Date().toISOString() };
    setClients(prev => [newClient, ...prev]);
    addActivity({
      type: 'CREATED',
      description: `Cliente "${clientData.name}" agregado`
    });
    return newClient;
  };

  const updateClient = (client: Client) => {
    setClients(prev => prev.map(c => c.id === client.id ? client : c));
    addActivity({
      type: 'UPDATED',
      description: `Cliente "${client.name}" actualizado`
    });
    return client;
  };

  const deleteClient = (clientId: string) => {
    const clientToDelete = clients.find(c => c.id === clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
    if (clientToDelete) {
      addActivity({
        type: 'DELETED',
        description: `Cliente "${clientToDelete.name}" eliminado`
      });
    }
    return clientToDelete;
  };

  const addDocument = <T extends AppDocument>(
    docTypeKey: DocumentTypeKey, 
    docData: Omit<T, 'id' | 'creationDate' | 'responsibleUserName' | 'clientName'>
  ): T => {
    const client = clients.find(c => c.id === docData.clientId);
    const responsibleUser = users.find(u => u.id.toString() === docData.responsibleUserId.toString());
    
    const newDocument = {
      ...docData,
      id: generateId(docTypeKey.toLowerCase()),
      creationDate: new Date().toISOString(),
      clientName: client?.name || 'N/A',
      responsibleUserName: responsibleUser?.nombre || 'N/A',
      clientId: docData.clientId.toString(),
      responsibleUserId: docData.responsibleUserId.toString(),
    } as T;
    
    switch(docTypeKey) {
      case 'Budget':
        setBudgets(prev => [newDocument as Budget, ...prev]);
        break;
      case 'PurchaseOrder':
        setPurchaseOrders(prev => [newDocument as PurchaseOrder, ...prev]);
        break;
      case 'WorkOrder':
        setWorkOrders(prev => [newDocument as WorkOrder, ...prev]);
        break;
      case 'Invoice':
        setInvoices(prev => [newDocument as Invoice, ...prev]);
        break;
    }
    
    addActivity({
      type: 'CREATED',
      description: `Nuevo documento creado: ${docTypeKey} ${newDocument.documentNumber}`
    });
    
    return newDocument;
  };

  const updateDocument = <T extends AppDocument>(docTypeKey: DocumentTypeKey, document: T) => {
    const client = clients.find(c => c.id === document.clientId);
    const responsibleUser = users.find(u => u.id.toString() === document.responsibleUserId.toString());
    
    const updatedDoc = {
      ...document,
      clientName: client?.name || 'N/A',
      responsibleUserName: responsibleUser?.nombre || 'N/A',
    };
    
    switch(docTypeKey) {
      case 'Budget':
        setBudgets(prev => prev.map(d => d.id === document.id ? updatedDoc as Budget : d as Budget));
        break;
      case 'PurchaseOrder':
        setPurchaseOrders(prev => prev.map(d => d.id === document.id ? updatedDoc as PurchaseOrder : d as PurchaseOrder));
        break;
      case 'WorkOrder':
        setWorkOrders(prev => prev.map(d => d.id === document.id ? updatedDoc as WorkOrder : d as WorkOrder));
        break;
      case 'Invoice':
        setInvoices(prev => prev.map(d => d.id === document.id ? updatedDoc as Invoice : d as Invoice));
        break;
    }
    
    addActivity({
      type: 'UPDATED',
      description: `Documento actualizado: ${docTypeKey} ${document.documentNumber}`
    });
  };

  const deleteDocument = useCallback((docTypeKey: DocumentTypeKey, docId: string) => {
    const docType = docTypeKey.toLowerCase();
    const setter = {
      'budget': setBudgets,
      'purchaseorder': setPurchaseOrders,
      'workorder': setWorkOrders,
      'invoice': setInvoices,
    }[docType] as React.Dispatch<React.SetStateAction<AppDocument[]>> | undefined;

    if (setter) {
      setter((prev: AppDocument[]) => prev.filter((doc: AppDocument) => doc.id !== docId));
      
      addActivity({
        type: 'DELETED',
        description: `Documento eliminado: ${docTypeKey} ${docId}`
      });
    }
  }, [addActivity]);

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addActivity({
      type: 'UPDATED',
      description: `Usuario "${updatedUser.nombre}" actualizado`
    });
    return updatedUser;
  };
  
  const getUsers = (): User[] => {
    return users;
  };
  
  const addUser = async (userData: Omit<User, 'id' | 'perfil' | 'grupo'> & { perfilId: number, grupoId: number }): Promise<User> => {
    // En una implementación real, aquí harías una llamada a la API
    const newUser: User = {
      ...userData,
      id: Math.max(0, ...users.map(u => u.id)) + 1, // Genera un nuevo ID
      perfil: { id: userData.perfilId, nombre: 'Operador' }, // Esto debería venir de la API
      grupo: { id: userData.grupoId, nombre: 'Principal' } // Esto debería venir de la API
    };
    
    setUsers(prev => [newUser, ...prev]);
    
    addActivity({
      type: 'CREATED',
      description: `Nuevo usuario creado: ${userData.nombre}`
    });
    
    return newUser;
  };

  const getAvailableStatusesForDocumentType = useCallback((docTypeKey: DocumentTypeKey): DocumentStatus[] => {
    const config = managedStatusesConfig.find(msc => msc.documentTypeKey === docTypeKey);
    return config ? config.availableStatusNames : Object.values(DocumentStatus); // Fallback to all if not found
  }, [managedStatusesConfig]);

  const updateManagedStatusesConfig = (docTypeKey: DocumentTypeKey, newAvailableStatuses: DocumentStatus[]) => {
    setManagedStatusesConfig(prev => prev.map(msc => 
      msc.documentTypeKey === docTypeKey ? { ...msc, availableStatusNames: newAvailableStatuses } : msc
    ));
    addActivity({ 
      type: 'UPDATED', 
      description: `Configuración de estados para ${DOCUMENT_TYPES_LABELS[docTypeKey]} actualizada` 
    });
  };

  useEffect(() => {
    const initialActivities: RecentActivity[] = [
        { id: generateId('activity'), type: 'CREATED', description: 'Nuevo Presupuesto PR-1001 creado', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), user: 'Ana López' },
        { id: generateId('activity'), type: 'STATUS_CHANGED', description: 'Estado de Factura FC-2001 cambiado a Pagado', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), user: 'Carlos Méndez' },
        { id: generateId('activity'), type: 'UPDATED', description: 'Cliente Acme Corp actualizado', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), user: 'Ana López' },
        { id: generateId('activity'), type: 'CREATED', description: 'Nueva Orden de Trabajo OT-3001 creada', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), user: 'Roberto Sánchez' },
        { id: generateId('activity'), type: 'STATUS_CHANGED', description: 'Estado de Presupuesto PR-1002 cambiado a Aprobado', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), user: 'Ana López' },
    ];
    setRecentActivity(initialActivities);

    // Set up upcoming due dates (next 30 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming: UpcomingDueDate[] = [];

    const checkAndAdd = (doc: AppDocument, type: 'Budget' | 'Invoice' | 'WorkOrder') => {
        if (doc.dueDate && doc.status !== DocumentStatus.COMPLETED && doc.status !== DocumentStatus.PAID && doc.status !== DocumentStatus.CANCELLED) {
            const dueDate = new Date(doc.dueDate);
            if (dueDate >= today && dueDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) { 
                upcoming.push({
                    id: doc.id,
                    documentType: type,
                    documentNumber: doc.documentNumber,
                    clientName: doc.clientName || 'N/A',
                    dueDate: doc.dueDate,
                    amount: doc.totalAmount,
                    status: doc.status,
                });
            }
        }
    };
    budgets.forEach(b => checkAndAdd(b, 'Budget'));
    invoices.forEach(i => checkAndAdd(i, 'Invoice'));
    workOrders.forEach(wo => checkAndAdd(wo, 'WorkOrder'));
    
    setUpcomingDueDates(upcoming.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0,5));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const contextValue: DataContextType = {
    clients,
    budgets,
    purchaseOrders,
    workOrders,
    invoices,
    users,
    recentActivity,
    upcomingDueDates,
    managedStatusesConfig,
    addClient,
    updateClient,
    deleteClient,
    addDocument,
    updateDocument,
    deleteDocument,
    getUsers,
    updateUser,
    addUser,
    getAvailableStatusesForDocumentType,
    updateManagedStatusesConfig
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
