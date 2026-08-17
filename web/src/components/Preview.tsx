import type { ChatStatus } from '../hooks/useChat.ts';

type PreviewProps = {
  heading: string;
  status: ChatStatus;
  applied: boolean;
};

export function Preview({ heading, status, applied }: PreviewProps) {
  return (
    <main className="preview">
      <div className="browser">
        <div className="browser-bar">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span className="browser-url">preview.wursor.dev</span>
          {applied && <span className="preview-badge">Applied to your site ✓</span>}
        </div>
        <div className="browser-body">
          {status === 'working' ? (
            <div className="preview-working">Applying your change…</div>
          ) : (
            <div className="mock-site">
              <nav className="mock-nav">
                <span className="mock-brand">Your Site</span>
                <span>About</span>
                <span>Contact</span>
              </nav>
              <div className="mock-hero">
                <h1 className="wursor-preview-frame">{heading}</h1>
                <p>This is a live preview of your sandbox — the real site stays untouched until you approve.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
