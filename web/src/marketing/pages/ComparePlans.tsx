import { COMPARE_ROWS, PLANS } from '../content.ts';
import { SectionHeader } from '../home/SectionHeader.tsx';

/** Plans side by side. Shown only once pricing is decided (PRD D-HL-8, PX-13). */
export function ComparePlans() {
  return (
    <section className="m-grid-section">
      <SectionHeader eyebrow="Compare plans" title="Everything, side by side." />
      <div className="m-compare">
        <table aria-label="Compare plans">
          <thead>
            <tr>
              <th scope="col" className="t-label-m">
                <span className="sr-only">Feature</span>
              </th>
              {PLANS.map((p) => (
                <th key={p.name} scope="col" className="t-label-m">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="t-body-m">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className="t-body-m">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
