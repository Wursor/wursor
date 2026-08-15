import { describe, it, expect } from 'vitest';
import { ALLOWED_TOOL_NAMES, generateToolSchemas } from '../../src/agents/tool-schemas.ts';

describe('generateToolSchemas', () => {
  it('returns a non-empty tool set', () => {
    expect(generateToolSchemas().length).toBeGreaterThan(0);
  });

  it('only exposes allowlisted semantic tools', () => {
    const names = generateToolSchemas().map((s) => s.function.name);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(ALLOWED_TOOL_NAMES).toContain(name);
    }
  });

  it('exposes no eval, config, raw SQL, rm, or arbitrary plugin install surface', () => {
    const blob = generateToolSchemas()
      .map((s) => JSON.stringify(s))
      .join(' ');
    expect(blob).not.toMatch(/wp eval|wp config|DROP TABLE|DELETE FROM|\brm\b|plugin install http/i);
  });
});
