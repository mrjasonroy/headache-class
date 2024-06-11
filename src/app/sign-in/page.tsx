import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HeadacheIcon } from '@/components/icons/headache';

export default async function SignIn({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();

  if (session) {
    redirect('/');
  }

  const csrfTokenCookie = `${
    process.env.NODE_ENV == 'production' ? '__Host-' : ''
  }next-auth.csrf-token`;
  const csrfToken = cookieStore.get(csrfTokenCookie)?.value.split('|')[0];

  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div className="justify-cente flex min-h-screen items-center">
        <Card className="mx-auto min-w-96 max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              <div className="flex items-center justify-start gap-4">
                <HeadacheIcon className="h-10 w-10 text-red-500" />
                <div className="align-middle">
                  <h2 className="text-xl font-bold">
                    Sign In to Access Jason&apos;s Headache Tracker
                  </h2>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Passcode</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter your passcode"
                />
                {searchParams?.error && (
                  <div className="text-sm text-red-500">Wrong Passcode</div>
                )}
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
