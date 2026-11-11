# Portal beta readiness checklist

Use synthetic information only. This is an interface exercise: do not operate
equipment, open enclosures, change parameters or perform live tests to complete
it. Keep the current draft unpublished until the release gates below are met.

Serve locally with `python3 -m http.server 8899`. Start at
`http://localhost:8899/`; no build or account is required.

## Interface walkthrough

Run on a desktop browser and an actual phone. Record browser/device, date,
viewport, observed result and any defect. A narrow desktop window is useful
additional evidence, but is not an actual-phone result.

| Case | Action | Expected result |
| --- | --- | --- |
| Find a topic | From Home, open Tool Directory, search `pipe friction`, clear, then search an unmatched phrase. | One relevant pipe entry, complete reset, and a visible no-results message. Existing links remain keyboard-accessible. |
| Start with a symptom | Open the dashboard with an empty equipment profile. Choose a symptom and an existing-evidence answer. | Step 1 asks about the symptom, Step 2 asks for evidence, and neither requires a manufacturer. Unknown evidence exits explicitly. |
| Open the sample | Open `dashboard.html?technique=wont` without entering real site data. | Revision, Needs Technical Review, evidence limitations and unresolved flags are visible. No up-front manufacturer prompt or claim of approval. |
| Step 3 manufacturer detail | Follow a generic drive/flow result and review the optional Step 3 maps and their applicability, or use the playbook's separate manufacturer group. | Generic questions do not name a brand; each later map shows its exact platform scope and no brand is inferred automatically. |
| PPS Home commissioning | Open `dashboard.html?tool=ppscommissioning` with synthetic data. Select each panel/skid applicability value; try No for each and review the form's exception. Mark several statuses and fill a pump slot and reading. | Panel/skid checklists are gated independently; No skid still leaves the settings table. The 8 pump slots, measurement labels, duplicate `*` rows, photo groups, signature fields and notes are present. |
| PPS record backup | Export the PPS JSON record, reload, import it, then use a synthetic record to test Reset. | Values persist locally and round-trip through JSON. The export is separate from Notes; no photos or activation codes are stored. |
| Missing evidence | Choose the unknown-speed answer. Restart, choose known speed, then the unmatched/unknown-curve answer. | Both routes end at Insufficient Evidence, not an invented fault or pass. |
| Follow a decision | Restart and follow the stopped/speed-mismatch option, then a known-speed/high-flow option. | Electrical-work or model-limit flags appear at the affected step; assessments remain provisional. |
| Use a calculator | In Quick Field Calculator choose the PSI/head converter and enter `65` PSI. | `150.15` feet of water head; the UI still states this is not complete TDH. |
| Keep the evidence | Log a sample diagnostic result to Notes; insert a job card and add a synthetic reading. | Notes include technique ID/revision, status, safety, measurements, sources/missing-source disclosure, verification and unresolved flags. |
| Save and return | Save Notes on This Device, reload the same origin/browser, and revisit the technique. | Saved notes persist without changing the existing storage keys. No cross-device/cloud promise. |
| Export and import | Export .TXT; inspect its text. Clear only test notes, import that file, then save. | A text download with the expected content; import restores text to the editor and still requires explicit Save. It does not restore a drive configuration. |
| Leave unsaved work | Edit notes, then use a navigation link. Repeat with an edited, unsaved VFD worksheet. | Where supported, the browser warns about unsaved work. Cancel keeps the draft. Do not rely on this warning as a backup, especially on phones. |
| Accessibility | Tab through navigation and forms; use Skip to Content and dashboard High Contrast. | Visible focus, meaningful labels, readable controls and a visible active-navigation state. |
| Responsive use | Visit all portal pages and the sample's decision/result screens. | No horizontal page overflow or clipped primary controls; source/status text remains readable. |

## Contributor regression checks

- Run `node --test tests/*.test.cjs`.
- In an unpublished preview, verify a `draft` technique shows metadata but
  cannot run decision options.
- Verify a missing/invalid troubleshooting file produces a visible error,
  disables the playbook picker, and leaves calculators and saved notes usable.
