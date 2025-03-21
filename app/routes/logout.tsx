import { sessionStorage } from '~/auth.server';
import type { Route } from './+types/logout';
import { redirect } from 'react-router';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (!user) return redirect('/login');

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}
