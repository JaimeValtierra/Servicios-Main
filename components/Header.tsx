
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, ChevronDownIcon, UserCircleIcon } from './icons/Icons'; // Corrected path
import { USER_AVATAR_PLACEHOLDER } from '../constants';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    alert('Funcionalidad "Mi Perfil" no implementada todavía.');
    console.log('Attempted to navigate to Profile. Feature not implemented.');
    setDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    alert('Funcionalidad "Configuración" no implementada todavía.');
    console.log('Attempted to navigate to Settings. Feature not implemented.');
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center fixed top-0 left-64 right-0 h-16 z-30">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-brand-primary focus:outline-none"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
            )}
            <span className="hidden md:inline text-sm">{user?.name || 'Usuario'}</span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button 
                onClick={handleProfileClick} 
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mi Perfil
              </button>
              <button 
                onClick={handleSettingsClick} 
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configuración
              </button>
              <button 
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                  // No need to navigate here, NavLink in Sidebar handles it or App.tsx logic
                }} 
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;