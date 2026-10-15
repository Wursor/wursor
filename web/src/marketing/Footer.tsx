import Link from 'next/link';
import { FOOTER_COLUMNS, TAGLINE } from './content.ts';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="t-title-m">Wursor</p>
          <p className="t-body-m footer-muted">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer" className="footer-columns">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="footer-column">
              <h2 className="t-label-m">{col.heading}</h2>
              <ul>
                {col.items.map((item) => (
                  <li key={item.label} className="t-body-m footer-muted">
                    {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="footer-bottom t-label-s">
        <span className="footer-status">
          <span className="dot" aria-hidden="true" /> All systems normal
        </span>
        <span className="footer-spacer" />
        <span className="footer-muted">English</span>
        <span className="footer-faint">© 2026 Wursor</span>
      </div>
    </footer>
  );
}
