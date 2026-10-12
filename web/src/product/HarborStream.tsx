import { ChangeEvent } from './ChangeEvent.tsx';
import type { Density } from './ConversationPanel.tsx';
import { Message } from './Message.tsx';
import { Milestone } from './Milestone.tsx';
import { StepGroup } from './StepGroup.tsx';
import { StepLine } from './StepLine.tsx';
import { Thought } from './Thought.tsx';

const REASONING =
  'The number is plain text on the Contact page and again in the footer. On a phone it needs to be a tel: link, and the tap target should be at least 44 px tall. I’ll check the header too, because it repeats the number.';

const CHANGE = { title: 'Changed the Contact page', meta: '1 section · 2 places', risk: 'everyday', added: 8, removed: 2 } as const;

/** The example conversation for a Harbor Bakery change, at each detail level. */
export function HarborStream({ density }: { density: Density }) {
  if (density === 'headline') {
    return (
      <>
        <Message role="user">Make the phone number tappable on mobile, and the same in the footer.</Message>
        <Message role="wursor">
          Two places show your phone number as plain text: the Contact page and the footer. Here is my plan. Nothing goes live until you approve.
        </Message>
        <Milestone>Plan ready</Milestone>
        <Message role="wursor">I’ve changed the Contact page and the footer, and I’m checking them on a phone now.</Message>
      </>
    );
  }
  if (density === 'steps') {
    return (
      <>
        <Message role="user">Make the phone number tappable on mobile, and the same in the footer.</Message>
        <Message role="wursor">On it. I’ll show you each step as I go.</Message>
        <StepGroup title="Looked at 4 pages" count={4}>
          <StepLine kind="look" time="1s">Looked at the home page</StepLine>
        </StepGroup>
        <Thought seconds={6}>{REASONING}</Thought>
        <StepLine kind="edit" time="4s">Made the Contact page number a tap-to-call link</StepLine>
        <ChangeEvent {...CHANGE} />
        <StepLine kind="edit" time="3s">Did the same in the footer</StepLine>
        <StepLine kind="running" time="now">Taking a photo of the page on a phone</StepLine>
      </>
    );
  }
  return (
    <>
      <Message role="wursor">On it. I’ll show you each step as I go.</Message>
      <Thought seconds={6} defaultExpanded>{REASONING}</Thought>
      <StepLine kind="look" time="1s">Looked at home page</StepLine>
      <StepLine kind="look" time="1s">Looked at contact page</StepLine>
      <StepLine kind="look" time="1s">Looked at footer</StepLine>
      <StepLine kind="search" time="2s">Searched your pages for the phone number</StepLine>
      <StepLine kind="edit" time="4s">Made the Contact page number a tap-to-call link</StepLine>
      <ChangeEvent {...CHANGE} />
      <StepLine kind="edit" time="3s">Did the same in the footer</StepLine>
      <StepLine kind="running" time="now">Taking a photo of the page on a phone</StepLine>
    </>
  );
}
