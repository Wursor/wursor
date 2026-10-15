import { BoardCard } from './BoardCard.tsx';
import { Counter } from './Counter.tsx';
import type { BoardLaneData } from './harbor-bakery.ts';

/** The board as a strip under the preview: four lanes, each with its count. The header count is what is not done yet. */
export function BoardStrip({ lanes }: { lanes: readonly BoardLaneData[] }) {
  const open = lanes.filter((l) => l.status !== 'done').reduce((n, l) => n + l.cards.length, 0);
  return (
    <section aria-label="Board" className="p-board">
      <div className="p-board-header">
        <h3 className="p-board-title">Board</h3>
        <Counter count={open} />
        <span className="p-spacer" />
        <span className="p-board-link">Open board</span>
      </div>
      <div className="p-lanes">
        {lanes.map((lane) => (
          <div key={lane.status} role="group" aria-label={lane.title} className="p-lane">
            <div className="p-lane-header">
              <span>{lane.title}</span>
              <Counter count={lane.cards.length} />
            </div>
            {lane.cards.map((c) => (
              <BoardCard key={c.title} {...c} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
