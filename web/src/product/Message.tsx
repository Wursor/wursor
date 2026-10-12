import type { ReactNode } from 'react';
import { Avatar } from './Avatar.tsx';

/** A message in the conversation. The owner's sit in a soft box; Wursor's are plain text beside its avatar. */
export function Message({ role, children }: { role: 'user' | 'wursor'; children: ReactNode }) {
  if (role === 'user') {
    return (
      <div className="p-message p-message-user">
        <p>{children}</p>
      </div>
    );
  }
  return (
    <div className="p-message p-message-wursor">
      <Avatar kind="wursor" />
      <p>{children}</p>
    </div>
  );
}
