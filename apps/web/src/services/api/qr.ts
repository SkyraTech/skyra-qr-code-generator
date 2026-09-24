import { apiClient } from './client';

export interface CreateQrCodeDto {
  name: string;
  qrTypeId: string;
  isDynamic: boolean;
  targetUrl?: string;
  design?: any;
}

export const qrApiClient = {
  createQrCode: (data: CreateQrCodeDto) => {
    return apiClient.post('/api/v1/qr-codes', data);
  },
  getQrCodes: () => {
    return apiClient.get('/api/v1/qr-codes');
  },
  getQrCode: (id: string) => {
    return apiClient.get(`/api/v1/qr-codes/${id}`);
  },
  updateQrCode: (id: string, data: Partial<CreateQrCodeDto>) => {
    return apiClient.patch(`/api/v1/qr-codes/${id}`, data);
  },
  deleteQrCode: (id: string) => {
    return apiClient.delete(`/api/v1/qr-codes/${id}`);
  },
};
