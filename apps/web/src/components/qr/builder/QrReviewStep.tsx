'use client';

import * as React from 'react';
import { QrBuilderState } from './QrBuilder';
import { Badge } from '@skyra/ui';

interface QrReviewStepProps {
  state: QrBuilderState;
}

export function QrReviewStep({ state }: QrReviewStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight text-foreground">
          Review & Publish
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Please review your configuration before creating the QR code.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
            General Information
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd className="font-medium text-foreground">{state.content.name || 'Unnamed QR Code'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">QR Type</dt>
              <dd className="font-medium text-foreground">{state.qrTypeId}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Mode</dt>
              <dd>
                {state.isDynamic ? (
                  <Badge variant="primary">Dynamic</Badge>
                ) : (
                  <Badge variant="neutral">Static</Badge>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Destination Payload</dt>
              <dd className="font-mono-data text-xs text-foreground bg-background border border-border rounded p-2 mt-1 break-all">
                {state.content.targetUrl || 'No destination specified'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
            Design Preferences
          </h3>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <dt className="text-xs text-muted-foreground">Foreground</dt>
              <dd className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: state.design.fgColor }} />
                <span className="font-mono-data text-xs">{state.design.fgColor}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Background</dt>
              <dd className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: state.design.bgColor }} />
                <span className="font-mono-data text-xs">{state.design.bgColor}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Correction</dt>
              <dd className="font-medium text-sm mt-1">{state.design.errorCorrectionLevel}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Margin</dt>
              <dd className="font-medium text-sm mt-1">{state.design.margin} modules</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
