import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import MainPage from "../src/pages/index.astro"; // Ajusta la ruta si es necesario


test("Renderiza la página principal con todos los componentes esperados", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(MainPage);
  
  // Verificar que el componente SearchSection está presente
  expect(result).toContain('Encontrar electivas nunca fue tan fácil');
  
  // Verificar que los tabs están presentes
  expect(result).toContain('id="default-styled-tab"');
  expect(result).toContain('Electivas');
  expect(result).toContain('Coursera');
  expect(result).toContain('Grupos');
  
  // Verificar que todas las secciones de contenido de tabs existen
  expect(result).toContain('id="styled-sia"');
  expect(result).toContain('id="styled-coursera"');
  expect(result).toContain('id="styled-settings"');
  expect(result).toContain('id="styled-clubs"');
});

test("Verifica la estructura general del Layout", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(MainPage);
  
  // Verificar que el Layout está siendo utilizado
  expect(result).toContain('<html');
  expect(result).toContain('</html>');
  
  // Si el Layout incluye navbar, podemos verificarlo
  expect(result).toContain('LearnHub');
});

test("Verifica que las secciones específicas están renderizadas", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(MainPage);
  
  // Verificar componentes específicos
  expect(result).toContain('SIASection');
  expect(result).toContain('CourseraSection');
  expect(result).toContain('ClubsSection');
});
