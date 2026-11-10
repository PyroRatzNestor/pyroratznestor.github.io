# pyroratznestor.github.io

Static technician field portal. Serve the repository with
`python3 -m http.server 8899`, then open `http://localhost:8899/`.
No build step, dependencies, accounts or backend are required.

## Portal structure

- `index.html`: landing page and field-playbook introduction.
- `dashboard.html`: the existing field workspace, calculators, diagnostic paths,
  equipment profiles, references, training links and notes.
- `tools.html`: searchable common starting points, with links to the complete
  calculator dropdown and troubleshooting menus.
- `references.html`: library entry points, source policy and limitations.
- `help.html`: quick start, local-storage/backups, safety and feedback.
- `assets/portal.css`: shared portal styling, navigation and responsive layout.
- `assets/directory.js`: client-side filtering of the tool directory.
- `data/troubleshooting.js`: diagnostic questions, decisions and result guidance,
  kept separate from dashboard rendering and calculators.

Navigation uses relative URLs and works on GitHub Pages without server rewrites.
Keep all pages, `assets/` and `data/` together when publishing. Open the dashboard
directly at `dashboard.html`; `dashboard.html?tool=pipe` and similar entry links
open an existing calculator/reference in the Field Bench. Unknown tool keys
show a message instead of opening an unintended view.

The move from `index.html` to `dashboard.html` does not change browser-storage
keys. Existing data remains available on the same origin, browser and device.
Save notes and drive worksheets before leaving the dashboard. Unsaved note or
worksheet changes request a browser navigation warning; this is not a backup.
Directory search filters local links, while dashboard web search opens Google.
Offline installation/caching and cross-device sync are not included.

Regression suites read the application from `dashboard.html`. Run all suites
with `node --test tests/*.test.cjs`.

The dashboard uses black and forest-green surfaces with neon-green accents;
amber and red remain reserved for warnings and errors. **High Contrast** switches
to black, white and brighter accents and remembers the selection on this device.

The Pumps/Hydraulics, VFD/Controls and Irrigation Control troubleshooting cards
use topic dropdowns. Choose a topic and press **Open selection** to launch the
same calculator, diagnostic path, reference or web search. Selection alone does
not navigate, so keyboard users can browse options without opening a topic.

**Quick Field Calculator** is the central dropdown for every calculator,
including those linked from troubleshooting, decoder and landscape references.
It retains the original two-way PSI/feet-of-water converter and adds TDH,
hydraulics, electrical, wiring, precipitation and source-specific lookups.
Calculators run inside this card with saved inputs and **Add result to notes**;
the same tools remain available from their contextual troubleshooting links.
The quick card and Field Bench can show the same calculator without conflicting
controls. PSI-to-head conversion is not itself a complete TDH calculation.

## Commissioned drive setup & PID troubleshooting

The **VFD / Controls** menu and **Drive setup / PID** Field Bench tab open a
read-only functional checklist and per-asset worksheet. The existing
pressure-hunting path links to the same guide. It is not a calculator, a drive
connection, an automatic tuner or an uploadable parameter file.

Separate profiles cover ABB ACQ580, ABB ACS550-01/U1, Mitsubishi FR-F800-E,
Mitsubishi FR-D700, Pentair Pentek Intellidrive, Schneider ATV320 and Schneider
ATV630/ATV600, plus a generic other-model checklist.
The exact model/variant, firmware, control owner, pump/motor data, commissioning
vendor/date, manual revision and backup location are recorded per asset.
Do not substitute ACS580 for ACQ580, FR-E800 for FR-F800-E, another Altivar
series for ATV600, or transfer PID values between Intellidrive and industrial drives.

Symptom selections cover no wake, no sleep, short cycling, pressure hunting,
slow recovery, overshoot and repeated fault/restart. Each starts with evidence,
control ownership and hydraulic/sensor checks, then highlights relevant
functional sections without hiding the other records. The sections cover
feedback scaling, reference sources, action direction, P/I/D definitions,
filtering, speed limits, ramps, sleep/wake/boost and fault/protection logic.

Each function keeps the **commissioned baseline**, **observed current setting**,
**documented factory default (reference only)**, units/definition,
parameter/menu and source revision/page separate. Blank means unknown.
Comparison is text-only; it does not convert units, infer equivalent tuning
values or diagnose a fault. Factory defaults are never recommended replacements
for vendor-commissioned settings.

