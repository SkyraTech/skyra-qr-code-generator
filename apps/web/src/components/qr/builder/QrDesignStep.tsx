'use client';

import * as React from 'react';
import { QrBuilderState } from './QrBuilder';
import { DynamicForm, FieldDef } from '@skyra/dynamic-form';

interface QrDesignStepProps {
  state: QrBuilderState;
  updateDesign: (designUpdates: Partial<QrBuilderState['design']>) => void;
}

const designFields: FieldDef[] = [
  {
    name: 'fgColor',
    label: 'Foreground Color',
    type: 'text', // using text type for color hex code since color picker might not be standard in basic dynamic form, but we can assume string
    defaultValue: '#000000',
    helpText: 'The color of the QR code dots. Use dark colors for better scannability.',
  },
  {
    name: 'bgColor',
    label: 'Background Color',
    type: 'text',
    defaultValue: '#ffffff',
    helpText: 'The background color behind the QR code.',
  },
  {
    name: 'errorCorrectionLevel',
    label: 'Error Correction Level',
    type: 'select',
    defaultValue: 'M',
    options: [
      { value: 'L', label: 'Low (7%)', description: 'Best for simple URLs' },
      { value: 'M', label: 'Medium (15%)', description: 'Standard level' },
      { value: 'Q', label: 'Quartile (25%)', description: 'Good for adding small logos' },
      { value: 'H', label: 'High (30%)', description: 'Best for complex designs and logos' },
    ],
    helpText: 'Higher levels make the QR code denser but more resilient to damage.',
    full: true,
  },
  {
    name: 'margin',
    label: 'Quiet Zone (Margin)',
    type: 'number',
    min: 0,
    max: 10,
    defaultValue: 4,
    helpText: 'The blank space around the QR code required for scannability.',
  },
  {
    name: 'scale',
    label: 'Resolution Scale',
    type: 'number',
    min: 1,
    max: 10,
    defaultValue: 4,
    helpText: 'The multiplier for the base QR matrix resolution.',
  },
];

export function QrDesignStep({ state, updateDesign }: QrDesignStepProps) {
  const handleChange = (newValues: Record<string, any>) => {
    updateDesign(newValues as Partial<QrBuilderState['design']>);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight text-foreground">
          Design Configuration
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Customize the appearance of your QR code while preserving scannability.
        </p>
      </div>

      <div className="bg-card">
        <DynamicForm
          fields={designFields}
          initialValues={state.design}
          onValuesChange={handleChange}
          onSubmit={() => {}}
        />
      </div>
    </div>
  );
}
