
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NavItem, NAVIGATION_ITEMS, LOGOUT_ITEM } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!hasRole(item.allowedRoles)) {
        return null;
      }
    }

    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
    
    return (
      <li key={item.name}>
        <NavLink
          to={item.path}
          onClick={item.path === '/login' ? logout : undefined}
          className={`flex items-center p-3 rounded-lg text-sm hover:bg-sidebar-hover hover:text-white transition-colors duration-150
            ${isActive ? 'bg-sidebar-active text-white font-semibold' : 'text-gray-300'}
            ${isSubItem ? 'pl-10' : 'pl-3'}`}
        >
          <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
          {item.name}
        </NavLink>
        {item.subItems && isActive && (
          <ul className="mt-1 space-y-1">
            {item.subItems.map(subItem => renderNavItem(subItem, true))}
          </ul>
        )}
      </li>
    );
  };
  
  const groupedNavItems = NAVIGATION_ITEMS.reduce((acc, item) => {
    const section = item.section || 'UNCATEGORIZED';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  // userInitial podría usarse para mostrar las iniciales del usuario en el futuro

  return (
    <aside className="w-64 bg-sidebar-bg text-white flex flex-col h-screen fixed top-0 left-0 shadow-lg z-40">
      <div className="p-4 border-b border-gray-700 flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="Main Ingenieros Spa" 
          className="w-32 h-32 object-contain mb-2"
        />
        <h1 className="text-xl font-semibold text-white text-center">Main Ingenieros SPA</h1>
      </div>
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {Object.entries(groupedNavItems).map(([section, items]) => (
           items.length > 0 && (
            <div key={section} className="mb-4">
              <h2 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{section}</h2>
              <ul className="space-y-1">
                {items.map(item => renderNavItem(item))}
              </ul>
            </div>
           )
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <ul>
          {renderNavItem(LOGOUT_ITEM)}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;