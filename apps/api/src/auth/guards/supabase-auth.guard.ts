import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FastifyRequest } from 'fastify';
import { AuthenticatedUser } from '../types/authenticated-user';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);
  private supabase: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {
    this.initSupabaseClient();
  }

  private initSupabaseClient(): SupabaseClient | null {
    if (this.supabase) {
      return this.supabase;
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logger.warn(
        'Supabase URL or Anon Key is missing from environment. Authentication requests will fail until configured.',
      );
      return null;
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return this.supabase;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing or invalid authentication token');
    }

    const supabase = this.supabase ?? this.initSupabaseClient();

    if (!supabase) {
      this.logger.error('Authentication attempt failed: Supabase client is not configured');
      throw new UnauthorizedException('Authentication service is currently unavailable');
    }

    try {
      // Validate the token against Supabase Auth
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedException('Invalid or expired authentication token');
      }

      // Map Supabase user to strictly typed AuthenticatedUser
      const user: AuthenticatedUser = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        app_metadata: data.user.app_metadata,
        user_metadata: data.user.user_metadata,
      };

      // Attach the verified identity to the request
      request['user'] = user;

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      this.logger.error('Unexpected error during token verification');
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token && token.trim().length > 0 ? token.trim() : undefined;
  }
}
