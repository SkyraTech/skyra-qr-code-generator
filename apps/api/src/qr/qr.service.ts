import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { QrRepository } from './repositories/qr.repository';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
import { generateQRCode } from '@skyra/qr/src/generate';

@Injectable()
export class QrService {
  constructor(private readonly qrRepository: QrRepository) {}

  async create(workspaceId: string, userId: string, dto: CreateQrDto) {
    if (!dto.isDynamic && !dto.targetUrl) {
      throw new BadRequestException('Static QR codes require a target URL/payload.');
    }
    
    // Minimal validation of QR Type could be added here based on actual db constraints
    return this.qrRepository.create(workspaceId, userId, dto);
  }

  async findAll(workspaceId: string) {
    return this.qrRepository.findMany(workspaceId);
  }

  async findOne(workspaceId: string, id: string) {
    const qr = await this.qrRepository.findById(workspaceId, id);
    if (!qr) {
      throw new NotFoundException('QR Code not found in the current workspace.');
    }
    return qr;
  }

  async update(workspaceId: string, id: string, dto: UpdateQrDto) {
    const qr = await this.qrRepository.update(workspaceId, id, dto);
    if (!qr) {
      throw new NotFoundException('QR Code not found or could not be updated.');
    }
    return qr;
  }

  async remove(workspaceId: string, id: string) {
    const success = await this.qrRepository.softDelete(workspaceId, id);
    if (!success) {
      throw new NotFoundException('QR Code not found or already deleted.');
    }
    return { success: true };
  }

  /**
   * Generates the physical QR Code matrix for rendering by consuming @skyra/qr
   */
  async generateMatrix(workspaceId: string, id: string, appDomainUrl: string) {
    const qr = await this.findOne(workspaceId, id);
    
    let payload = qr.destination?.targetUrl || '';
    if (qr.isDynamic) {
      // Dynamic QRs route through the platform's short link
      payload = `${appDomainUrl}/r/${qr.shortCode}`;
    }

    if (!payload) {
      throw new BadRequestException('QR Code has no payload to render.');
    }

    // Rely on @skyra/qr for the technical matrix generation
    return generateQRCode(payload, { errorCorrectionLevel: 'M' });
  }
}
