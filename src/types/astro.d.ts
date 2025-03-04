declare module 'astro' {
  interface AstroGlobal {
    cookies: {
      get(name: string): { value: string } | undefined;
      delete(name: string): void;
    };
  }

  export interface APIRoute {
    request: Request;
    redirect: (path: string) => Response;
    cookies: {
      get(name: string): { value: string } | undefined;
      delete(name: string): void;
    };
  }
} 