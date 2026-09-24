'use client';

import * as React from 'react';
import { Card, CardContent } from '@skyra/ui';
import { QrTypeStep } from './QrTypeStep';
import { QrContentStep } from './QrContentStep';
import { QrDesignStep } from './QrDesignStep';
import { QrReviewStep } from './QrReviewStep';
import { QrPreview } from './QrPreview';
import { QrBuilderNavigation } from './QrBuilderNavigation';
import { qrApiClient } from '@/services/api/qr';
import { useRouter } from 'next/navigation';

export type BuilderStep = 'TYPE' | 'CONTENT' | 'DESIGN' | 'REVIEW';

export interface QrBuilderState {
  currentStep: BuilderStep;
  qrTypeId: string | null;
  isDynamic: boolean;
  content: Record<string, any>;
  design: {
    fgColor: string;
    bgColor: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    margin: number;
    scale: number;
  };
}

const initialState: QrBuilderState = {
  currentStep: 'TYPE',
  qrTypeId: null,
  isDynamic: true,
  content: {
    name: '',
    targetUrl: '',
  },
  design: {
    fgColor: '#000000',
    bgColor: '#ffffff',
    errorCorrectionLevel: 'M',
    margin: 4,
    scale: 4,
  },
};

export function QrBuilder() {
  const [state, setState] = React.useState<QrBuilderState>(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const updateState = (updates: Partial<QrBuilderState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateContent = (contentUpdates: Record<string, any>) => {
    setState((prev) => ({ ...prev, content: { ...prev.content, ...contentUpdates } }));
  };

  const updateDesign = (designUpdates: Partial<QrBuilderState['design']>) => {
    setState((prev) => ({ ...prev, design: { ...prev.design, ...designUpdates } }));
  };

  const handleNext = () => {
    const steps: BuilderStep[] = ['TYPE', 'CONTENT', 'DESIGN', 'REVIEW'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      updateState({ currentStep: steps[currentIndex + 1] });
    }
  };

  const handleBack = () => {
    const steps: BuilderStep[] = ['TYPE', 'CONTENT', 'DESIGN', 'REVIEW'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      updateState({ currentStep: steps[currentIndex - 1] });
    } else {
      router.push('/qr-codes');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!state.qrTypeId) throw new Error('No QR Type selected');
      if (!state.content.name) throw new Error('QR name is required');
      if (!state.content.targetUrl) throw new Error('Target URL is required');

      await qrApiClient.createQrCode({
        name: state.content.name,
        qrTypeId: state.qrTypeId,
        isDynamic: state.isDynamic,
        targetUrl: state.content.targetUrl,
      });

      alert('QR Code created successfully!');
      router.push('/qr-codes');
    } catch (err: any) {
      alert(err.message || 'Failed to create QR code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg border border-border">
      <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden">
        {/* Left Side: Builder Form */}
        <div className="flex-1 flex flex-col h-full border-r border-border bg-card overflow-y-auto">
          <div className="flex-1 p-6">
            {state.currentStep === 'TYPE' && (
              <QrTypeStep state={state} updateState={updateState} />
            )}
            {state.currentStep === 'CONTENT' && (
              <QrContentStep state={state} updateContent={updateContent} />
            )}
            {state.currentStep === 'DESIGN' && (
              <QrDesignStep state={state} updateDesign={updateDesign} />
            )}
            {state.currentStep === 'REVIEW' && (
              <QrReviewStep state={state} />
            )}
          </div>
          <QrBuilderNavigation
            currentStep={state.currentStep}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isNextDisabled={state.currentStep === 'TYPE' && !state.qrTypeId}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Side: Live Preview */}
        <div className="w-full md:w-[400px] lg:w-[500px] bg-muted flex items-center justify-center p-8 shrink-0">
          <QrPreview state={state} />
        </div>
      </div>
    </Card>
  );
}
