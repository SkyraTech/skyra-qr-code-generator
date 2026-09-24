'use client';

import * as React from 'react';
import { Button } from '@skyra/ui';
import { BuilderStep } from './QrBuilder';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface QrBuilderNavigationProps {
  currentStep: BuilderStep;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
}

export function QrBuilderNavigation({
  currentStep,
  onNext,
  onBack,
  onSubmit,
  isNextDisabled,
  isSubmitting,
}: QrBuilderNavigationProps) {
  const steps: BuilderStep[] = ['TYPE', 'CONTENT', 'DESIGN', 'REVIEW'];
  const currentIndex = steps.indexOf(currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  return (
    <div className="border-t border-border p-4 bg-background flex items-center justify-between shrink-0 z-10">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isSubmitting}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      >
        {isFirst ? 'Cancel' : 'Back'}
      </Button>

      <div className="flex gap-2">
        {steps.map((step, idx) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-8 bg-primary'
                : idx < currentIndex
                ? 'w-4 bg-primary/40'
                : 'w-4 bg-muted'
            }`}
          />
        ))}
      </div>

      {isLast ? (
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting || isNextDisabled}
          leftIcon={isSubmitting ? undefined : <Check className="w-4 h-4" />}
          isLoading={isSubmitting}
        >
          Create QR Code
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Continue
        </Button>
      )}
    </div>
  );
}
