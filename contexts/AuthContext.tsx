
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, PerfilUsuario, Grupo } from '../types';
import { USER_AVATAR_PLACEHOLDER } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (correo: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = async (correo: string, _password: string): Promise<boolean> => {
    try {
      // Aquí iría la llamada a tu API para autenticar
      // Por ahora, simulamos una respuesta exitosa
      const mockPerfil: PerfilUsuario = {
        id: 1,
        nombre: 'Administrador',
        descripcion: 'Administrador del sistema'
      };
      
      const mockGrupo: Grupo = {
        id: 1,
        nombre: 'Administración',
        descripcion: 'Grupo de administradores'
      };

      const mockUser: User = {
        id: 1,
        nombre: 'Jaime Valtierra',
        rut: '12.345.678-9',
        perfil: mockPerfil,
        telefono: '+56912345678',
        correo,
        password: '', // No almacenar la contraseña en el estado
        grupo: mockGrupo,
        role: 'Administrador', // Para compatibilidad
        avatarUrl: USER_AVATAR_PLACEHOLDER
      };

      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    // Aquí podrías hacer una llamada a tu API para cerrar la sesión
    setUser(null);
    // Opcional: redirigir al login
    // navigate('/login');
  };
  
  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    // Verifica si el perfil del usuario tiene alguno de los roles requeridos
    return roles.some(role => user.perfil.nombre.toLowerCase() === role.toLowerCase());
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    