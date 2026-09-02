'use client';

import React from 'react';
import { ToastContainer } from '@/components/feedback/toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
