import React from 'react';
import { Link } from 'react-router-dom';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, to, onClick }) => {
  const commonClasses = "flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center text-brand-primary hover:text-brand-primary-dark min-h-[120px]";
  
  const IconElement = React.isValidElement(icon) ? 
    React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8" }) 
    : icon;

  if (onClick) {
    return (
      <button onClick={onClick} className={commonClasses}>
        <div className="mb-2 text-brand-primary">
          {IconElement}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </button>
    );
  }

  return (
    <Link to={to} className={commonClasses}>
      <div className="mb-2 text-brand-primary">
        {IconElement}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  );
};

export default ActionButton;