export type QrStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface QrDomainEntity {
  id: string;
  workspaceId: string;
  qrTypeId: string;
  shortCode: string;
  name: string;
  isDynamic: boolean;
  status: QrStatus;
  createdAt: Date;
  updatedAt: Date;
  targetUrl?: string;
  // Potentially include styling and other references later
}
