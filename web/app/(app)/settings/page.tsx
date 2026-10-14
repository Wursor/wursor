import type { Metadata } from 'next';
import { SettingsScreen } from '../../../src/settings/SettingsScreen.tsx';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return <SettingsScreen section="workspace" />;
}
