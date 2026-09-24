import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { QrCode, Prisma } from '@prisma/client';
import { CreateQrDto } from '../dto/create-qr.dto';
import { UpdateQrDto } from '../dto/update-qr.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class QrRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(
    workspaceId: string,
    userId: string,
    dto: CreateQrDto,
  ): Promise<QrCode & { destination: any }> {
    const shortCode = randomBytes(4).toString('hex'); // Simple 8-char hex code for now

    return this.database.qrCode.create({
      data: {
        workspaceId,
        createdBy: userId,
        name: dto.name,
        qrTypeId: dto.qrTypeId,
        isDynamic: dto.isDynamic ?? true,
        shortCode,
        status: 'ACTIVE',
        destination: {
          create: {
            targetUrl: dto.targetUrl,
          },
        },
      },
      include: {
        destination: true,
      },
    });
  }

  async findById(workspaceId: string, id: string): Promise<(QrCode & { destination: any }) | null> {
    return this.database.qrCode.findFirst({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
      include: {
        destination: true,
      },
    });
  }

  async findMany(workspaceId: string): Promise<(QrCode & { destination: any })[]> {
    return this.database.qrCode.findMany({
      where: {
        workspaceId,
        deletedAt: null,
      },
      include: {
        destination: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    workspaceId: string,
    id: string,
    dto: UpdateQrDto,
  ): Promise<(QrCode & { destination: any }) | null> {
    const data: Prisma.QrCodeUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.status !== undefined) data.status = dto.status;

    if (dto.targetUrl !== undefined) {
      data.destination = {
        update: {
          targetUrl: dto.targetUrl,
        },
      };
    }

    // Prisma update requires ID, but we also must enforce workspaceId to ensure tenant isolation.
    // However, Prisma's `update` only works on unique keys. 
    // We use `updateMany` to enforce the where clause and then return the fetched record.
    const result = await this.database.qrCode.updateMany({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
    });

    if (result.count === 0) {
      return null;
    }

    // Now update the destination if needed
    if (dto.targetUrl !== undefined) {
      // Find destination ID
      const dest = await this.database.qrDestination.findUnique({
        where: { qrId: id },
      });
      if (dest) {
        await this.database.qrDestination.update({
          where: { qrId: id },
          data: { targetUrl: dto.targetUrl },
        });
      }
    }

    return this.findById(workspaceId, id);
  }

  async softDelete(workspaceId: string, id: string): Promise<boolean> {
    const result = await this.database.qrCode.updateMany({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    });

    return result.count > 0;
  }
}
