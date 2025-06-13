import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from './icons/Icons';

interface KpiCardProps {
  title: string;
  value: string | number;
  pending?: string | number;
  icon: React.ReactNode;
  bgColorClass?: string; // e.g., 'bg-blue-100'
  textColorClass?: string; // e.g., 'text-blue-600'
  linkTo: string;
  linkText?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, pending, icon, bgColorClass = 'bg-white', textColorClass = 'text-gray-700', linkTo, linkText="Ver detalles" }) => {
  return (
    <div className={`${bgColorClass} p-6 rounded-xl shadow-lg flex flex-col justify-between h-full`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-semibold ${textColorClass}`}>{title}</h3>
          <div className={`p-2 rounded-full ${bgColorClass === 'bg-white' ? 'bg-brand-primary/10' : 'bg-white/30'}`}>
             {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${textColorClass}` }) : icon}
          </div>
        </div>
        <p className={`text-4xl font-bold ${textColorClass}`}>{value}</p>
        {pending !== undefined && (
          <p className="text-sm text-gray-500 mt-1">
            {pending} {typeof pending === 'number' && pending > 0 ? 'pendientes' : typeof pending === 'string' && pending.includes('pendientes') ? '' : 'pendiente'}
          </p>
        )}
      </div>
      <Link to={linkTo} className={`mt-4 inline-flex items-center text-sm font-medium ${textColorClass} hover:underline`}>
        {linkText}
        <ExternalLinkIcon className="w-4 h-4 ml-1" />
      </Link>
    </div>
  );
};

export default KpiCard;