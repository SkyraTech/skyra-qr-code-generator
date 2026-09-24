'use client';

import * as React from 'react';
import { QrBuilderState } from './QrBuilder';
import { QRCode } from '@skyra/qr';

interface QrPreviewProps {
  state: QrBuilderState;
}

export function QrPreview({ state }: QrPreviewProps) {
  // We use the configured targetUrl as payload. If it's missing, use a fallback payload
  // so the QR doesn't just render empty while typing.
  const payload = state.content.targetUrl || 'https://skyra.tech';

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
        <QRCode
          value={payload}
          errorCorrectionLevel={state.design.errorCorrectionLevel}
          margin={state.design.margin}
          scale={state.design.scale}
          color={{
            dark: state.design.fgColor,
            light: state.design.bgColor,
          }}
        />
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-sm text-foreground">Live Preview</p>
        <p className="text-xs text-muted-foreground">Changes update automatically</p>
      </div>
    </div>
  );
}
