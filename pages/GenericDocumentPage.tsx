
import React, { useState, useMemo } from 'react';
import DataTable, { ColumnDefinition } from '../components/DataTable';
import { AppDocument, DocumentStatus, User, Client, PurchaseOrder, DocumentTypeKey } from '../types'; // Added PurchaseOrder, DocumentTypeKey
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons/Icons'; 

interface GenericDocumentFormProps<T extends AppDocument> {
  initialData?: T | null;
  onSubmit: (doc: T) => void;
  onCancel: () => void;
  documentTypeKey: DocumentTypeKey; // Use DocumentTypeKey
  documentTypeLabel: string;
  users: User[];
  clients: Client[];
  availableStatuses: DocumentStatus[];
}

const GenericDocumentForm = <T extends AppDocument,>({ initialData, onSubmit, onCancel, documentTypeKey, documentTypeLabel, users, clients, availableStatuses }: GenericDocumentFormProps<T>): React.ReactNode => {
  
  const getDefaultNewDocument = (): Partial<T> => {
    const firstAvailableStatus = availableStatuses.length > 0 ? availableStatuses[0] : DocumentStatus.PENDING;
    const baseDefault = {
      documentNumber: '', // Internal Document Number
      clientId: '',
      responsibleUserId: '',
      totalAmount: 0,
      status: firstAvailableStatus, // Use first available status or fallback
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default due in 15 days
      notes: '',
    };
    if (documentTypeKey === 'PurchaseOrder') { // Check against DocumentTypeKey
      return { ...baseDefault, clientPurchaseOrderNumber: '' } as unknown as Partial<T>;
    }
    if (documentTypeKey === 'Budget') {
       return { ...baseDefault, validityDays: 30 } as unknown as Partial<T>;
    }
    if (documentTypeKey === 'WorkOrder') {
        return { ...baseDefault, description: '' } as unknown as Partial<T>;
    }
    return baseDefault as Partial<T>;
  };
  
  const [doc, setDoc] = useState<Partial<T>>(initialData || getDefaultNewDocument());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = type === 'number' ? parseFloat(value) : type === 'date' && (e.target as any).valueAsDate ? (e.target as any).valueAsDate.toISOString().split('T')[0] : value;
    setDoc(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    let missingFieldsMessage = "Por favor, complete todos los campos obligatorios: Número Documento (Interno), Cliente, Responsable, Monto Total.";

    if (!doc.documentNumber || !doc.clientId || !doc.responsibleUserId || doc.totalAmount === undefined || doc.totalAmount < 0) {
        isValid = false;
    }
    
    if (documentTypeKey === 'PurchaseOrder') { // Check against DocumentTypeKey
      const poDoc = doc as Partial<PurchaseOrder>;
      if (!poDoc.clientPurchaseOrderNumber) {
        isValid = false;
        missingFieldsMessage += " Adicionalmente, para Órdenes de Compra, el 'Nº OC Cliente' es obligatorio.";
      }
    }

    if (!isValid) {
        alert(missingFieldsMessage);
        return;
    }
    onSubmit(doc as T);
  };
  
  // Define base fields that are common to most documents
  let formFieldsConfig: { name: keyof T; label: string; type: string; required?: boolean; options?: {value: string; label: string}[] }[] = [
    { name: 'documentNumber' as keyof T, label: 'Número Documento (Interno)', type: 'text', required: true },
    { name: 'clientId' as keyof T, label: 'Cliente', type: 'select', required: true, options: clients.map(c => ({value: c.id, label: c.nombre || c.name || 'Sin nombre'})) },
    { name: 'responsibleUserId' as keyof T, label: 'Responsable', type: 'select', required: true, options: users.map(u => ({value: u.id.toString(), label: u.nombre})) },
    { name: 'totalAmount' as keyof T, label: 'Monto Total', type: 'number', required: true },
    { name: 'dueDate' as keyof T, label: 'Fecha Vencimiento', type: 'date' },
    { name: 'status' as keyof T, label: 'Estado', type: 'select', required: true, options: availableStatuses.map(s => ({value: s, label: s}))},
    { name: 'notes' as keyof T, label: 'Notas', type: 'textarea' },
  ];

  if (documentTypeKey === 'PurchaseOrder') {
    formFieldsConfig.splice(1, 0, { name: 'clientPurchaseOrderNumber' as keyof T, label: 'Nº OC Cliente', type: 'text', required: true });
  }
  if (documentTypeKey === 'Budget') {
    formFieldsConfig.push({ name: 'validityDays' as keyof T, label: 'Días de Validez', type: 'number' });
  }
  if (documentTypeKey === 'WorkOrder') {
    formFieldsConfig.push({ name: 'description' as keyof T, label: 'Descripción Trabajo', type: 'textarea' });
  }
   if (documentTypeKey === 'Invoice') {
    formFieldsConfig.push({ name: 'paymentDate' as keyof T, label: 'Fecha de Pago', type: 'date' });
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFieldsConfig.map(field => (
        <div key={String(field.name)}>
          <label htmlFor={String(field.name)} className="block text-sm font-medium text-gray-700">{field.label}</label>
          {field.type === 'select' ? (
            <select
              name={String(field.name)}
              id={String(field.name)}
              value={doc[field.name] as string || ''}
              onChange={handleChange}
              required={field.required}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            >
              <option value="">Seleccione...</option>
              {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ) : field.type === 'textarea' ? (
             <textarea
              name={String(field.name)}
              id={String(field.name)}
              value={doc[field.name] as string || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
          ) : (
            <input
              type={field.type}
              name={String(field.name)}
              id={String(field.name)}
              value={field.type === 'date' && doc[field.name] ? (doc[field.name] as string).split('T')[0] : doc[field.name] as string | number || ''}
              onChange={handleChange}
              required={field.required}
              step={field.type === 'number' ? 'any' : undefined}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
          )}
        </div>
      ))}
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-dark rounded-md">{initialData ? 'Actualizar' : 'Crear'} {documentTypeLabel}</button>
      </div>
    </form>
  );
};


interface GenericDocumentPageProps<T extends AppDocument> {
  pageTitle: string;
  documentTypeLabel: string; 
  documentTypeKey: DocumentTypeKey; 
  getDocuments: () => T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addDocument: (docTypeKey: DocumentTypeKey, doc: Omit<T, 'id' | 'creationDate'| 'responsibleUserName' | 'clientName'>) => void;
  updateDocument: (docTypeKey: DocumentTypeKey, doc: T) => void;
  deleteDocument: (docTypeKey: DocumentTypeKey, docId: string) => void;
  specificColumns?: ColumnDefinition<T>[]; 
}

const GenericDocumentPage = <T extends AppDocument,>({ 
    pageTitle, 
    documentTypeLabel, 
    documentTypeKey,
    getDocuments,
    addDocument: addDocContext,
    updateDocument: updateDocContext,
    deleteDocument: deleteDocContext,
    specificColumns
}: GenericDocumentPageProps<T>): React.ReactNode => {
  const { users, clients, getAvailableStatusesForDocumentType } = useData(); 
  const documents = getDocuments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableStatusesForType = useMemo(() => getAvailableStatusesForDocumentType(documentTypeKey), [getAvailableStatusesForDocumentType, documentTypeKey]);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | ''>('');


  const handleAddNew = () => {
    setEditingDocument(null);
    setIsModalOpen(true);
  };

  const handleEdit = (doc: T) => {
    setEditingDocument(doc);
    setIsModalOpen(true);
  };

  const handleDelete = (docId: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar este ${documentTypeLabel.toLowerCase()}?`)) {
      deleteDocContext(documentTypeKey, docId);
    }
  };

  const handleFormSubmit = (docData: T) => {
    if (editingDocument && editingDocument.id) {
      updateDocContext(documentTypeKey, { ...docData, id: editingDocument.id, creationDate: editingDocument.creationDate });
    } else {
      addDocContext(documentTypeKey, docData as Omit<T, 'id' | 'creationDate' | 'responsibleUserName' | 'clientName'>);
    }
    setIsModalOpen(false);
    setEditingDocument(null);
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const searchTermLower = searchTerm.toLowerCase();
      let matchesSearch = (doc.documentNumber.toLowerCase().includes(searchTermLower) ||
        (doc.clientName && doc.clientName.toLowerCase().includes(searchTermLower)) ||
        (doc.responsibleUserName && doc.responsibleUserName.toLowerCase().includes(searchTermLower)));

      if (documentTypeKey === 'PurchaseOrder') {
          const poDoc = doc as PurchaseOrder;
          if (poDoc.clientPurchaseOrderNumber && poDoc.clientPurchaseOrderNumber.toLowerCase().includes(searchTermLower)){
            matchesSearch = true;
          }
      }
        
      const matchesFilter = (statusFilter === '' || doc.status === statusFilter);
      return matchesSearch && matchesFilter;
    });
  }, [documents, searchTerm, statusFilter, documentTypeKey]);
  

  const defaultColumns: ColumnDefinition<T>[] = [
    { key: 'documentNumber', header: 'Nº Interno', render: (doc) => <span className="font-medium text-gray-900">{doc.documentNumber}</span>},
    // Specific columns like 'clientPurchaseOrderNumber' will be inserted by `specificColumns` prop
    { key: 'clientName', header: 'Cliente' },
    { key: 'creationDate', header: 'Fecha Creación' },
    { key: 'dueDate', header: 'Fecha Vencimiento' },
    { key: 'totalAmount', header: 'Monto Total' },
    { key: 'status', header: 'Estado' },
    { key: 'responsibleUserName', header: 'Responsable' },
  ];

  let combinedColumns = [...defaultColumns];
  if (specificColumns) {
    // Remove default columns that are also in specificColumns to avoid duplicates and respect specific order/render
    combinedColumns = defaultColumns.filter(dc => !specificColumns.some(sc => sc.key === dc.key));
    
    // Attempt to insert specific columns strategically. A common place is after 'documentNumber'
    // or just append them and let table order them, or allow specificColumns to define an 'order' prop.
    // For now, let's insert specific ones not already present after 'documentNumber' or at a defined position if possible.
    const baseKeyForInsertion = 'documentNumber';
    let insertAtIndex = combinedColumns.findIndex(c => c.key === baseKeyForInsertion) + 1 || 1;

    specificColumns.forEach(sc => {
        if (!combinedColumns.some(cc => cc.key === sc.key)) {
            combinedColumns.splice(insertAtIndex, 0, sc);
            insertAtIndex++;
        }
    });
  }
  
  const finalColumns = combinedColumns.filter((col, index, self) =>
    index === self.findIndex((c) => c.key === col.key)
  );


  const renderRowActions = (doc: T) => (
    <div className="space-x-2">
      <button onClick={(e) => {e.stopPropagation(); handleEdit(doc);}} className="text-blue-600 hover:text-blue-800 p-1"><PencilIcon /></button>
      <button onClick={(e) => {e.stopPropagation(); handleDelete(doc.id);}} className="text-red-600 hover:text-red-800 p-1"><TrashIcon /></button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dark transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo {documentTypeLabel}
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow flex space-x-4">
         <input 
            type="text"
            placeholder={`Buscar ${documentTypeLabel.toLowerCase()} (Nº Interno, Nº OC Cliente, Cliente, Responsable)...`}
            className="flex-grow p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | '')}
            className="p-2 border border-gray-300 rounded-md bg-white"
        >
            <option value="">Todos los Estados</option>
            {availableStatusesForType.map(status => ( // Use filtered statuses for dropdown
                <option key={status} value={status}>{status}</option>
            ))}
        </select>
      </div>

      <DataTable
        columns={finalColumns}
        data={filteredDocuments}
        renderRowActions={renderRowActions}
        onRowClick={(doc) => handleEdit(doc)}
        emptyStateMessage={`No se encontraron ${documentTypeLabel.toLowerCase()}s.`}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingDocument ? `Editar ${documentTypeLabel}` : `Nuevo ${documentTypeLabel}`}
        size="lg"
      >
        <GenericDocumentForm<T>
            initialData={editingDocument} 
            onSubmit={handleFormSubmit} 
            onCancel={() => { setIsModalOpen(false); setEditingDocument(null); }} 
            documentTypeKey={documentTypeKey}
            documentTypeLabel={documentTypeLabel}
            users={users}
            clients={clients}
            availableStatuses={availableStatusesForType}
        />
      </Modal>
    </div>
  );
};

export default GenericDocumentPage;