- Verify invalid flag categories/targets and a `reviewed` technique with
  outstanding flags are rejected.
- Confirm each new technique is discovered from the content file without
  adding calculator or layout logic.

## Release gates

- [ ] Exact installed-equipment documentation and curve applicability verified.
- [ ] Sample technique's source coverage and all outstanding flags resolved
  through documented qualified technical review.
- [ ] Other included techniques reviewed, or withheld from field use as drafts
  until reviewed; do not treat a general disclaimer as technical approval.
- [ ] Actual-phone walkthrough completed, including file export/import,
  touch/keyboard behavior where applicable and browser-storage limitations.
- [x] Automated desktop smoke walkthrough and regression checks completed for
  this readiness revision; this is not human beta or technical sign-off.
- [ ] Owner approves the preview and explicitly authorizes publication.

Repeat the walkthrough after the symptom-first reorganization; the historical
results below apply to the earlier readiness revision, not to later UI changes.

No approval is implied by an automated check, a draft pull request or an
unchanged live site. Keep previous exports/parameter backups independently.

## Recorded interface evidence: 2026-11-10

Local Chromium walkthrough, with synthetic records only:

| Area | Observed result |
| --- | --- |
| Directory and navigation | Pipe/friction search, clear and no-results states behaved as expected. All five portal pages had an active navigation state and no page overflow at 1440px and 390px. |
| Sample technique | Both insufficient-evidence exits worked. Electrical and high-flow branches retained their review boundaries; the high-flow shortcut opened System Check. |
| Calculator | Entering 65 PSI produced 150.15 ft in the converter. |
| Notes | Logged revision, safety, missing-source disclosure, verification and unresolved flags; inserted a synthetic job card and saved. |
| Export/import | Used the actual browser download and file chooser. The downloaded .TXT reimported character-for-character (5,112 characters), requested Save, and persisted in a fresh page load after saving. |
| Unsaved navigation | Actual browser before-unload dialogs appeared for both edited notes and an edited VFD worksheet. Cancel retained the page/draft; the synthetic worksheet was then discarded through its confirmation. |
| Keyboard/contrast smoke checks | Skip link became visible on focus; Tab moved to the next header link with a visible outline. High Contrast changed its appearance/state. This was not a full accessibility audit. |
| Regression checks | All 108 dependency-free Node tests passed, including unknown-evidence routing, flag validation/rendering/export, graph integrity and existing calculator behavior. |

The 390px run was a narrow browser viewport, not a physical phone. Actual
handset file handling, touch behavior, browser-storage persistence and human
beta feedback are still pending. No equipment was operated and no technical
approval or successful manufacturer-source verification is claimed.

## Symptom-first routing smoke check: 2026-11-11

After the walkthrough feedback, the draft was reorganized so the dashboard
opens at a general symptom question, not an equipment profile or manufacturer
alarm menu. Local Chromium at 390px verified:

- The default dashboard enters triage directly; the equipment profile prompt is
  absent from that path. Equipment Details is later on the page.
- Each of the six symptom families opens a generic second evidence question
  with no Rain Bird / WeatherTRAK / Toro / Hunter selection. The "not sure"
  symptom and each second-step unknown answer end at **Insufficient Evidence**.
- The general VFD-trip question no longer starts with Rain Bird alarm names.
  Manufacturer references appear in a separate playbook group and in an
  optional Step 3 handoff after generic results. Each choice shows its exact
  platform scope and preserves the map's label and model caution.
- The PPS Home form companion is based on the owner-provided four-page QF-16.5
  Rev B screenshots. Validate with synthetic data only. It is not a physical
  commissioning test or official-form substitute.
- General triage, motor-stop, low-pressure, instability, flow/alarm,
  communications and mechanical symptom paths retain their existing
  manufacturer-specific procedures separately rather than merging their codes
  or limits.

This was a routing smoke check, not a full repeated export/import, physical
phone test, source verification or technical review. Re-run the remaining
interface checklist and the full automated test suite against the final
candidate before publication.
