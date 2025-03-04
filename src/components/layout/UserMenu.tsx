import React, { useState, useEffect, useRef } from 'react';

interface UserMenuProps {
  userEmail?: string;
  userName?: string;
  userPicture?: string;
}

export default function UserMenu({ userEmail, userName = 'Usuario', userPicture }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Cerrar menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };
  
  // Mostrar botón de inicio de sesión si no hay usuario
  if (!userEmail) {
    return (
      <div className="flex items-center space-x-3">
        <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
          Iniciar sesión
        </a>
        <a 
          href="/login/register" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Registrarse
        </a>
      </div>
    );
  }
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`}
            alt={userName}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
            {userName}
          </span>
        </div>
        <svg 
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
          </div>
          
          <a 
            href="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Perfil
          </a>
          <a 
            href="/settings" 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Configuración
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
} 