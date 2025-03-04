import React, { useEffect, useState } from 'react';
import { useSearchContext } from '../../../services/searchContextReact';
import type { CourseraCourse, SIACourse } from '../../../models/courses';
import type { Club } from '../../../models/clubs';
import { getCourseraCourses } from '../../../services/courseraService';
import { getClubs } from '../../../services/clubService';
import { searchCoursesByVector } from '../../../services/vectorSearchService';

const SearchResults: React.FC = () => {
  const { query, isSearchActive, showCoursera, siaCreditsFilter } = useSearchContext();
  const [courseraResults, setCourseraResults] = useState<CourseraCourse[]>([]);
  const [clubResults, setClubResults] = useState<Club[]>([]);
  const [siaResults, setSiaResults] = useState<SIACourse[]>([]);
  const [isLoadingCoursera, setIsLoadingCoursera] = useState(false);
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [isLoadingSia, setIsLoadingSia] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<SIACourse | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<SIACourse[]>([]);

  // useEffect para Coursera
  useEffect(() => {
    // Obtener cursos de Coursera
    setIsLoadingCoursera(true);
    setCourseraResults([]);
    getCourseraCourses(query)
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
  }, [query, isSearchActive, showCoursera]);

  // useEffect para Clubs
  useEffect(() => {
    // Obtener clubs/canales
    setIsLoadingClubs(true);
    getClubs(query)
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
  }, [query, isSearchActive]);

  // useEffect para SIA usando siempre búsqueda vectorial
  useEffect(() => {
    // Obtener cursos del SIA
    setIsLoadingSia(true);
    setSiaResults([]);
    setSelectedCourse(null);
    setRelatedCourses([]);
    
    // Siempre usar búsqueda vectorial
    searchCoursesByVector(query)
      .then((data) => {
        let results = data;
        if (siaCreditsFilter != null) {
          results = results.filter((course: SIACourse) => course.credits === siaCreditsFilter);
        } else if (query === "") {
          results = results.slice(0,6);
        }
        setSiaResults(results);
        setIsLoadingSia(false);
      })
      .catch((error) => {
        console.error('Error fetching SIA courses:', error);
        setSiaResults([]);
        setIsLoadingSia(false);
      });
  }, [query, isSearchActive, siaCreditsFilter]);

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
          <a 
            key={club.id} 
            href={`/club/${club.id}`}
            className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <img className="rounded-t-lg w-full h-48 object-cover" src={"https://via.placeholder.com/400x200"} alt={club.nombre} />
            <div className="p-5">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{club.nombre}</h5>
              <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                {club.descripcion}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">
                  {club.area}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {club.currentSize}/{club.capacity} miembros
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  // Renderizar los resultados del SIA
  const renderSIAResults = () => {
    if (isLoadingSia) {
      return (
        <div className="col-span-full text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando cursos del SIA...</p>
        </div>
      );
    }

    if (siaResults.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron electivas en el SIA.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta con otros términos de búsqueda o ajusta los filtros.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {siaResults.map((course: SIACourse) => (
          <a 
            key={course.id} 
            href={`/s/${course.id}`}
            className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="p-5">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                {course.title}
              </h5>
              <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">
                  {course.credits} créditos
                </span>
                {course.similarity_score !== undefined && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-green-200 dark:text-green-800">
                    Relevancia: {Math.round((course.similarity_score) * 100)}%
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">
                  Dificultad: {course.difficulty}
                </span>
                {course.places && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">
                    {course.places} cupos
                  </span>
                )}
              </div>
              
            </div>
          </a>
        ))}
      </div>
    );
  };

  // Renderizar cursos relacionados
  const renderRelatedCourses = () => {
    if (!selectedCourse || relatedCourses.length === 0) return null;

    return (
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          Cursos relacionados con "{selectedCourse.title}"
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCourses.map((course) => (
            <div 
              key={course.id} 
              className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold">{course.title}</h4>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {course.credits} créditos
                </span>
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
        <div className="mt-3 text-right">
          <button
            onClick={() => {
              setSelectedCourse(null);
              setRelatedCourses([]);
            }}
            className="text-sm px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
          >
            Cerrar
          </button>
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
            No se encontraron cursos en Coursera.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {courseraResults.map((course: CourseraCourse) => (
          <a 
            key={course.id} 
            href={`/c/${course.id}`}
            className="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="p-5">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                {course.title}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Por {course.professor}
              </p>
              <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                {course.skills}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-yellow-200 dark:text-yellow-800">
                  {course.score.toFixed(1)} ★
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-yellow-200 dark:text-yellow-800">
                  {course.reviews} reseñas
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-yellow-200 dark:text-yellow-800">
                  Dificultad: {course.difficulty}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-800">
        {/* Sección de cursos del SIA */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white px-4 py-2">
            Electivas del SIA 
          </h2>
          {renderSIAResults()}
          {renderRelatedCourses()}
        </div>

        {/* Sección de cursos de Coursera */}
        {showCoursera && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white px-4 py-2">
              Cursos de Coursera
            </h2>
            {renderCourseraResults()}
          </div>
        )}

        {/* Sección de clubs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white px-4 py-2">
            Clubs y Grupos de Estudio
          </h2>
          {renderClubResults()}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 