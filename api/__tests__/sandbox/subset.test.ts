import { describe, it, expect } from 'vitest';
import { exportDbSubset } from '../../src/sandbox/subset.ts';
import type { SiteExport } from '../../src/sandbox/types.ts';

const dump = (): SiteExport => ({
  origin: 'https://example.com',
  tables: {
    wp_posts: [{ ID: 1, post_title: 'Home' }],
    wp_postmeta: [{ post_id: 1, meta_key: '_edit_lock', meta_value: '1' }],
    wp_options: [
      { option_name: 'blogname', option_value: 'Biz' },
      { option_name: 'woocommerce_stripe_secret_key', option_value: 'sk_live_xxx' },
      { option_name: 'smtp_pass', option_value: 'secret' },
    ],
    wp_terms: [{ term_id: 1, name: 'Menu' }],
    wp_term_taxonomy: [{ term_taxonomy_id: 1 }],
    wp_term_relationships: [{ object_id: 1 }],
    wp_wc_orders: [{ id: 99, total: '40.00' }],
    wp_comments: [{ comment_ID: 1, comment_content: 'hi' }],
  },
  uploads: [],
});

describe('exportDbSubset', () => {
  it('keeps posts, postmeta, and options for a content playbook', () => {
    expect(exportDbSubset(dump(), { playbook: 'content', postIds: [1] }).tables).toEqual(
      expect.arrayContaining(['wp_posts', 'wp_postmeta', 'wp_options']),
    );
  });

  it('drops Woo orders and comments from a content-edit slice', () => {
    const tables = exportDbSubset(dump(), { playbook: 'content', postIds: [1] }).tables;
    expect(tables).not.toContain('wp_wc_orders');
    expect(tables).not.toContain('wp_comments');
  });

  it('adds taxonomy tables for a design playbook', () => {
    const tables = exportDbSubset(dump(), { playbook: 'design', postIds: [1] }).tables;
    expect(tables).toEqual(expect.arrayContaining(['wp_terms', 'wp_term_taxonomy', 'wp_term_relationships']));
  });

  it('limits a plugin playbook to options only', () => {
    expect(exportDbSubset(dump(), { playbook: 'plugin', postIds: [1] }).tables).toEqual(['wp_options']);
  });

  it('redacts option names ending in _key, _secret, or smtp_pass', () => {
    const options = exportDbSubset(dump(), { playbook: 'content', postIds: [1] }).options;
    expect(options).toContain('blogname');
    expect(options.some((name) => /(_key|_secret|smtp_pass)$/.test(name))).toBe(false);
  });
});
