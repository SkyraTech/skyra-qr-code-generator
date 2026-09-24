import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceContextGuard } from './guards/workspace-context.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceContextGuard],
  exports: [WorkspaceService, WorkspaceContextGuard],
})
export class WorkspaceModule {}
