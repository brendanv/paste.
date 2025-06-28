import { handle as authHandle } from './auth';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

async function authorization({ event, resolve }) {
  const { url } = event;

  // Protect all routes under /manage and the root route
  if (url.pathname.startsWith('/manage') || url.pathname === '/') {
    const session = await event.locals.auth();
    if (!session) {
      throw redirect(302, '/welcome');
    }
  }

  // If the request is still here, just proceed as normal
  return resolve(event);
}

export const handle = sequence(authHandle, authorization);