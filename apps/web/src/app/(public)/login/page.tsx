'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@skyra/ui';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { QrCode, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { PROJECT_CODENAME } from '@skyra/shared';
import { ROUTES } from '@/config/routes';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push(ROUTES.DASHBOARD);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <QrCode className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">
              {PROJECT_CODENAME}
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your enterprise credentials to access your workspace.
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-lg border-border">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="p-3 text-sm rounded-md bg-[var(--skyra-danger)]/10 text-[var(--skyra-danger)] flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leadingIcon={<Mail className="h-4 w-4" />}
                  required
                  label="Work Email"
                  disabled={loading}
                />

              <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  leadingIcon={<Lock className="h-4 w-4" />} 
                  required 
                  label="Password" 
                  disabled={loading}
                  description={
                    <div className="flex justify-end pt-1">
                      <Link href={ROUTES.FORGOT_PASSWORD} className="text-[var(--skyra-primary)] hover:underline font-medium text-[11px]">
                        Forgot password?
                      </Link>
                    </div>
                  } 
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full" rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined} isLoading={loading}>
                {loading ? 'Signing in...' : 'Continue to Dashboard'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href={ROUTES.REGISTER} className="text-[var(--skyra-primary)] hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
