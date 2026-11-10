# Maintaining troubleshooting techniques

The portal is a static site. Troubleshooting content lives in
`data/troubleshooting.js`; rendering and calculators remain in `dashboard.html`.
The data file assigns a structured library to `globalThis.TRACER_TROUBLESHOOTING`
and loads synchronously, like the existing catalog indexes. No API or build step
is needed to edit a technique.

The dashboard's Diagnostic Playbook dropdown is populated from the data file,
so adding a technique does not require adding a new page or editing calculator
logic. Use `dashboard.html?technique=<id>` to open a specific entry (including
draft metadata) for review. Existing symptom menus remain contextual shortcuts.

## Publishing cycle

1. Make content changes on a draft branch, not the live publishing branch.
2. Keep a new technique at `draft`. Preview its metadata on the draft branch;
   the dashboard deliberately does not run draft decision trees. Exercise the
   tree only in an unpublished preview after setting it to `needs-review`.
3. Use `needs-review` for provisional guidance being evaluated in a preview.
   The interface visibly labels this status; it is not technical approval.
4. Have a qualified technical reviewer check applicability, hazards, each
   decision/result, source editions/pages and measurable verification criteria.
   Record the review outcome in `review.note` and its actual date in
   `review.reviewedOn` before marking the technique `reviewed`.
5. Run `node --test tests/*.test.cjs`. Preview the affected paths in a browser,
   including cross-path choices, linked calculators, restart and Log to Notes.
6. Publish only after explicit approval of the preview and reviewable diff.
   Merging/publishing is separate from changing a technique's review status.

All migrated paths start at `needs-review`, with no recorded review date.
Preserving the existing guidance does not establish that it is verified.
Neither automated validation nor a green test run is a technical review.
Statuses and dates are contributor-maintained records, not an access-control
or approval system.

## Technique format

Keep stable technique identifiers (for example `hunt`) and node identifiers.
Existing topic menus, cross-technique links and notes refer to these identifiers.
Increase `revision` for changes to guidance, scope, sources or decisions.
Set a revised technique back to `needs-review` or `draft`; do not present new
content as covered by an earlier review. A previous review date may remain as
history if the review note explicitly says the current revision is not reviewed.

Each technique has:

| Field | Required content |
| --- | --- |
| `title`, `symptom` | A readable name and the observed condition or identification task. |
| `appliesTo` | Equipment families/configurations and exclusions or applicability checks. |
| `revision` | A positive integer identifying the content revision, not device firmware. |
| `review` | `status` (`draft`, `needs-review`, `reviewed`), actual `reviewedOn` date or `null`, and an explanatory `note`. |
| `reviewFlags` | Optional list of unresolved step-specific concerns: each needs `node`, `category` and `note`. Flags are not test instructions or technical approval. |
| `evidence` | `kind`, an honest provenance `note`, and a `sources` list. |
| `safetyPrerequisites` | Site authorization, test/isolation prerequisites and equipment-specific hazards. |
| `verification` | What must be measured and compared after the correction; use documented limits, not invented pass/fail tolerances. |
| `equipmentOptional` | Whether the identification/profile gate can be skipped automatically. This does not waive equipment identification or safety requirements. |
| `start`, `nodes` | A start-node key and a bounded decision tree containing questions, options and results. |

`evidence.kind` distinguishes `field-guidance`, `engineering-guidance` and
`manufacturer-backed`. A manufacturer name in a title or a search query is
not manufacturer backing. Use `manufacturer-backed` only with citations
supporting the actual path and its exact applicability, not merely a related
manual. Otherwise retain the appropriate guidance label and describe limits.

Each source needs `title`, `revision` and `locator` (page/section). An optional
`url` must be an absolute HTTP(S) address. Do not invent dates, revisions,
source URLs or citations. Keep `sources: []` and explain missing provenance
until verified. Do not redistribute catalog PDFs or copy restricted source text.

Question nodes use `question` and `options`, each with `label` and `next`.
`next` names a local node or `flow:<technique-id>` for another technique.
Result nodes use `result: true`, `domain`, `assessment`, `measurements`,
`search`, and optionally `tool` for an existing calculator or `vfdsetup`.
Search phrases are external lookup conveniences, not citations.
Assessments must remain hypotheses until confirmed by measurements.

### Step-specific review flags

