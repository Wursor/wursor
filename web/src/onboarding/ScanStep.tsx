'use client';

import { useEffect, useState } from 'react';
import { Message } from '../product/Message.tsx';
import { StepGroup } from '../product/StepGroup.tsx';
import { StepLine } from '../product/StepLine.tsx';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { AccessRow } from './AccessRow.tsx';
import { ScanFinding } from './ScanFinding.tsx';
import { FINDINGS, FINISHED, type Finding, type ScanAccess } from './scan-data.ts';
import { WizardFooter } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

type Props = {
  access: ScanAccess;
  siteName?: string;
  /** Time between one finding finishing and the next, in ms. */
  stepMs?: number;
  onContinue: () => void;
  onBack?: (() => void) | undefined;
  onSaveAndExit?: (() => void) | undefined;
};

function DoneLine({ done }: { done: Finding['done'] }) {
  if (done.kind === 'group') {
    return (
      <StepGroup title={done.title} count={done.count}>
        {done.steps.map((s) => (
          <StepLine key={s} kind="look" time="">
            {s}
          </StepLine>
        ))}
      </StepGroup>
    );
  }
  return (
    <StepLine kind={done.icon} time={done.time}>
      {done.text}
    </StepLine>
  );
}

/** Section 5: the first read-only scan, watched live, then what Wursor found (Figma 5a, 5b, 5c). */
export function ScanStep({ access, siteName = 'Harbor Bakery', stepMs = 2000, onContinue, onBack, onSaveAndExit }: Props) {
  const findings = FINDINGS[access];
  const [done, setDone] = useState(0);
  const finished = done >= findings.length;
  const fin = FINISHED[access];

  useEffect(() => {
    if (finished) return;
    const id = setTimeout(() => setDone((n) => n + 1), stepMs);
    return () => clearTimeout(id);
  }, [done, finished, stepMs]);

  const visible = findings.slice(0, finished ? findings.length : done + 1);
  const heading = finished ? 'Here is what I know about your site' : 'Wursor is taking a look';
  const sub = !finished
    ? 'A read-only first scan. Nothing on your site is changed, and you can watch every step.'
    : access === 'content'
      ? 'I could read the pages and content. The theme and plugins are off limits on this plan.'
      : `${siteName} is healthy. I found three things worth fixing, and a safe copy is ready.`;

  return (
    <WizardShell step={7} label="What Wursor can do here" onSaveAndExit={onSaveAndExit} size="scan">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">{heading}</h1>
        <p className="t-body-l">{sub}</p>
      </div>
      {finished && <AccessRow access={access} />}
      <div className="ob-scan">
        <div className="ob-scan-findings">
          {finished && access === 'content' && (
            <Banner tone="warning">Your host allows Content only. I can read and change pages, posts and images, but not the theme or plugins.</Banner>
          )}
          {visible.map((f, i) => (
            <ScanFinding key={f.title} icon={f.icon} title={f.title} detail={f.detail} state={i >= done ? 'running' : f.attention && !(access === 'content' && f.title === 'Plugins') ? 'attention' : 'done'} value={f.value} />
          ))}
        </div>
        <div className="ob-scan-panel" role="region" aria-label="What Wursor is doing">
          <p className="ob-scan-panel-head t-label-m">
            <span className="ob-scan-dot" aria-hidden="true" />
            {finished ? fin.header : 'Live'}
          </p>
          <Message role="wursor">{finished ? fin.message : 'I’m reading your site the way a visitor would. I’ll tell you what I find.'}</Message>
          {finished
            ? fin.lines.map((l) => <DoneLine key={l.kind === 'group' ? l.title : l.text} done={l} />)
            : (
              <>
                {findings.slice(0, done).map((f) => <DoneLine key={f.title} done={f.done} />)}
                <StepLine kind="running" time="now">
                  {findings[done]?.running}
                </StepLine>
              </>
            )}
        </div>
      </div>
      <WizardFooter onBack={onBack}>
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" aria-disabled={!finished} onClick={() => finished && onContinue()}>
          {finished ? 'Pick a first change' : 'Looking…'}
          {finished && <Icon name="arrow-right" size={20} />}
        </button>
      </WizardFooter>
    </WizardShell>
  );
}
