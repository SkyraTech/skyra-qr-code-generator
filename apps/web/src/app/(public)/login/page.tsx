'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/form-field';
import { QrCode, ArrowRight, Lock, Mail } from 'lucide-react';
import { PROJECT_CODENAME } from '@skyra/shared';
import { ROUTES } from '@/config/routes';

export default function LoginPage() {
  const [email, setEmail] = React.useState('operator@skyra.tech');
  const [password, setPassword] = React.useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 0C placeholder - navigation foundation only
    window.location.href = ROUTES.DASHBOARD;
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
              <FormField label="Work Email" required htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />
              </FormField>

              <FormField
                label="Password"
                required
                htmlFor="password"
                description={
                  <div className="flex justify-end pt-1">
                    <Link
                      href={ROUTES.FORGOT_PASSWORD}
                      className="text-primary hover:underline font-medium text-[11px]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                }
              >
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
              </FormField>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Continue to Dashboard
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Development Helper Notice */}
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-center text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Phase 0C Route Placeholder:</span>{' '}
          Authentication will be connected in Phase 2 via authoritative NestJS guards.
        </div>
      </div>
    </div>
  );
}