The ABB ACQ580 profile includes a separate, read-only cross-reference for
selected PID, feedback, sleep/wake, limits and fault functions, based on the
uploaded **ACQ580 pump control program firmware manual 3AXD50000035867,
Rev C (2017-06-21), program 2.03.0.0**, with printed page citations. Verify the
installed program version and active PID set before using it. Other firmware
revisions may differ.
The guide flags ambiguities in the source rather than resolving them by guess.
Manual ranges and defaults are references, not commissioned values or tuning
recommendations; the cross-reference never populates or changes worksheet fields.
The separate ACS550-01/U1 profile uses the uploaded **ACS550-01/U1 User's
Manual 3AFE64804588 (3AUA0000001418), Rev H (2014-07-04)**, which states
compatibility with firmware **3.14e or later**. Check parameter 3301 and the
documentation for the installed version, active PID1 set and control path.
PID1 set 2 is not external/trim PID2; internal sleep and digital-input sleep
are distinct. Sleep boost is not mapped. ACS550 and ACQ580 parameter numbers
must not be interchanged.

The Mitsubishi profile includes selected references from the uploaded
**FR-F800 Instruction Manual, art. 292550 Version B (2015-12-03)** and the
**FR-A800-E / FR-F800-E Ethernet Function Manual IB(NA)-0600628ENG-B
(2016-11)**, with source-specific printed page citations. The detailed manual
is for the FR-F800 series; the Ethernet supplement covers FR-F800-E. The
2015 detailed edition predates the 2016 supplement and exact compatibility
with a particular -E drive and firmware is not established; verify the correct
manual with Mitsubishi and the station vendor. The reference covers PID
proportional band, sleep/deviation, boost and selected communication-loss
behavior, not a complete parameter list. Some functions can restart or run a
motor unexpectedly, including retry and sleep stirring. These references do
not recommend enabling features or changing site settings.

The separate legacy **FR-D700** profile uses the uploaded **Instruction
Manual (Basic), IB(NA)-0600438ENG-D (2019-01)** and **Instruction Manual
(Applied), IB(NA)-0600366ENG-H (2018-06)**. Selected PID, output suspension,
calibration and retry references cite printed pages from the appropriate manual.
The Applied manual's PID table identifies reverse process action as Pr.128 =
20, while its sleep figure labels reverse action as Pr.128 = 10; the guide
flags this discrepancy for confirmation with Mitsubishi. Parameter names shared
with FR-F800 do not establish identical behavior. Panel instructions are for
authorized changes under a safe station procedure, not a recommendation to
change control modes or parameters, clear settings, or bypass a write lock.

The **Pentek Intellidrive** profile uses the uploaded **Installation and
Operation Manual PN957 (2020-06-25)**, covering PID10-01, PID20-01, PID30-01
and PID50-01. It includes selected keypad, pressure sensor, internal/external
setpoint, PID, sleep/boost, motor and fault references with printed page
citations. These models expose PID controls on their keypad; derivative time
and integration time are in milliseconds. Wake Up Differential is pressure
below setpoint, while Wake Delay is part of the boost process, not the dry-run
automatic restart delay. The manual's initial-startup text gives three minutes
for line fill, while its parameter table lists a one-minute default and says
the Fill Time clock starts at 55 Hz; verify the installed value and software.
The panel procedure is for authorized changes only; Pump Out is fixed-speed
operation without pressure control. Check exact model and software, preserve
the commissioned settings, and do not bypass protections.

The separate **Altivar Machine ATV320** profile cites the uploaded
**Programming Manual NVE41295.06 (2025-04)**. It describes software V3.5IE46
and states it can also be used with earlier versions; confirm the installed
software and available functions. PID integral and derivative are gains, not
times. Low Speed Timeout and PID wake-up threshold are distinct, and the
threshold is dependent on feedback scaling rather than an absolute PSI value.
The integrated jog dial can change the internal PID reference without pressing
ENT in the reference-speed menu. References and panel instructions do not
authorize tuning, resetting or changing protections, and must not be copied
to the separate ATV600 family.

ATV600 and generic profiles' exact mappings remain pending.
Technician-entered references and values are not independently verified
manufacturer data.

**Save worksheet on this device** stores named asset records under
`tracerVfdCommissioning_v1`. Saving an existing record requires confirmation
before replacing it, including baseline edits. Unsaved drafts survive dashboard
navigation within the session but not reload/closure; saving is explicit.
Read/write failures are reported, and unreadable saved data disables saving
rather than overwriting it. Different assets/profiles have independent records.
Browser storage is not a parameter backup or a cross-device database.

