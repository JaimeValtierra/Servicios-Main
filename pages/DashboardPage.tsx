
import React from 'react';
import KpiCard from '../components/KpiCard';
import ActionButton from '../components/ActionButton';
import { UsersIcon, DocumentTextIcon, ClipboardListIcon, BriefcaseIcon, CurrencyDollarIcon, PlusIcon, ClockIcon, CheckCircleIcon } from '../components/icons/Icons';
import { useData } from '../contexts/DataContext';
import { DocumentStatus, RecentActivity, UpcomingDueDate } from '../types';
import { STATUS_COLORS }
 from '../constants';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { clients, budgets, purchaseOrders, workOrders, invoices, recentActivity, upcomingDueDates } = useData();

  const getPendingCount = <T extends { status: DocumentStatus },>(items: T[]): number => {
    return items.filter(item => 
      item.status === DocumentStatus.PENDING || 
      item.status === DocumentStatus.IN_PROGRESS
    ).length;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
  };

  const formatCurrency = (amount: number) => {
     return amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const getStatusChip = (status: DocumentStatus) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };


  return (
    <div className="p-6 space-y-8">
      {/* KPIs */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <KpiCard title="Clientes" value={clients.length} icon={<UsersIcon />} linkTo="/clients" bgColorClass="bg-blue-50" textColorClass="text-blue-600" />
          <KpiCard title="Presupuestos" value={budgets.length} pending={getPendingCount(budgets)} icon={<DocumentTextIcon />} linkTo="/budgets" bgColorClass="bg-green-50" textColorClass="text-green-600" />
          <KpiCard title="Órdenes de Compra" value={purchaseOrders.length} pending={getPendingCount(purchaseOrders)} icon={<ClipboardListIcon />} linkTo="/purchase-orders" bgColorClass="bg-yellow-50" textColorClass="text-yellow-600" />
          <KpiCard title="Órdenes de Trabajo" value={workOrders.length} pending={getPendingCount(workOrders)} icon={<BriefcaseIcon />} linkTo="/work-orders" bgColorClass="bg-purple-50" textColorClass="text-purple-600" />
          <KpiCard title="Facturas" value={invoices.length} pending={getPendingCount(invoices.filter(inv => inv.status !== DocumentStatus.PAID))} icon={<CurrencyDollarIcon />} linkTo="/invoices" bgColorClass="bg-red-50" textColorClass="text-red-600" />
        </div>
      </section>

      {/* Acciones Rápidas */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <ActionButton icon={<UsersIcon />} label="Nuevo Cliente" to="/clients/new" />
          <ActionButton icon={<DocumentTextIcon />} label="Nuevo Presupuesto" to="/budgets/new" />
          <ActionButton icon={<ClipboardListIcon />} label="Nueva Orden C." to="/purchase-orders/new" />
          <ActionButton icon={<BriefcaseIcon />} label="Nueva Orden T." to="/work-orders/new" />
          <ActionButton icon={<CurrencyDollarIcon />} label="Nueva Factura" to="/invoices/new" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Actividad Reciente */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Actividad Reciente</h2>
            <Link to="#" className="text-sm text-brand-primary hover:underline">Ver todo</Link>
          </div>
          {recentActivity.length > 0 ? (
            <ul className="space-y-4">
              {recentActivity.map((activity: RecentActivity) => (
                <li key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === 'CREATED' && <PlusIcon className="w-5 h-5 text-green-500" />}
                    {activity.type === 'STATUS_CHANGED' && <CheckCircleIcon className="w-5 h-5 text-blue-500" />}
                    {activity.type === 'UPDATED' && <BriefcaseIcon className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user && `${activity.user} • `}
                      {new Date(activity.timestamp).toLocaleString('es-CL', { dateStyle:'short', timeStyle:'short' })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No hay actividad reciente.</p>
          )}
        </section>

        {/* Próximos Vencimientos */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Próximos Vencimientos</h2>
            <Link to="#" className="text-sm text-brand-primary hover:underline">Ver todo</Link>
          </div>
          {upcomingDueDates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-1 text-left font-medium text-gray-500">Tipo</th>
                    <th className="py-2 px-1 text-left font-medium text-gray-500">Cliente</th>
                    <th className="py-2 px-1 text-left font-medium text-gray-500">Vence</th>
                    <th className="py-2 px-1 text-right font-medium text-gray-500">Monto</th>
                    <th className="py-2 px-1 text-center font-medium text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingDueDates.map((item: UpcomingDueDate) => (
                    <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-2 px-1 text-gray-700 flex items-center">
                        {item.documentType === 'Budget' && <DocumentTextIcon className="w-4 h-4 mr-1 text-green-500" />}
                        {item.documentType === 'Invoice' && <CurrencyDollarIcon className="w-4 h-4 mr-1 text-red-500" />}
                        {item.documentType === 'WorkOrder' && <BriefcaseIcon className="w-4 h-4 mr-1 text-purple-500" />}
                        {item.documentNumber}
                      </td>
                      <td className="py-2 px-1 text-gray-700">{item.clientName}</td>
                      <td className="py-2 px-1 text-gray-700">{formatDate(item.dueDate)}</td>
                      <td className="py-2 px-1 text-right text-gray-700">{formatCurrency(item.amount)}</td>
                      <td className="py-2 px-1 text-center">{getStatusChip(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm">No hay vencimientos próximos.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
    