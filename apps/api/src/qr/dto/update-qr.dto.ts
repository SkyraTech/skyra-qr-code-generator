import { IsString, IsOptional, MaxLength, IsUrl, IsIn } from 'class-validator';
import { QrStatus } from '../types/qr-domain.types';

export class UpdateQrDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'PAUSED', 'ARCHIVED'])
  status?: QrStatus;

  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @IsOptional()
  targetUrl?: string;
}
