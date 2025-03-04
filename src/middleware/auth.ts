import type { APIRoute } from 'astro';
import { validateToken } from '../services/auth';

export const onRequest: APIRoute = async ({ request, redirect, cookies }) => {
  const userEmail = cookies.get('userEmail')?.value;

  if (!userEmail) {
    return redirect('/login');
  }

  const isValid = await validateToken();
  if (!isValid) {
    cookies.delete('userEmail');
    return redirect('/login');
  }

  return;
}; 