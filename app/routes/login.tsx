import type { Route } from './+types/login';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Link, redirect, useFetcher } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { authenticator, sessionStorage } from '~/auth.server';

export function meta() {
  return [{ title: 'login - NHS Dashboard' }];
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const user = await authenticator.authenticate('form', request);
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    session.set('user', user.uuid);
    return redirect('/LNFMS', {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      typeof error.message === 'string' &&
      error.message.startsWith('{')
    ) {
      return JSON.parse(error.message);
    }
  }

  return redirect('/login');
}

export default function LoginPage() {
  const fetcher = useFetcher();

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className={cn('flex flex-col gap-6')}>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Login</CardTitle>
              <CardDescription>Enter your id below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <fetcher.Form method='post'>
                <div className='flex flex-col gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='id'>Id</Label>
                    {fetcher.data?.errors?.id && (
                      <div className='text-[13px] text-red-500'>{fetcher.data.errors.id}</div>
                    )}
                    <Input name='id' type='id' placeholder='admin' required />
                  </div>
                  <div className='grid gap-3'>
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                      <Popover>
                        <PopoverTrigger className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                          Forgot your password?
                        </PopoverTrigger>
                        <PopoverContent className='w-auto text-sm'>
                          Please contact to 이예찬
                        </PopoverContent>
                      </Popover>
                    </div>
                    {fetcher.data?.errors?.password && (
                      <div className='text-[13px] text-red-500'>{fetcher.data.errors.password}</div>
                    )}
                    <Input name='password' type='password' required />
                  </div>
                  <div className='flex flex-col gap-3'>
                    <Button type='submit' className='w-full' disabled={fetcher.state !== 'idle'}>
                      <LoaderCircle
                        className={fetcher.state !== 'idle' ? 'animate-spin' : 'hidden'}
                      />
                      {fetcher.state !== 'idle' ? 'Logging in' : 'Login'}
                    </Button>
                    <div className='text-center text-sm'>
                      Don't have an account?{' '}
                      <Link to='/signup' className='underline underline-offset-4'>
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
