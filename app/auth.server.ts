import { Authenticator } from 'remix-auth';
import { createCookieSessionStorage } from 'react-router';
import { db, userTable } from './db';
import { FormStrategy } from 'remix-auth-form';
import { and, eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';

if (!import.meta.env.VITE_SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set');
}

function sha512(str: string) {
  return createHash('sha512').update(str).digest('hex');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
    secrets: [import.meta.env.VITE_SESSION_SECRET!],
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
});

export const authenticator = new Authenticator<typeof userTable.$inferSelect>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    if (!form) {
      throw new Error();
    }

    const id = form.get('id');
    const password = form.get('password');

    if (!id) {
      throw new Error(JSON.stringify({ ok: false, errors: { id: 'ID is required' } }));
    }

    if (!password) {
      throw new Error(JSON.stringify({ ok: false, errors: { password: 'Password is required' } }));
    }

    const user = await db
      .select()
      .from(userTable)
      .where(
        and(eq(userTable.id, id.toString()), eq(userTable.password, sha512(password.toString()))),
      )
      .limit(1);

    if (user.length !== 1) {
      throw new Error(
        JSON.stringify({
          ok: false,
          errors: { id: 'Invalid ID or password', password: 'Invalid ID or password' },
        }),
      );
    }

    return user[0];
  }),
  'form',
);
