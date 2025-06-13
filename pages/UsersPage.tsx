
import React, { useState } from 'react';
import DataTable, { ColumnDefinition } from '../components/DataTable';
import { User, UserRole } from '../types';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';
import { USER_AVATAR_PLACEHOLDER } from '../constants';

// UserForm component defined outside UsersPage
interface UserFormProps {
  initialData?: User | null;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [user, setUser] = useState<Partial<User>>(initialData || {
    nombre: '', 
    rut: '',
    correo: '',
    telefono: '',
    password: 'contraseña123', // Contraseña por defecto segura
    perfil: { id: 3, nombre: 'Operador' }, // Por defecto Operador
    grupo: { id: 1, nombre: 'Principal' } // Grupo por defecto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'perfil') {
      const perfilId = parseInt(value);
      const perfilNombre = 
        perfilId === 1 ? 'Administrador' : 
        perfilId === 2 ? 'Gerente' : 'Operador';
      
      setUser(prev => ({ 
        ...prev, 
        perfil: { id: perfilId, nombre: perfilNombre }
      }));
    } else if (name === 'grupo') {
      setUser(prev => ({
        ...prev,
        grupo: { id: parseInt(value), nombre: value === '1' ? 'Principal' : 'Secundario' }
      }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.nombre || !user.rut || !user.correo) {
      alert("Nombre, RUT y Correo son campos requeridos.");
      return;
    }
    
    // Asegurarse de que el perfil esté definido
    if (!user.perfil) {
      setUser(prev => ({
        ...prev,
        perfil: { id: 3, nombre: 'Operador' }
      }));
    }
    
    onSubmit(user as User);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
          <input type="text" name="nombre" id="nombre" value={user.nombre || ''} onChange={handleChange} required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT *</label>
          <input type="text" name="rut" id="rut" value={user.rut || ''} onChange={handleChange} required 
            placeholder="12.345.678-9"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo Electrónico *</label>
          <input type="email" name="correo" id="correo" value={user.correo || ''} onChange={handleChange} required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" name="telefono" id="telefono" value={user.telefono || ''} onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
        </div>
        
        <div>
          <label htmlFor="perfil" className="block text-sm font-medium text-gray-700">Perfil *</label>
          <select name="perfil" id="perfil" 
            value={user.perfil?.id || 3} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
            <option value={1}>Administrador</option>
            <option value={2}>Gerente</option>
            <option value={3}>Operador</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="grupo" className="block text-sm font-medium text-gray-700">Grupo</label>
          <select name="grupo" id="grupo" 
            value={user.grupo?.id || 1} 
            onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
            <option value={1}>Principal</option>
            <option value={2}>Secundario</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" name="password" id="password" 
            value={user.password || ''} 
            onChange={handleChange} 
            placeholder="Dejar en blanco para no modificar"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"/>
          <p className="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} 
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
          Cancelar
        </button>
        <button type="submit" 
          className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-dark rounded-md transition-colors">
          {initialData ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};


const UsersPage: React.FC = () => {
  const { users: allUsers, addUser, updateUser } = useData(); // deleteUser can be added if needed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    // For now, disable deletion or add a soft delete / deactivate mechanism
    alert(`La eliminación de usuarios (${userId}) no está implementada en esta demo.`);
    // if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
    //   deleteUser(userId);
    // }
  };
  
  const handleFormSubmit = (userData: User) => {
    if (editingUser && editingUser.id) {
      updateUser({ ...userData, id: editingUser.id });
    } else {
      addUser(userData as Omit<User, 'id'>);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const columns: ColumnDefinition<User>[] = [
    { 
      key: 'id', 
      header: 'ID', 
      render: (user) => <span className="text-gray-500 text-sm">#{user.id}</span>,
      className: 'w-16'
    },
    { 
      key: 'nombre', 
      header: 'Nombre', 
      render: (user) => (
        <div>
          <div className="font-medium text-gray-900">{user.nombre}</div>
          <div className="text-sm text-gray-500">{user.correo}</div>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    { 
      key: 'rut', 
      header: 'RUT',
      render: (user) => <span className="font-mono">{user.rut}</span> 
    },
    { 
      key: 'perfil', 
      header: 'Perfil',
      render: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.perfil?.nombre === 'Administrador' ? 'bg-purple-100 text-purple-800' :
          user.perfil?.nombre === 'Gerente' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {user.perfil?.nombre || 'Operador'}
        </span>
      )
    },
    { 
      key: 'grupo', 
      header: 'Grupo',
      render: (user) => <span className="text-sm text-gray-600">{user.grupo?.nombre || 'Sin grupo'}</span>
    },
    { 
      key: 'telefono', 
      header: 'Teléfono',
      render: (user) => <span className="text-sm text-gray-600">{user.telefono || '-'}</span>
    },
  ];

  const renderRowActions = (user: User) => (
    <div className="flex space-x-2">
      <button 
        onClick={(e) => { e.stopPropagation(); handleEdit(user); }} 
        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
        title="Editar usuario"
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); handleDelete(user.id.toString()); }} 
        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={user.perfil?.nombre === 'Administrador'}
        title={user.perfil?.nombre === 'Administrador' ? 'No se puede eliminar un administrador' : 'Eliminar usuario'}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Administración de Usuarios</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dark transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <DataTable
        columns={columns}
        data={allUsers}
        renderRowActions={renderRowActions}
        onRowClick={(user) => handleEdit(user)}
        emptyStateMessage="No hay usuarios registrados."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}>
         <UserForm 
            initialData={editingUser} 
            onSubmit={handleFormSubmit} 
            onCancel={() => { setIsModalOpen(false); setEditingUser(null); }} 
        />
      </Modal>
    </div>
  );
};

export default UsersPage;
    