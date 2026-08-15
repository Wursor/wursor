import type { Playbook, SiteExport, SubsetRequest, SubsetResult } from './types.ts';

const PLAYBOOK_TABLES: Record<Playbook, Set<string>> = {
  content: new Set(['wp_posts', 'wp_postmeta', 'wp_options']),
  design: new Set(['wp_posts', 'wp_postmeta', 'wp_options', 'wp_terms', 'wp_term_taxonomy', 'wp_term_relationships']),
  plugin: new Set(['wp_options']),
};

const secret = /(_key|_secret|smtp_pass)$/;

export function exportDbSubset(dump: SiteExport, request: SubsetRequest): SubsetResult {
  const wanted = PLAYBOOK_TABLES[request.playbook];
  const tables = Object.keys(dump.tables).filter((name) => wanted.has(name));
  const options = (dump.tables.wp_options ?? [])
    .map((row) => String(row.option_name ?? ''))
    .filter((name) => name !== '' && !secret.test(name));

  return { tables, options };
}