**Add worksheet to Notes** includes equipment, all function records, comparison
labels, selected symptom/checks, observations and safety/source caveats.
Use **Save Notes** and **Export .TXT** separately for persistence and a portable
text record; this text cannot restore a drive configuration. Record
time-stamped pressure, setpoint, commanded/actual Hz, flow/demand, any authorized
change, rollback value and outcome. Keep a separate vendor/drive parameter
backup before changing settings. Protection and automatic-restart changes need
vendor/qualified-technician review; do not bypass protections, factory-reset or
repeatedly restart into a fault.

## Decoder idle-current calculator

**Decoder idle current - nominal mA / range** is available in Quick Field
Calculator, the Irrigation Control menu, the two-wire diagnostic path and the
decoder reference tab. It multiplies physical-device counts by idle mA per
device. Two rows allow compatible model groups on the same measured path/module
(for example, mixed Rain Bird FD groups); different systems cannot be combined.
Saved inputs and Add Result to Notes use the same shared calculator.

Provisional references located through indexed manufacturer material:

| Family | Idle mA per physical device | Source |
|---|---|---|
| Hunter Pilot two-way modules | Roughly 1; no tolerance stated | [View Module Current](https://www.hunterirrigation.com/support/pilot-integrated-hub-view-module-current) |
| Hunter I-Core DUAL, legacy field systems, not ICD | Approximately 3-4 | [DUAL troubleshooting](https://www.hunterirrigation.com/support/i-core-dual-troubleshooting) |
| Rain Bird FD-101 / FD-102 | 0.5 nominal | [Golf decoder general information](https://www.rainbird.com/troubleshooting-guide/12615) |
| Rain Bird FD-202 / FD-401 / FD-601 | 1 nominal | Same Rain Bird reference; not IC/ICM |
| Calsense 2-station / POC / soil-moisture decoders | 0.8-1.0 | [2-Wire Troubleshooting Guide](https://www.calsense.com/wp-content/uploads/2024/05/2-Wire-Troubleshooting-Guide.pdf) |
| Tucor LD-050 / LD-100 / LD-200 | 0.5 nominal | [Establish Your Benchmark & System Layout](https://support.tucor.com/support/solutions/articles/4000213642-step-2-establish-your-benchmark-system-layout) |

Direct source retrieval failed DNS checks during research. These references
remain explicitly **provisional** in every preset result until the original
documents and exact installed model/revision are confirmed. No universal
percentage tolerance is invented. Hunter ICD (ACC/ACC2), Rain Bird golf IC/ICM,
Rain Bird ESP-LXIVM/IVM, Toro LSM/LAC/GAC and other/legacy decoders, Baseline,
WeatherTRAK H2O and Weathermatic SmartWire SLDEC have no numeric presets:
selecting them blocks the calculation rather than borrowing another family's
rate. Golf IC/ICM, ESP-LXIVM/IVM and FD are separate Rain Bird families;
WeatherTRAK H2O and Weathermatic SLDEC are also distinct systems.
New profiles are appended to preserve saved numeric selections.
Custom mode accepts documented
lower/upper values, clearly labeled as user-entered; enter the same value twice
if only a nominal figure is available.

Tucor LD-400/LD-600 remains blocked: indexed LD data-sheet guidance gives
0.8 mA, while indexed troubleshooting benchmark guidance gives 1.0 mA. These
are conflicting nominal references, **not** an established tolerance range.
Confirm the exact model/revision before entering a custom value. Do not infer
current or compatibility from an alleged OEM/rebranding relationship without
an explicit model cross-reference. Baseline's
[SubStation specifications](https://www.hydropoint.com/products/substation/)
also describe idle two-wire power-down: a powered-off reading is not a
powered diagnostic baseline. No biCoder rate or universal Baseline behavior
is inferred from that controller-specific feature.

An optional measured reading is compared to the unrounded decoder-only subtotal,
not diagnosed as a fault. Nominal figures never produce a pass/fail tolerance
band. Keep stations/master valves off and the path powered in its specified
diagnostic state. Controller readings and meter readings are not automatically
interchangeable on proprietary waveforms. Surge protectors are deferred; other
unlisted loads, output-module overhead and cable effects are also not modeled.
This subtotal is not a guaranteed whole-path normal range, active-solenoid
current, controller capacity check or wire-distance approval.

## Golf catalog Part Finder

Part Finder's **Golf irrigation** category indexes all product sections of the
three uploaded golf catalogs, including rotors, named nozzle families, central
control, field controllers, decoders, sensors, valves, fittings, service tools,
support offerings and the landscape products included in those golf catalogs.
Listed model variants and accessory identifiers are searchable and included in
**Add to Notes**, alongside factual specifications and PDF-page citations.
Original workbook, landscape and filtration records are retained.

The factual indexes live in `data/golf-hunter.js`, `data/golf-rainbird.js` and
`data/golf-toro.js`. Keep these files with `dashboard.html`; they load synchronously,
without a network API or PDF download. The **Golf catalog coverage and source
limits** disclosure in Part Finder lists each verified edition and the reviewed
page ranges, distinguishing product, technical and introductory pages.

All 310 PDF pages are accounted for: Hunter Volume 41 (88 pages), Rain Bird
2026-2027 (110 pages) and Toro Golf Irrigation 2026 (112 pages).
There are 272 searchable records: 68 Hunter, 147 Rain Bird and 57 Toro.
Upload filenames containing 2026 do not establish the actual edition.
This is complete product-section/model-family indexing, **not** a transcription
of every performance-chart cell, a spare-parts service manual, or generation
of every theoretical configuration SKU. Same-family named variants can share a
record; its listed identifiers and facts must be read together.

Nozzle identifiers are not flow rates. Precipitation requires the selected
nozzle's actual pressure/flow, arc and spacing; source chart assumptions remain
explicit. Conventional and two-wire controls, supply voltages, inrush versus
holding loads, pipe dimensions and operating versus body-pressure ratings are
not interchangeable. Source conflicts are flagged rather than resolved by
guessing, including Hunter GT-835 ordering/regulation text and Pilot product
versus appendix solenoid-load statements.

Catalog PDFs, page images and raw OCR are not redistributed. Where no direct
specification URL is verified, use the manufacturer site or spec search;
citations refer to the uploaded PDF page positions, not guessed printed pages.

Run all dependency-free regression suites with `node --test tests/*.test.cjs`.

## Filtration references

The **Filters & valves** shortcut opens the catalog-enriched Part Finder category.
Records retain workbook entries and add configuration-specific facts, source
editions/pages and warnings. Search includes specification text; **Add to Notes**
includes the facts and citation. The manufacturer library and Checklists also
contain filtration references and a backwash-service checklist.

Uploaded source filenames say 2026, but the documents themselves are:

- Amiad, *Filtration Products for Irrigation*, document
  `910101-000311/01.2021`: PDF pp. 4-8. This is a family overview; flow ceilings
  are not individual-model design capacities or verified pressure ratings.
- Netafim, *Filtration 2025 v5.0*: printed pp. 13-83. Includes SandStorm,
  AlphaDisc, SpinKlin/Apollo, manual disc, ScreenGuard and CentriForce references.
  Filtration flow, cleaning flow, minimum cleaning pressure and housing pressure
  rating must not be interchanged. Water quality and filtration grade affect
  capacity.

Duplicate uploads were byte-identical and processed once. Catalog PDFs are not
redistributed in this repository.

**Unresolved source conflicts:** Netafim SpinKlin 2-inch pressure values on
pp. 29-30 disagree. Large polymer ScreenGuard tables on pp. 71/74 say 10 bar,
while the p. 80 description guide says PN8. Affected records flag the conflict
instead of recommending a pressure.

**BERMAD is pending verification:** the user-supplied
`https://pdf.directindustry.com/pdf/bermad-cs-ltd-109325.html` directory and the
official BERMAD site failed DNS lookup from the working environment on
2026-11-06. Existing workbook entries remain available, explicitly unverified,
with a directory link; no BERMAD sheets or new operating ratings were ingested.
The Netafim upload is filtration-only, so legacy valve entries are likewise
not represented as catalog-verified.

Run the dependency-free data and syntax checks with:

```sh
node --test tests/filtration.test.cjs
```

## Landscape technical references

Piping, velocity and friction-loss calculations are global hydraulic tools shared
across golf, landscape, filtration and pump systems. Their inclusion in a catalog
reference identifies the source, not a landscape-only restriction; no separate
landscape friction calculator is used.

The shared calculator includes 87 material/nominal-size presets from Hunter
pp. 201-208 and 211-213, using the printed inside diameters and C values, plus
manual ID/C entry. PE charts on pp. 209-210 do not give a direct average-ID
table and are not converted into guessed presets. Two misleading source entries
are excluded: p. 205's half-inch entry is explicitly Class 315 rather than
Class 200; p. 207 labels a 6.031-inch bore as 5-inch nominal. Check actual
installed dimensions and use custom entry for unlisted sizes.

The **Landscape technical** tab and **Landscape technical reference** shortcut
cover the uploaded Hunter Residential/Commercial catalog's Technical Information
pp. 194-217. Printed and PDF page numbers match. The appendix covers trajectory,
dripline runs, component losses, precipitation, soil/slope guidance, hydraulic
tables, valve/relay wiring, Solar Sync and preliminary design capacity.

The Rain Bird upload is **Consumer Products 2026, Rev. 01/26**, not the
professional landscape catalog. It has no technical appendix at the end.
Integrated references instead use its product tables: printed p. 6 (consumer
PRS sprays), pp. 8-10 (nozzles), pp. 23-24 (rotors) and pp. 55-59 (drip).
For these pages, PDF page number = printed page number + 4.

Five source-specific tools are available through the landscape reference or the
irrigation card: landscape precipitation, total-area application/runtime,
soil/slope intake guidance, Hunter conventional valve wiring and Hunter HDL
individual-run limits. **Golf precipitation and wire tools
remain separate and unchanged.** Landscape product references are also searchable
in Part Finder's **Landscape irrigation** category.

Spacing calculations require actual nozzle flow at the selected pressure/arc.
Published chart rates assume their specified spacing and test conditions; rounded
flow values may not reproduce a chart rate exactly. Total-area runtime estimates
gross applied depth, not net crop demand or uniformity. Soil/slope values are
average guidance; boundary slopes use the steeper band conservatively. Confirm
field intake and runoff rather than treating a reference as a guaranteed safe
limit.

Hunter valve wiring uses the p. 215 common/control matrix for the stated
heavy-duty 24 VAC solenoid; it is not a decoder, DC-latching, other-brand valve
or motor-feeder table. Two simultaneous solenoids on the same wires halve the
listed single-solenoid distance. PSR relays have a separate, much shorter table;
the catalog figures remain reference material, not a generic wire calculator.
The appendix's AWG 1 resistance and AWG 14 area entries appear internally
inconsistent; these tools do not use those entries.

HDL lookup uses only exact published pressure/flow/spacing combinations, with no
interpolation or extrapolation. CV, PC/R and COP limits stay distinct. All
references include source pages and model assumptions; catalog PDFs are not
redistributed. BERMAD remains deferred.

Run both catalog regression suites with:

```sh
node --test tests/*.test.cjs
```

## Irrigation control wire distance

The **Generic 24 V irrigation wire sizing** calculator estimates the smallest
listed equal-gauge copper control/common pair meeting an entered voltage-drop
budget. Its example uses 24 VAC controller output, 20 VAC minimum at the load
and 4 V allowable drop; use the actual measured lowest output and the load's
specified minimum instead of assuming those values. Enter the total current
sharing both conductors and check inrush and holding separately. The calculation
is a resistance-only screen, not an ampacity, electrical-code or manufacturer
approval. It is not for pump power wiring or a manufacturer decoder path limit.

The irrigation card includes separate **Conventional valve wiring** and
**Two-wire decoder path** calculators. Select copper AWG, enter the actual
controller output, the equipment's minimum voltage, the critical current and the
one-way run. Conventional wiring permits different control and common gauges,
AC or DC, and multiple solenoids on the same pair. Check pickup/inrush and
holding separately. Other loads sharing a common require segment-by-segment
analysis.

The two-wire calculation is only a resistance-based voltage-budget screen; it
assumes all path current is at the far end. It cannot establish decoder
compatibility, signal integrity, or allowable distance for a particular system.
Use the manufacturer's approved wire, topology, total-wire and path limits,
device and current limits, surge protection and grounding requirements.

Both use the Hunter Residential/Commercial catalog p. 215 resistance table for
annealed copper at 68°F. AWG 1 is omitted because its printed resistance conflicts
with the adjacent metric value. Temperature, splices and AC impedance can add
loss. These calculators do not size motor feeders or determine code compliance.
The existing Hunter conventional 24 VAC valve table and decoder-specific
manufacturer lookups remain separate. The Hunter relay table remains a cited
reference, not a calculator or assumption in the generic 24 V tool.