# 21. Keep the "never sees a diff" rule in AGENTS.md as written

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

AGENTS.md hard rule 3 says the user never sees a diff, a terminal, a settings screen or an error log. PRD Headless revision 4 keeps technical detail (diffs, hashes, logs, traces) one tap away in an expandable section for owners who want it (section 16, RV-01). IMPLEMENTATION section 0.2 asked whether the rule's wording should change.

## Decision

Leave rule 3 as it is. It describes the default experience and the test for any change: if a change would put engineer-only UI in front of a non-technical owner by default, it is wrong. The optional, collapsed technical detail in the PRD is read as consistent with that default.

### Options considered

- **Leave the wording (chosen).**
- Reword to "by default" and mention the expandable detail. Not chosen.

## Consequences

- AGENTS.md rule 3 is unchanged.
- Reviewers apply the rule to the default view. The expandable technical section must never be the only way to complete a task, and must be collapsed unless the person opens it.
