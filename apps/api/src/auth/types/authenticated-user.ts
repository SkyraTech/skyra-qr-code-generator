export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
}
