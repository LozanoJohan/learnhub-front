import React, { useEffect, useState } from 'react';
import { useSearchContext } from '../../../services/searchContextReact';
import type { CourseraCourse, SIACourse } from '../../../models/courses';
import type { Club } from '../../../models/clubs';
import { getCourseraCourses } from '../../../services/courseraService';
import { getClubs } from '../../../services/clubService';
import { getSiaCourses } from '../../../services/siaService';
import { getRelatedCourses } from '../../../services/vectorSearchService';
import { searchCoursesByVector } from '../../../services/vectorSearchService';

const SearchResults: React.FC = () => {
  const { query, isSearchActive, showCoursera, isRealtime, siaCreditsFilter } = useSearchContext();
  const [courseraResults, setCourseraResults] = useState<CourseraCourse[]>([]);
  const [clubResults, setClubResults] = useState<Club[]>([]);
  const [siaResults, setSiaResults] = useState<SIACourse[]>([]);
  const [isLoadingCoursera, setIsLoadingCoursera] = useState(false);
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [isLoadingSia, setIsLoadingSia] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<SIACourse | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<SIACourse[]>([]);
  const [useVectorSearch, setUseVectorSearch] = useState(false);

  const safeDecode = (str: string) => {
    try {
      return decodeURIComponent(escape(str));
    } catch (e) {
      console.error('Error decodificando cadena:', e);
      return str;
    }
  };

  useEffect(() => {
    if (!isSearchActive && !isRealtime) return;
    
    setIsLoadingSia(true);
    setSiaResults([]);
    setSelectedCourse(null);
    setRelatedCourses([]);

    const cleanQuery = safeDecode(query.trim());
    if (!cleanQuery) {
      setSiaResults([]);
      setCourseraResults([]);
      setClubResults([]);
      setIsLoadingSia(false);
      return;
    }

    // Búsqueda de SIA (vectorial o tradicional)
    const fetchSIACourses = async () => {
      try {
        let results;
        if (useVectorSearch) {
          // Usar búsqueda vectorial
          results = await searchCoursesByVector(cleanQuery);
        } else {
          // Usar búsqueda tradicional
          results = await getSiaCourses(cleanQuery);
        }
        
        // Filtrar por créditos si hay un filtro activo
        if (siaCreditsFilter !== null) {
          results = results.filter(course => course.credits === siaCreditsFilter);
        }
        
        setSiaResults(results);
      } catch (error) {
        console.error('Error fetching SIA courses:', error);
        setSiaResults([]);
      }
    };

    // Obtener cursos de Coursera
    setIsLoadingCoursera(true);
    setCourseraResults([]);
    getCourseraCourses(cleanQuery)
      .then((data) => {
        const results = query === "" ? data.slice(0,6) : data;
        setCourseraResults(results);
        setIsLoadingCoursera(false);
      })
      .catch((error) => {
        console.error('Error fetching Coursera courses:', error);
        setCourseraResults([]);
        setIsLoadingCoursera(false);
      });

    // Obtener clubs/canales
    setIsLoadingClubs(true);
    getClubs(cleanQuery)
      .then((data) => {
        const results = query === "" ? data.slice(0,6) : data;
        setClubResults(results);
        setIsLoadingClubs(false);
      })
      .catch((error) => {
        console.error('Error fetching clubs:', error);
        setClubResults([]);
        setIsLoadingClubs(false);
      });

    Promise.all([
      fetchSIACourses(),
      showCoursera ? getCourseraCourses(cleanQuery).then(setCourseraResults) : Promise.resolve(),
      getClubs(cleanQuery).then(setClubResults)
    ]).finally(() => {
      setIsLoadingSia(false);
    });

  }, [query, isSearchActive, showCoursera, isRealtime, siaCreditsFilter, useVectorSearch]);

  // Función para mostrar cursos relacionados
  const handleShowRelatedCourses = async (course: SIACourse) => {
    try {
      setSelectedCourse(course);
      setIsLoadingSia(true);
      
      // Obtener cursos relacionados por su código
      const related = await getRelatedCourses(course.code || course.id);
      setRelatedCourses(related);
    } catch (error) {
      console.error('Error fetching related courses:', error);
      setRelatedCourses([]);
    } finally {
      setIsLoadingSia(false);
    }
  };

  // Sección para mostrar la cabecera con estadísticas y opciones
  const renderSearchHeader = () => {
    const totalResults = siaResults.length + courseraResults.length + clubResults.length;
    
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            Resultados para: <span className="text-teal-600 dark:text-teal-400">"{query}"</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalResults} resultados encontrados
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-700 dark:text-gray-300">Tipo de búsqueda:</label>
            <select 
              className="text-sm rounded border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              value={useVectorSearch ? "vector" : "traditional"}
              onChange={(e) => setUseVectorSearch(e.target.value === "vector")}
            >
              <option value="traditional">Tradicional (keywords)</option>
              <option value="vector">Vectorial (semántica)</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar los resultados de clubs
  const renderClubResults = () => {
    if (isLoadingClubs) {
      return (
        <div className="col-span-full text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando clubs...</p>
        </div>
      );
    }

    if (clubResults.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron clubs.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {clubResults.map((club: Club) => (
          <div key={club.id} className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href={`/clubs/${club.id}`}>
              <div className="p-5">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                  {club.nombre}
                </h5>
                <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                  {club.descripcion}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">
                    {club.area}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">
                    {club.currentSize}/{club.capacity} miembros
                  </span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar los resultados del SIA
  const renderSIAResults = () => {
    if (siaResults.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-teal-700 dark:text-teal-500">
          Resultados SIA ({siaResults.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siaResults.map((course) => (
            <div 
              key={course.id} 
              className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow 
                         ${selectedCourse?.id === course.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold">{course.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {course.credits} créditos
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full 
                    ${course.difficulty === 'fácil' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                    course.difficulty === 'medio' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                    {course.difficulty}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {course.description}
              </p>
              
              {useVectorSearch && course.similarity_score && (
                <div className="mb-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-teal-600 dark:bg-teal-500 h-2.5 rounded-full" 
                      style={{width: `${Math.round((course.similarity_score || 0) * 100)}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                    Relevancia: {Math.round((course.similarity_score || 0) * 100)}%
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => handleShowRelatedCourses(course)}
                  className="text-sm px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded transition"
                >
                  Ver cursos relacionados
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render para cursos relacionados
  const renderRelatedCourses = () => {
    if (!selectedCourse || relatedCourses.length === 0) return null;

    return (
      <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">
          Cursos relacionados con "{selectedCourse.title}"
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedCourses.map((course) => (
            <div 
              key={course.id} 
              className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold">{course.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {course.credits} créditos
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {course.description}
              </p>
              
              <div className="mb-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full" 
                    style={{width: `${Math.round((course.similarity_score || 0) * 100)}%`}}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                  Similitud: {Math.round((course.similarity_score || 0) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar los resultados de Coursera
  const renderCourseraResults = () => {
    if (!showCoursera) return null;

    if (isLoadingCoursera) {
      return (
        <div className="col-span-full text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando cursos de Coursera...</p>
        </div>
      );
    }

    if (courseraResults.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron cursos de Coursera.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta con otros términos de búsqueda o ajusta los filtros.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {courseraResults.map((course: CourseraCourse) => (
          <div key={course.id} className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href={course.url} target="_blank" rel="noopener noreferrer">
              <div className="p-5">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                  {safeDecode(course.title)}
                </h5>
                <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                  {safeDecode(course.skills)}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {course.score.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {parseInt(course.reviews).toLocaleString('es-CO')} reseñas
                  </span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  };

  if (!isSearchActive && !isRealtime) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {renderSearchHeader()}
        
        {isLoadingSia ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-teal-500 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {renderSIAResults()}
            {renderRelatedCourses()}
            {renderCourseraResults()}
            {renderClubResults()}

            {siaResults.length === 0 && courseraResults.length === 0 && clubResults.length === 0 && query.trim() !== '' && (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No se encontraron resultados para "{query}"
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Intenta con otros términos o una búsqueda más amplia.
                </p>
                {!useVectorSearch && (
                  <button
                    onClick={() => setUseVectorSearch(true)}
                    className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded transition"
                  >
                    Probar con búsqueda semántica
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchResults; 