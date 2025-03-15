import type { Route } from './+types/home';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Link, redirect, useActionData, useFetcher } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Signin - NHS Dashboard' }];
}

export async function action({ request }: Route.ActionArgs) {
  const data = await request.formData();

  console.log(data);

  return { ok: true };
}

export default function SignIn() {
  const fetcher = useFetcher();
  const data = useActionData();

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
              <fetcher.Form method='POST'>
                <div className='flex flex-col gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='id'>Id</Label>
                    <Input id='id' type='id' placeholder='admin' required />
                  </div>
                  <div className='grid gap-3'>
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                      <Popover>
                        <PopoverTrigger className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                          Forgot your password?
                        </PopoverTrigger>
                        <PopoverContent className='w-auto text-sm'>
                          Please contact to 땡땡땡
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Input id='password' type='password' required />
                  </div>
                  <div className='flex flex-col gap-3'>
                    <Button type='submit' className='w-full' disabled={fetcher.state !== 'idle'}>
                      Login
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
