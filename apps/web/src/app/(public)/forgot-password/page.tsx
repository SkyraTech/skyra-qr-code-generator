'use client';
import { Card, CardContent, CardFooter, Button, Input } from '@skyra/ui';
import * as React from 'react';
import Link from 'next/link';



import { QrCode, Mail, ArrowLeft } from 'lucide-react';
import { PROJECT_CODENAME } from '@skyra/shared';
import { ROUTES } from '@/config/routes';
import { toast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: 'Password Reset Requested',
      description: 'If an account exists for that email, recovery instructions have been sent.',
      variant: 'info',
    });
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
            Reset your password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your email and we will send you a secure verification link.
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-lg border-border">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  leadingIcon={<Mail className="h-4 w-4" />}
                  required
                
                  label="Registered Email"
                />
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full">
                {submitted ? 'Resend Reset Link' : 'Send Reset Link'}
              </Button>
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to sign in</span>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
