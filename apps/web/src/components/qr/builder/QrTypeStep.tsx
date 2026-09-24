'use client';

import * as React from 'react';
import { Card, CardContent } from '@skyra/ui';
import { QrBuilderState } from './QrBuilder';
import { Link, Wifi, Contact, Globe } from 'lucide-react';

interface QrTypeStepProps {
  state: QrBuilderState;
  updateState: (updates: Partial<QrBuilderState>) => void;
}

const SUPPORTED_TYPES = [
  {
    id: 'DYNAMIC_URL',
    label: 'Website URL',
    description: 'Dynamic link to any website. You can change the destination later.',
    icon: <Globe className="w-6 h-6" />,
    isDynamic: true,
  },
  {
    id: 'STATIC_URL',
    label: 'Static URL',
    description: 'Permanent link to a website. Cannot be changed after creation.',
    icon: <Link className="w-6 h-6" />,
    isDynamic: false,
  },
  {
    id: 'STATIC_VCARD',
    label: 'vCard',
    description: 'Share contact information instantly.',
    icon: <Contact className="w-6 h-6" />,
    isDynamic: false,
  },
  {
    id: 'WIFI_ACCESS',
    label: 'Wi-Fi Network',
    description: 'Allow guests to connect to Wi-Fi by scanning.',
    icon: <Wifi className="w-6 h-6" />,
    isDynamic: false,
  },
];

export function QrTypeStep({ state, updateState }: QrTypeStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight text-foreground">
          Select QR Code Type
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Choose the kind of content you want to share with this QR code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPORTED_TYPES.map((type) => {
          const isSelected = state.qrTypeId === type.id;
          return (
            <Card
              key={type.id}
              onClick={() => updateState({ qrTypeId: type.id, isDynamic: type.isDynamic })}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-primary border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
            >
              <CardContent className="p-4 flex flex-col h-full gap-3">
                <div className={`p-3 rounded-lg w-fit ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  {type.icon}
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {type.label}
                    {type.isDynamic && (
                      <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                        Dynamic
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {type.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
