
import React from 'react';
import GenericDocumentPage from './GenericDocumentPage';
import { Budget, DocumentStatus } from '../types';
import { useData } from '../contexts/DataContext';
import { ColumnDefinition } from '../components/DataTable';

const BudgetsPage: React.FC = () => {
  const { budgets, addDocument, updateDocument, deleteDocument } = useData();

  const getBudgets = (): Budget[] => budgets;

  const specificColumns: ColumnDefinition<Budget>[] = [
    // Example of a specific column for Budgets, if any.
    // { key: 'validityDays', header: 'Validez (días)' },
  ];

  return (
    <GenericDocumentPage<Budget>
      pageTitle="Gestión de Presupuestos"
      documentTypeLabel="Presupuesto"
      documentTypeKey="Budget"
      getDocuments={getBudgets}
      addDocument={addDocument}
      updateDocument={updateDocument}
      deleteDocument={deleteDocument}
      specificColumns={specificColumns}
    />
  );
};

export default BudgetsPage;
    