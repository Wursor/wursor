import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SettingsScreen, type SettingsSection } from '../../../../src/settings/SettingsScreen.tsx';

export const metadata: Metadata = { title: 'Settings' };

const SECTIONS: readonly SettingsSection[] = ['workspace', 'safety', 'team', 'billing', 'notifications', 'account'];

export default async function SettingsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const found = SECTIONS.find((s) => s === section);
  if (!found) notFound();
  return <SettingsScreen section={found} />;
}
