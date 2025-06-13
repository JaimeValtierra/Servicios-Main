
import React from 'react';
import { ChartBarIcon, InformationCircleIcon } from '../components/icons/Icons';

const ReportsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Generar Reportes</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <ChartBarIcon className="w-16 h-16 text-brand-primary mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">Módulo de Reportes en Desarrollo</h2>
        <p className="text-gray-500">
          Esta sección permitirá generar reportes personalizados sobre clientes, ventas, finanzas y rendimiento operativo.
          Actualmente, esta funcionalidad está en planificación.
        </p>
        <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200 flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0"/>
            <p className="text-sm text-blue-700">
                En una futura implementación, aquí se podrían integrar gráficos (usando Recharts o D3.js) y opciones para exportar datos (ej. a Excel).
            </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
    