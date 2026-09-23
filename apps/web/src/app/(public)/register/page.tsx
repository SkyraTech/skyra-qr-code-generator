'use client';
import { Card, CardContent, CardFooter, Button, Input } from '@skyra/ui';
import * as React from 'react';
import Link from 'next/link';



import { FormField } from '@/components/forms/form-field';
import { QrCode, ArrowRight, Lock, Mail, Building, User } from 'lucide-react';
import { PROJECT_CODENAME } from '@skyra/shared';
import { ROUTES } from '@/config/routes';

export default function RegisterPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            Create your workspace
          </h1>
          <p className="text-xs text-muted-foreground">
            Start dynamic QR code campaigns with sub-30ms edge redirects.
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-lg border-border">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <FormField label="Full Name" required htmlFor="name">
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  leadingIcon={<User className="h-4 w-4" />}
                  required
                />
              </FormField>

              <FormField label="Company / Workspace Name" required htmlFor="company">
                <Input
                  id="company"
                  placeholder="Acme International"
                  leadingIcon={<Building className="h-4 w-4" />}
                  required
                />
              </FormField>

              <FormField label="Work Email" required htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@acme.com"
                  leadingIcon={<Mail className="h-4 w-4" />}
                  required
                />
              </FormField>

              <FormField label="Password" required htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 12 characters"
                  leadingIcon={<Lock className="h-4 w-4" />}
                  required
                />
              </FormField>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Create Account & Workspace
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
