export type Manifest = Record<string, string>;

export type ManifestDiff = {
  added: string[];
  changed: string[];
  removed: string[];
};

export function diffManifest(before: Manifest, after: Manifest): ManifestDiff {
  const added = Object.keys(after).filter((path) => !(path in before));
  const removed = Object.keys(before).filter((path) => !(path in after));
  const changed = Object.keys(after).filter((path) => path in before && before[path] !== after[path]);
  return { added, changed, removed };
}
