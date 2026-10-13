export type LookId = 'warm' | 'clean' | 'bold';

export const LOOKS: ReadonlyArray<{ id: LookId; title: string; description: string; headline: string }> = [
  { id: 'warm', title: 'Warm and local', description: 'Peach tones, big friendly headline, photos first.', headline: 'Bread baked at dawn.' },
  { id: 'clean', title: 'Clean and calm', description: 'Lots of white space and quiet type.', headline: 'Fresh bread, daily.' },
  { id: 'bold', title: 'Bold and modern', description: 'Dark header, strong contrast, large buttons.', headline: 'Baked fresh. Every morning.' },
];

/**
 * A miniature of the homepage in one look, drawn at 288 x 180 like the Figma "Direction Card" preview.
 * Each look keeps its own colours in both themes: it is a picture of a site, not part of the app.
 */
export function LookPreview({ look }: { look: LookId }) {
  const l = LOOKS.find((x) => x.id === look)!;
  return (
    <div className="ob-look" data-look={look} aria-hidden="true">
      <div className="ob-look-nav">
        <span className="ob-look-brand">Harbor Bakery</span>
        <span className="ob-look-spacer" />
        <span>Menu</span>
        <span>Visit</span>
        <span>About</span>
      </div>
      <p className="ob-look-headline">{l.headline}</p>
      <p className="ob-look-address">Quay Street, open from 7 am.</p>
      <span className="ob-look-button">See the menu</span>
      <span className="ob-look-image" />
    </div>
  );
}
