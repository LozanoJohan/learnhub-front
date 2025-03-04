import React from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { SearchProvider } from '../../../services/searchContextReact';

const SearchSection: React.FC = () => {
  return (
    <SearchProvider>
      <section className="max-w-screen-xl mx-auto px-4 py-4 md:py-12 lg:py-24">
        <h1
          className="mb-5 text-xl sm:text-2xl sm:font-bold text-center leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white md:pb-5 lg:pb-10"
        >
          Encontrar electivas nunca fue tan fácil
        </h1>
        <SearchBar />
      </section>
      <SearchResults />
    </SearchProvider>
  );
};

export default SearchSection; 