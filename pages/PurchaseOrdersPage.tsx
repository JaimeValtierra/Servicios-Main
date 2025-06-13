
import React from 'react';
import GenericDocumentPage from './GenericDocumentPage';
import { PurchaseOrder } from '../types';
import { useData } from '../contexts/DataContext';
import { ColumnDefinition } from '../components/DataTable';

const PurchaseOrdersPage: React.FC = () => {
  const { purchaseOrders, addDocument, updateDocument, deleteDocument } = useData();

  const getPurchaseOrders = (): PurchaseOrder[] => purchaseOrders;
  
  const specificColumns: ColumnDefinition<PurchaseOrder>[] = [
    { key: 'clientPurchaseOrderNumber', header: 'Nº OC Cliente' },
  ];

  return (
    <GenericDocumentPage<PurchaseOrder>
      pageTitle="Gestión de Órdenes de Compra"
      documentTypeLabel="Orden de Compra"
      documentTypeKey="PurchaseOrder"
      getDocuments={getPurchaseOrders}
      addDocument={addDocument}
      updateDocument={updateDocument}
      deleteDocument={deleteDocument}
      specificColumns={specificColumns}
    />
  );
};

export default PurchaseOrdersPage;