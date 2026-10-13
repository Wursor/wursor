import type { Metadata } from 'next';
import { WorkspaceScreen } from '../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Name your workspace' };

export default function WorkspacePage() {
  return <WorkspaceScreen />;
}
