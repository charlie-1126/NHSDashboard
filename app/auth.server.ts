import { Authenticator } from 'remix-auth';
import { createCookieSessionStorage } from 'react-router';
import { db, userTable } from './db';
import { FormStrategy } from 'remix-auth-form';
import { and, eq } from 'drizzle-orm';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === 'production',
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
      .where(and(eq(userTable.id, id.toString()), eq(userTable.password, password.toString())))
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
