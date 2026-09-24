'use client';

import * as React from 'react';
import { QrBuilderState } from './QrBuilder';
import { DynamicForm, FieldDef } from '@skyra/dynamic-form';

interface QrContentStepProps {
  state: QrBuilderState;
  updateContent: (contentUpdates: Record<string, any>) => void;
}

export function QrContentStep({ state, updateContent }: QrContentStepProps) {
  // Define fields based on QR Type
  const fields = React.useMemo(() => {
    const commonFields: FieldDef[] = [
      {
        name: 'name',
        label: 'QR Code Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Summer Campaign 2026',
        helpText: 'A friendly name to identify this QR code in your library.',
        full: true,
      },
    ];

    let specificFields: FieldDef[] = [];

    switch (state.qrTypeId) {
      case 'DYNAMIC_URL':
      case 'STATIC_URL':
        specificFields = [
          {
            name: 'targetUrl',
            label: 'Destination URL',
            type: 'url',
            required: true,
            placeholder: 'https://example.com',
            helpText: 'Where should this QR code redirect when scanned?',
            full: true,
          },
        ];
        break;
      
      case 'WIFI_ACCESS':
        specificFields = [
          {
            name: 'ssid',
            label: 'Network Name (SSID)',
            type: 'text',
            required: true,
            full: true,
          },
          {
            name: 'encryption',
            label: 'Encryption',
            type: 'select',
            required: true,
            defaultValue: 'WPA',
            options: [
              { label: 'WPA/WPA2/WPA3', value: 'WPA' },
              { label: 'WEP', value: 'WEP' },
              { label: 'None', value: 'nopass' },
            ],
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            visibleWhen: { field: 'encryption', notEquals: 'nopass' },
            full: true,
          },
          {
            name: 'hidden',
            label: 'Hidden Network',
            type: 'switch',
            defaultValue: false,
          }
        ];
        break;

      case 'STATIC_VCARD':
        specificFields = [
          { name: 'firstName', label: 'First Name', type: 'text', required: true },
          { name: 'lastName', label: 'Last Name', type: 'text', required: true },
          { name: 'organization', label: 'Organization/Company', type: 'text', full: true },
          { name: 'phone', label: 'Phone Number', type: 'tel' },
          { name: 'email', label: 'Email Address', type: 'email' },
          { name: 'website', label: 'Website', type: 'url', full: true },
        ];
        break;

      default:
        // Fallback for types we haven't explicitly mapped in Phase 2B yet
        specificFields = [
          {
            name: 'targetUrl',
            label: 'Destination',
            type: 'text',
            required: true,
            full: true,
          },
        ];
    }

    return [...commonFields, ...specificFields];
  }, [state.qrTypeId]);

  const handleChange = (newValues: Record<string, any>) => {
    // Determine how to compile the targetUrl for WiFi and vCard
    let finalTargetUrl = newValues.targetUrl || '';

    if (state.qrTypeId === 'WIFI_ACCESS') {
      const type = newValues.encryption || 'WPA';
      const ssid = newValues.ssid || '';
      const pass = newValues.password || '';
      const hidden = newValues.hidden ? 'true' : 'false';
      finalTargetUrl = `WIFI:T:${type};S:${ssid};P:${pass};H:${hidden};;`;
    } else if (state.qrTypeId === 'STATIC_VCARD') {
      finalTargetUrl = `BEGIN:VCARD\nVERSION:3.0\nN:${newValues.lastName || ''};${newValues.firstName || ''}\nFN:${newValues.firstName || ''} ${newValues.lastName || ''}\nORG:${newValues.organization || ''}\nTEL:${newValues.phone || ''}\nEMAIL:${newValues.email || ''}\nURL:${newValues.website || ''}\nEND:VCARD`;
    }

    updateContent({ ...newValues, targetUrl: finalTargetUrl });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight text-foreground">
          Configure Content
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter the information that will be encoded into your QR code.
        </p>
      </div>

      <div className="bg-card">
        <DynamicForm
          fields={fields}
          initialValues={state.content}
          onValuesChange={handleChange}
          onSubmit={() => {}}
        />
      </div>
    </div>
  );
}
