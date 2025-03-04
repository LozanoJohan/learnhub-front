import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


// Interfaz para las funciones y estado que expondrá el contexto
interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  isSearchActive: boolean;
  activateSearch: () => void;
  showCoursera: boolean;
  setShowCoursera: (show: boolean) => void;
  isRealtime: boolean;
  setIsRealtime: (isRealtime: boolean) => void;
  siaCreditsFilter: number | null;
  setSiaCreditsFilter: (filter: number | null) => void;
}

// Crear el contexto
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext debe ser usado dentro de un SearchProvider');
  }
  return context;
};

// Proveedor del contexto
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showCoursera, setShowCoursera] = useState(true);
  const [isRealtime, setIsRealtime] = useState(false);
  const [siaCreditsFilter, setSiaCreditsFilter] = useState<number | null>(null);

  const activateSearch = () => {
    setIsSearchActive(true);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        query, 
        setQuery, 
        isSearchActive, 
        activateSearch,
        showCoursera,
        setShowCoursera,
        isRealtime,
        setIsRealtime,
        siaCreditsFilter,
        setSiaCreditsFilter
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}; 