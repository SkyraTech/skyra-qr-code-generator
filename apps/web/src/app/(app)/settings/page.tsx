import { redirect } from 'next/navigation';
import { ROUTES } from '@/config/routes';

export default function SettingsRootPage() {
  redirect(ROUTES.SETTINGS.PROFILE);
}
