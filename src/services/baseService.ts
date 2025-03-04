import type { SearchOptions, SearchResult, Filter } from "./types";

export abstract class BaseService<T> {
  protected items: T[] = [];
  
  constructor(items: T[]) {
    this.items = items;
  }

  /**
   * Get all elements
   */
  getAll(): T[] {
    return this.items;
  }

  /**
   * Get an element by its ID
   * @param id ID of element to find
   * @param idField Name of ID field (default 'id')
   */
  getById(id: string, idField: string = 'id'): T | undefined {
    return this.items.find(item => (item as any)[idField] === id);
  }

  /**
   * Search elements with filters
   * @param options Search options
   */
  search(options: SearchOptions = {}): SearchResult<T> {
    let results = [...this.items];
    
    // Apply filters
    if (options.filtros && options.filtros.length > 0) {
      results = this.applyFilters(results, options.filtros);
    }
    
    // Sort
    if (options.ordenarPor) {
      results = this.sort(results, options.ordenarPor, options.direccion || 'asc');
    }
    
    const total = results.length;
    
    // Apply limit
    if (options.limite && options.limite > 0) {
      results = results.slice(0, options.limite);
    }
    
    return {
      datos: results,
      total
    };
  }
  
  /**
   * Filter items based on provided filters
   */
  protected applyFilters(items: T[], filters: Filter[]): T[] {
    return items.filter(item => {
      return filters.every(filter => {
        const itemValue = (item as any)[filter.campo];
        
        if (typeof itemValue === 'string' && typeof filter.valor === 'string') {
          return itemValue.toLowerCase().includes(filter.valor.toLowerCase());
        }
        
        return itemValue === filter.valor;
      });
    });
  }
  
  /**
   * Sort items by a field
   */
  protected sort(items: T[], field: string, direction: 'asc' | 'desc'): T[] {
    return [...items].sort((a, b) => {
      const valueA = (a as any)[field];
      const valueB = (b as any)[field];
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
} 