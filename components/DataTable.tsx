import React from 'react';
import { STATUS_COLORS } from '../constants';
import { DocumentStatus } from '../types';

export interface ColumnDefinition<T> {
  key: keyof T | string; // Allow string for custom keys not directly in T
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string; // For cell content
  headerClassName?: string; // For header cell
}

interface DataTableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderRowActions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
}

const DataTable = <T extends { id: string },>(
  { columns, data, renderRowActions, onRowClick, isLoading = false, emptyStateMessage = "No hay datos disponibles." }: DataTableProps<T>
): React.ReactNode => {
  
  const getStatusClass = (statusValue: unknown): string => {
    if (typeof statusValue === 'string' && STATUS_COLORS[statusValue]) {
      return `${STATUS_COLORS[statusValue]} text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full`;
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (data.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyStateMessage}</h3>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
            {renderRowActions && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value = String(col.key).includes('.') ? (String(col.key)).split('.').reduce((o: any, i) => o?.[i], item) : (item as any)[col.key as string | number];
                return (
                  <td key={String(col.key)} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${col.className || ''}`}>
                    {col.render ? col.render(item) : 
                     col.key === 'status' && typeof value === 'string' && Object.values(DocumentStatus).includes(value as DocumentStatus) ? (
                       <span className={getStatusClass(value)}>{value}</span>
                     ) :
                     typeof value === 'number' && String(col.key).toLowerCase().includes('amount') ? (
                        value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
                     ) :
                     (typeof value === 'string' && (value.includes('T') && value.includes('Z') && !isNaN(new Date(value).getTime()))) ? ( // Basic ISO date check
                        new Date(value).toLocaleDateString('es-CL')
                     ) :
                     value !== null && value !== undefined ? String(value) : '-'}
                  </td>
                );
              })}
              {renderRowActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderRowActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;