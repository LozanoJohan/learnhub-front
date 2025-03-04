export * from './types';
export * from './baseService';
export * from './siaService';
export * from './courseraService';
export * from './clubsService';

// Also export a unified services API
import { siaService } from './siaService';
import { courseraService } from './courseraService';
import { clubsService } from './clubsService';

export const services = {
  sia: siaService,
  coursera: courseraService,
  clubs: clubsService
}; 