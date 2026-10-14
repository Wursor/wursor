import { ChangeEvent } from '../product/ChangeEvent.tsx';
import { CheckEvent } from '../product/CheckEvent.tsx';
import type { Density } from '../product/ConversationPanel.tsx';
import { Message } from '../product/Message.tsx';
import { Milestone } from '../product/Milestone.tsx';
import { StepGroup } from '../product/StepGroup.tsx';
import { StepLine } from '../product/StepLine.tsx';
import { HarborStream } from '../product/HarborStream.tsx';
import { CaptureEvent } from './CaptureEvent.tsx';
import { DecisionCard } from './DecisionCard.tsx';
import { PlanCard } from './PlanCard.tsx';
import { DECISION, PLAN_STEPS, USER_REQUEST, type Phase } from './scenario.ts';

type Props = {
  phase: Phase;
  density: Density;
  /** True once the owner has answered the question, so the stream says what was chosen. */
  answer?: string | undefined;
  onStart?: () => void;
  onEditPlan?: () => void;
  onAnswer?: (option: string) => void;
  onSeeChanges?: () => void;
};

const CHANGE = { title: 'Changed the Contact page', meta: '1 section · 2 places', risk: 'everyday', added: 8, removed: 2 } as const;
const CHECK = { title: 'Checked 9 things. All passed.', detail: 'Phone link works, 3 screen sizes, no new errors, speed unchanged.' } as const;

/** The conversation for a change, in each phase of its life and at each level of detail. */
export function Stream({ phase, density, answer, onStart, onEditPlan, onAnswer, onSeeChanges }: Props) {
  const steps = density !== 'headline';
  const everything = density === 'everything';

  if (phase === 'plan') {
    return (
      <>
        <Message role="user">{USER_REQUEST}</Message>
        <Message role="wursor">
          Two places show your phone number as plain text: the Contact page and the footer. Here is my plan. Nothing goes live until you approve.
        </Message>
        <Milestone kind="plan">Plan ready</Milestone>
        <PlanCard steps={PLAN_STEPS} meta="About 3 minutes · Easy to undo" onStart={onStart} onEdit={onEditPlan} />
      </>
    );
  }

  if (phase === 'working') return <HarborStream density={density} />;

  if (phase === 'needs-you') {
    return (
      <>
        <Message role="user">{USER_REQUEST}</Message>
        {steps && (
          <StepGroup title="Looked at 4 pages" count={4}>
            <StepLine kind="look" time="1s">Looked at the home page</StepLine>
          </StepGroup>
        )}
        {steps && <StepLine kind="edit" time="4s">Made the Contact page number a tap-to-call link</StepLine>}
        <Milestone kind="needs-you">Needs you</Milestone>
        <DecisionCard question={DECISION.question} options={DECISION.options} onAnswer={onAnswer} />
      </>
    );
  }

  // ready, publishing and published share the review: what changed, the photo, the checks.
  const review = (
    <>
      {steps && (
        <StepGroup title="Looked at 4 pages" count={4}>
          <StepLine kind="look" time="1s">Looked at the home page</StepLine>
        </StepGroup>
      )}
      {steps && <ChangeEvent {...CHANGE} onSeeChanges={onSeeChanges} />}
      {steps && <StepLine kind="check" time="5s">Checked the link opens the dialler</StepLine>}
      {steps && <CaptureEvent when="after" caption="Contact page on a phone" />}
      <CheckEvent result="passed" {...CHECK} />
      <Milestone kind="ready">Ready for you</Milestone>
      <Message role="wursor">All done and checked. Have a look, then approve when you’re happy.</Message>
    </>
  );

  if (phase === 'ready') {
    return (
      <>
        {answer && everything && <Message role="user">{answer}</Message>}
        {review}
      </>
    );
  }

  if (phase === 'publishing') {
    return (
      <>
        <CheckEvent result="passed" {...CHECK} />
        <Milestone kind="ready">Ready for you</Milestone>
        <Message role="wursor">All done and checked. Have a look, then approve when you’re happy.</Message>
        <Message role="user">Approve and publish</Message>
        <Message role="wursor">Approved. I’ll take a safe copy of your site first, then publish.</Message>
        {steps && <StepLine kind="capture" time="6s">Took a safe copy of your site</StepLine>}
        <StepLine kind="running" time="now">Publishing to harborbakery.com</StepLine>
      </>
    );
  }

  return (
    <>
      <Message role="user">Approve and publish</Message>
      {steps && <StepLine kind="capture" time="6s">Took a safe copy of your site</StepLine>}
      {steps && <StepLine kind="edit" time="9s">Published to harborbakery.com</StepLine>}
      <Milestone kind="published">Published</Milestone>
      <Message role="wursor">It’s live. I’ll watch for errors for 30 minutes and tell you if anything looks wrong.</Message>
      <StepLine kind="running" time="now">Watching harborbakery.com for errors</StepLine>
    </>
  );
}
