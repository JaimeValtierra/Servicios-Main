
import React from 'react';
import GenericDocumentPage from './GenericDocumentPage';
import { WorkOrder } from '../types';
import { useData } from '../contexts/DataContext';
import { ColumnDefinition } from '../components/DataTable';

const WorkOrdersPage: React.FC = () => {
  const { workOrders, addDocument, updateDocument, deleteDocument } = useData();

  const getWorkOrders = (): WorkOrder[] => workOrders;

  const specificColumns: ColumnDefinition<WorkOrder>[] = [
    { key: 'description', header: 'Descripción Breve', render: (wo) => <span className="truncate w-32 block" title={wo.description}>{wo.description}</span>},
  ];

  return (
    <GenericDocumentPage<WorkOrder>
      pageTitle="Gestión de Órdenes de Trabajo"
      documentTypeLabel="Orden de Trabajo"
      documentTypeKey="WorkOrder"
      getDocuments={getWorkOrders}
      addDocument={addDocument}
      updateDocument={updateDocument}
      deleteDocument={deleteDocument}
      specificColumns={specificColumns}
    />
  );
};

export default WorkOrdersPage;
    