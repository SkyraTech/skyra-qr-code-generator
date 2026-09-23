'use client';

import * as React from 'react';
import { QRCode } from '@skyra/qr';

export interface QRPreviewProps {
  /** The destination/payload encoded in the QR code */
  payload: string;
  /** Optional class name for the wrapper element */
  className?: string;
}

/**
 * Domain-level QR Preview component for SkyraQR.
 * 
 * Responsibilities:
 * - Provides consistent styling, border, and contrast wrapper for QR codes.
 * - Enforces minimum contrast for scannability in dark mode by using a light background.
 * - Delegates actual QR encoding and SVG generation to `@skyra/qr`.
 */
export function QRPreview({ payload, className }: QRPreviewProps) {
  return (
    <div 
      className={`p-2 bg-white rounded-xl border border-border shadow-sm inline-flex justify-center items-center ${className || ''}`}
    >
      <QRCode
        value={payload}
        errorCorrectionLevel="M"
        margin={2}
        scale={4}
        aria-label={`QR Code resolving to ${payload}`}
        color={{ dark: '#000000', light: '#ffffff' }}
        className="w-full h-auto"
      />
    </div>
  );
}
