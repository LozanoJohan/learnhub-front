// Definition of common service types
export interface Filter {
  campo: string;
  valor: string | number | boolean;
}

export interface SearchOptions {
  filtros?: Filter[];
  limite?: number;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  datos: T[];
  total: number;
} 