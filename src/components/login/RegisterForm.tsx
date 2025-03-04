import React, { useState } from 'react';
import { loginWithGoogle } from '../../lib/firebase-auth';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Usar el endpoint de API de Astro en lugar de la función directa
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      
      // Redireccionar al usuario a la página principal
      window.location.href = '/';
    } catch (error) {
      console.error('Error de registro:', error);
      setError(error instanceof Error ? error.message : 'Error al registrar usuario. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await loginWithGoogle();
      
      // Guardar información del usuario en cookies
      document.cookie = `userEmail=${userData.email}; path=/; max-age=86400`;
      document.cookie = `userName=${userData.name}; path=/; max-age=86400`;
      document.cookie = `userPicture=${userData.picture}; path=/; max-age=86400`;
      
      // Redireccionar al usuario a la página principal
      window.location.href = '/';
    } catch (error) {
      console.error('Error de inicio de sesión con Google:', error);
      setError('Error al iniciar sesión con Google. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
          <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0909 11.9998 19.0909C8.86633 19.0909 6.21896 17.0807 5.27682 14.2773L1.2373 17.3898C3.19263 21.3185 7.26484 24.0002 11.9998 24.0002C14.9327 24.0002 17.7352 22.959 19.834 21.0014L16.0406 18.0142Z" fill="#34A853"/>
          <path d="M19.8342 20.9972C22.0292 18.9339 23.4545 15.903 23.4545 12.0002C23.4545 11.2636 23.3636 10.5456 23.1818 9.86367H12V14.4546H18.4364C18.1188 16.013 17.2663 17.2635 16.0407 18.0142L19.8342 20.9972Z" fill="#4A90E2"/>
          <path d="M5.27698 14.2774C5.03833 13.5563 4.90909 12.7917 4.90909 12.0002C4.90909 11.2088 5.03834 10.4441 5.2662 9.7654L1.23999 6.65088C0.436587 8.25579 0 10.067 0 12.0002C0 13.9333 0.436586 15.7446 1.23746 17.3492L5.27698 14.2774Z" fill="#FBBC05"/>
        </svg>
        Continuar con Google
      </button>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              O regístrate con email
            </span>
          </div>
        </div>
        
        <form className="mt-6 space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo electrónico
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar contraseña
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 