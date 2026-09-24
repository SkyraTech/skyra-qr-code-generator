import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';
import { PublicQrController } from './public-qr.controller';
import { QrRepository } from './repositories/qr.repository';
import { DatabaseModule } from '../database/database.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AuthorizationModule } from '../authz/authz.module';

@Module({
  imports: [DatabaseModule, WorkspaceModule, AuthorizationModule],
  controllers: [QrController, PublicQrController],
  providers: [QrService, QrRepository],
})
export class QrModule {}
