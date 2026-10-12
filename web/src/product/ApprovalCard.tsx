import { ApprovalBar } from './ApprovalBar.tsx';
import { CheckEvent } from './CheckEvent.tsx';
import { CompareSlider } from './CompareSlider.tsx';
import { Zoom } from '../ui/Zoom.tsx';
import { SiteMock } from './SiteMock.tsx';

/** Compare slider, the checks and the approval bar together: what the owner sees before anything goes live. */
export function ApprovalCard() {
  return (
    <div className="p-approvalcard">
      <Zoom ratio={448 / 760}>
        <div className="p-approvalcard-compare">
          <CompareSlider before={<SiteMock state="before" />} after={<SiteMock state="after" />} />
        </div>
      </Zoom>
      <CheckEvent result="passed" title="Checked 9 things. All passed." detail="Phone link works, 3 screen sizes, no new errors, speed unchanged." />
      <ApprovalBar title="Ready for you" meta="2 changes · Everyday risk" />
    </div>
  );
}
