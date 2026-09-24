import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from './types/authenticated-user';

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
