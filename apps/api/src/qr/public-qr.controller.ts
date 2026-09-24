import { Controller, Get, Param } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('public/qr-codes')
export class PublicQrController {
  constructor(private readonly qrService: QrService) {}

  @Get(':shortCode')
  async resolvePublicQR(@Param('shortCode') shortCode: string) {
    const result = await this.qrService.resolvePublicQR(shortCode);
    return { data: result };
  }
}
