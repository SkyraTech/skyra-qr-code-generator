import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WorkspaceContext } from '../types/workspace-context';

export const CurrentWorkspace = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): WorkspaceContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.workspace;
  },
);
