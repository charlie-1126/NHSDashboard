import type { Route } from './+types/home';
import { LoginForm } from '~/components/login-form';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Login - NHS Dashboard' }];
}

export default function Page() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
