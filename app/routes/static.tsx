import { readFileSync, statSync } from 'node:fs';
import { normalize, sep, join } from 'node:path';
import type { Route } from './+types/static';

if (!import.meta.env.VITE_STATIC_FILE_PATH) {
  throw new Error('STATIC_FILE_PATH is not set');
}

function decode(str: string) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return -1;
  }
}

function containsDotFile(parts: string[]) {
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (part.length > 1 && part[0] === '.') {
      return true;
    }
  }
  return false;
}

/**
 * @see https://github.com/pillarjs/send/blob/master/index.js
 */
export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  if (!id || typeof id !== 'string') {
    return new Response('Not Found', { status: 404 });
  }

  let path = decode(id);

  if (typeof path === 'number') return new Response('Not Found', { status: 404 });

  if (~path.indexOf('\0')) return new Response('Bad Request', { status: 400 });

  path = normalize('.' + sep + path);

  if (/(?:^|[\\/])\.\.(?:[\\/]|$)/.test(path) || path.includes('..'))
    return new Response('Forbidden', { status: 404 });

  path = normalize(join(import.meta.env.VITE_STATIC_FILE_PATH!, path));

  if (containsDotFile(normalize(path).split(sep)))
    return new Response('Not Found', { status: 404 });

  if (path[path.length - 1] === sep) return new Response('Not Found', { status: 404 });

  try {
    const st = statSync(path);
    if (st.isDirectory()) return new Response('Not Found', { status: 404 });

    return new Response(readFileSync(path));
  } catch (e) {
    return new Response('Not Found', { status: 404 });
  }
}
