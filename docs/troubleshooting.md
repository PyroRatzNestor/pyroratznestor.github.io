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
reachability and cycles. It does not interpret manufacturer documentation or
approve a diagnostic claim. A missing or malformed content/validation file
shows a visible error and blocks diagnostics, while leaving calculators and
saved notes available. Fix the file rather than substituting a silent default.

The result screen and Log to Notes preserve the technique identifier/revision,
review and evidence status, decision path, measurements, sources, safety
prerequisites and verification criteria. Notes still require explicit saving
and exporting; this is not a structured technique editor or a drive backup.
