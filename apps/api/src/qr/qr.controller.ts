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
    // Base URL would typically come from configuration/environment variables
    // Hardcoding for now since we just need to satisfy the foundation layer
    const appDomainUrl = 'https://skyra.qr';
    return this.qrService.generateMatrix(workspaceContext.workspaceId, id, appDomainUrl);
  }
}
