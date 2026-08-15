# 17. The agent is given a semantic, allowlisted tool schema — not a raw wp_cli surface

- **Status:** Accepted
- **Date:** 2026-08-15

## Context

IMPLEMENTATION's Sprint 3 sketch exposed a single `wp_cli` tool and tested that `wp eval` / `wp config` / `DROP TABLE` / `wp plugin install http` never appear in the schema. The product is a general-purpose coding agent ("type anything, the agent does it"), which needs richer tools, and the safety guarantee is better served by *not exposing* a raw shell-like surface at all.

## Decision

The agent's tool schema is a set of **semantic, allowlisted tools** — `read_page`, `update_post`, `update_option`, `create_page`, `update_theme_json` — each mapping to a constrained WordPress operation. There is no `wp_cli`, `eval`, `config`, or raw SQL tool.

### Options considered

- Raw `wp_cli` tool with a deny-list of subcommands.
- Semantic allowlisted tools (chosen).

### Rejected

- Raw `wp_cli` — a deny-list is fail-open by nature; a new dangerous subcommand is one miss away. An allowlist of semantic tools is fail-closed.

## Consequences

- `api/src/agents/tool-schemas.ts` is the single allowlist; new capability is a new semantic tool with its own executor mapping, reviewed on its own.
- This is the tool surface the real-WP spike (`e2e/agent/`) exercises.