Use the existing node key to attach a concern where it matters. Categories are
`energized-testing`, `operating-test`, `parameter-change`,
`model-specific-limit` and `source-verification`. The dashboard displays
applicable flags alongside that step, lists all flags in the technique details,
and preserves them in Log to Notes. A technique with outstanding flags cannot
validate with `review.status: "reviewed"`.

Resolve a flag only when its required source, safe procedure or reviewer
decision is documented. Clearing the array alone is not evidence of approval.
Retain the disposition in the review note and version-control diff, increase
the content revision, and obtain the qualified review described above.

## Readiness example: pump pressure

The `wont` technique is the first editorial readiness example, not an approved
technical reference. Revision 2:

- Narrows applicability to a centrifugal-water-pump screen with the actual
  speed/impeller curve. Other pump arrangements need their type-specific path.
- Separates pump differential total head from discharge gauge pressure, with
  inlet pressure and instrument/elevation context for booster installations.
- Adds explicit insufficient-evidence exits instead of forcing an electrical,
  suction or mechanical classification. Current or lack of noise alone does
  not establish pump health.
- Replaces a loosely qualified shutoff-test suggestion with a clear boundary:
  no deadhead test, mode change, restart or intrusive inspection is authorized
  by the guide. Such work needs a separate approved procedure.
- Removes the generic 150 PSI single-stage/multistage rule as a decision basis.
- Requires comparable before/after evidence and documented equipment limits,
  not a generic green result.

**Source-verification blocker:** On 2026-11-10, both the existing PPS
manufacturer manuals page and its linked Master O&M PDF failed DNS retrieval;
an alternate direct retrieval also failed. No source text, edition/page
coverage or installed-model applicability was verified. The existing links
remain literature starting points, not citations supporting this path.
`evidence.sources` therefore remains empty, the evidence kind remains
`field-guidance`, and `reviewedOn` remains `null`.

The broader wording scan recorded step-specific flags for energized work,
manual/operating tests, parameter/recovery changes and unsupported
model-dependent limits. In particular, legacy deadhead comparisons, generic
intake submergence/clearance ratios and platform parameter/reset references
are not approved procedures or limits. These flags are an unresolved-review
queue, not a claim that the rest of each legacy technique is technically
verified.

Use the [beta checklist](beta-checklist.md) for a no-equipment interface pass.
Qualified technical/source review and an actual-handset check remain separate
release gates; browser simulation cannot approve a field technique.

Example shape for a new draft (adapt the safety, applicability and verification
to the actual technique; this is not approved field guidance):

```js
"example_readings": {
  "title": "Collect comparable readings",
  "symptom": "The reported condition has not been measured.",
  "appliesTo": ["Exact equipment and operating conditions must be documented."],
  "revision": 1,
  "review": {
    "status": "draft",
    "reviewedOn": null,
    "note": "Authoring example only; technical review pending."
  },
  "evidence": {
    "kind": "field-guidance",
    "note": "No verified source has been attached.",
    "sources": []
  },
  "safetyPrerequisites": [
    "Follow site authorization and the applicable equipment procedure.",
    "Use qualified personnel for any energized or operating measurement."
  ],
  "verification": [
    "Record units, instrument and operating state with each reading.",
    "Compare only equivalent conditions against the applicable documented limit."
  ],
  "equipmentOptional": false,
  "start": "a",
  "nodes": {
    "a": {
      "question": "Are comparable readings available?",
      "options": [
        {"label": "Not yet", "next": "record"}
      ]
    },
    "record": {
      "result": true,
      "domain": "MEASUREMENT",
      "assessment": "The cause remains unknown until evidence is collected.",
      "measurements": ["Record the observed condition and measurement context."],
      "search": "equipment manufacturer measurement procedure"
    }
  }
}
```

## Validation and failure behavior

`assets/troubleshooting.js` validates required metadata, supported statuses,
review dates, citation fields, safe source URLs, node targets, tool links,
review-flag targets/categories, reachability and cycles. It does not interpret manufacturer documentation or
approve a diagnostic claim. A missing or malformed content/validation file
shows a visible error and blocks diagnostics, while leaving calculators and
saved notes available. Fix the file rather than substituting a silent default.

The result screen and Log to Notes preserve the technique identifier/revision,
review and evidence status, decision path, measurements, sources, safety
prerequisites and verification criteria. Notes still require explicit saving
and exporting; this is not a structured technique editor or a drive backup.
