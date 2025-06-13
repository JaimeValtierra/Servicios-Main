
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com'); // Default for demo
  const [password, setPassword] = useState('password'); // Dummy password
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Mock login logic
    if (email === 'admin@example.com' && password === 'password') {
      login(email, password);
      navigate('/');
    } else if (email === 'manager@example.com' && password === 'password') {
      login(email, password);
      navigate('/');
    } else if (email === 'operator@example.com' && password === 'password') {
      login(email, password);
      navigate('/');
    }
    else {
      setError('Credenciales inválidas. Pruebe admin@example.com o manager@example.com con contraseña "password".');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <img 
            src="/logoN.png" 
            alt="Main Ingenieros Spa" 
            className="w-20 h-20 object-contain"
          />
          <h1 className="text-3xl font-bold text-brand-primary">Iniciar Sesión</h1>
        </div>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-dark"
            >
              Ingresar
            </button>
          </div>
        </form>
        <p className="mt-6 text-xs text-gray-500 text-center">
            Demo: admin@example.com, manager@example.com, operator@example.com. Contraseña: "password".
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
    