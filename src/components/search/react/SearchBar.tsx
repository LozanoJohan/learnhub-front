import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useSearchContext } from '../../../services/searchContextReact';

const SearchBar: React.FC = () => {
  const [isCreditsDropdownOpen, setIsCreditsDropdownOpen] = useState(false);
  const { 
    query, 
    setQuery, 
    activateSearch,
    showCoursera,
    setShowCoursera,
    isRealtime,
    setIsRealtime,
    siaCreditsFilter,
    setSiaCreditsFilter
  } = useSearchContext();

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    activateSearch();
  };

  // Manejar cambio en el input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Agrego función para manejar selección de filtro de créditos
  const handleSiaCreditsFilter = (credits: number | null) => {
    setSiaCreditsFilter(credits);
    setIsCreditsDropdownOpen(false);
  };

  return (
    <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div className="flex">
          <label
            htmlFor="search-dropdown"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          ></label>

          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="liderazgo, ingesoft, 8B2234..."
              value={query}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="absolute top-0 end-0 mt-2 mr-2 p-2 text-sm font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                ></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            type="button"
            onClick={() => setShowCoursera(!showCoursera)}
            title="Muestra u oculta los resultados de cursos de Coursera en la búsqueda"
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              showCoursera
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Coursera
          </button>
          
          <button
            type="button"
            onClick={() => setIsRealtime(!isRealtime)}
            title="Muestra los resultados de cursos como los cupos en tiempo real"
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              isRealtime
                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Realtime
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCreditsDropdownOpen(!isCreditsDropdownOpen)}
              title="Filtra cursos del SIA por número de créditos"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {siaCreditsFilter != null ? `${siaCreditsFilter} Créditos` : 'Todos Créditos'}
            </button>
            {isCreditsDropdownOpen && (
              <div
                id="credits-dropdown"
                className="z-20 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700"
                style={{ top: "calc(100% + 5px)", left: "50%", transform: "translateX(-50%)" }}
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  {[2,3,4,5,6].map((credits) => (
                    <li key={credits}>
                      <button
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => handleSiaCreditsFilter(credits)}
                      >
                     
                        {credits} ©️
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => handleSiaCreditsFilter(null)}
                    >
                
                      Todos Créditos
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar; 