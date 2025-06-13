
import React from 'react';
import GenericDocumentPage from './GenericDocumentPage';
import { Invoice } from '../types';
import { useData } from '../contexts/DataContext';
import { ColumnDefinition } from '../components/DataTable';

const InvoicesPage: React.FC = () => {
  const { invoices, addDocument, updateDocument, deleteDocument } = useData();

  const getInvoices = (): Invoice[] => invoices;
  
  const specificColumns: ColumnDefinition<Invoice>[] = [
    { key: 'paymentDate', header: 'Fecha Pago', render: (inv) => inv.paymentDate ? new Date(inv.paymentDate).toLocaleDateString('es-CL') : 'Pendiente'},
  ];

  return (
    <GenericDocumentPage<Invoice>
      pageTitle="Gestión de Facturas"
      documentTypeLabel="Factura"
      documentTypeKey="Invoice"
      getDocuments={getInvoices}
      addDocument={addDocument}
      updateDocument={updateDocument}
      deleteDocument={deleteDocument}
      specificColumns={specificColumns}
    />
  );
};

export default InvoicesPage;
    