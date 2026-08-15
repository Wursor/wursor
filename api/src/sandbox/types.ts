export type Playbook = 'content' | 'design' | 'plugin';

export type SiteExport = {
  origin: string;
  tables: Record<string, Array<Record<string, string | number>>>;
  uploads: { path: string; bytes: number }[];
};

export type SubsetRequest = {
  playbook: Playbook;
  postIds: number[];
};

export type SubsetResult = {
  tables: string[];
  options: string[];
};
