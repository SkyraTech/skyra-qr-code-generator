import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { QrService } from './qr.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { WorkspaceContextGuard } from '../workspace/guards/workspace-context.guard';
import { PermissionGuard } from '../authz/guards/permission.guard';
import { RequirePermission } from '../authz/decorators/require-permission.decorator';
import { AuthorizationContext } from '../authz/types/authorization-context';

@Controller('qr-codes')
@UseGuards(SupabaseAuthGuard, WorkspaceContextGuard, PermissionGuard)
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post()
  @RequirePermission('qr:create')
  create(@Req() req: FastifyRequest, @Body() createQrDto: CreateQrDto) {
    const workspaceContext = req['workspace'] as AuthorizationContext;
    const user = req['user'] as { id: string };
    
    return this.qrService.create(workspaceContext.workspaceId, user.id, createQrDto);
  }

  @Get()
  @RequirePermission('qr:read')
  findAll(@Req() req: FastifyRequest) {
    const workspaceContext = req['workspace'] as AuthorizationContext;
    return this.qrService.findAll(workspaceContext.workspaceId);
  }

  @Get(':id')
  @RequirePermission('qr:read')
  findOne(@Req() req: FastifyRequest, @Param('id') id: string) {
    const workspaceContext = req['workspace'] as AuthorizationContext;
    return this.qrService.findOne(workspaceContext.workspaceId, id);
  }

  @Patch(':id')
  @RequirePermission('qr:update')
  update(
    @Req() req: FastifyRequest,
    @Param('id') id: string,
    @Body() updateQrDto: UpdateQrDto,
  ) {
    const workspaceContext = req['workspace'] as AuthorizationContext;
    return this.qrService.update(workspaceContext.workspaceId, id, updateQrDto);
  }

  @Delete(':id')
  @RequirePermission('qr:delete')
  remove(@Req() req: FastifyRequest, @Param('id') id: string) {
    const workspaceContext = req['workspace'] as AuthorizationContext;
    return this.qrService.remove(workspaceContext.workspaceId, id);
  }

  @Get(':id/matrix')
  @RequirePermission('qr:read')
  async getMatrix(@Req() req: FastifyRequest, @Param('id') id: string) {
    const workspaceContext = req['workspace'] as AuthorizationContext;
    let appDomainUrl = process.env.QR_PUBLIC_BASE_URL || 'http://localhost:3000';
    // Remove trailing slash if present
    if (appDomainUrl.endsWith('/')) {
      appDomainUrl = appDomainUrl.slice(0, -1);
    }
    return this.qrService.generateMatrix(workspaceContext.workspaceId, id, appDomainUrl);
  }
}
