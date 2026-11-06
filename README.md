# pyroratznestor.github.io

Single-page field technical dashboard. Open `index.html`, or serve the repository
with `python3 -m http.server 8899`.

## Golf catalog Part Finder

Part Finder's **Golf irrigation** category indexes all product sections of the
three uploaded golf catalogs, including rotors, named nozzle families, central
control, field controllers, decoders, sensors, valves, fittings, service tools,
support offerings and the landscape products included in those golf catalogs.
Listed model variants and accessory identifiers are searchable and included in
**Add to Notes**, alongside factual specifications and PDF-page citations.
Original workbook, landscape and filtration records are retained.

The factual indexes live in `data/golf-hunter.js`, `data/golf-rainbird.js` and
`data/golf-toro.js`. Keep these files with `index.html`; they load synchronously,
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

Six source-specific tools are available through the landscape reference or the
irrigation card: landscape precipitation, total-area application/runtime,
soil/slope intake guidance, Hunter conventional valve wiring, Hunter PSR relay
wiring and Hunter HDL individual-run limits. **Golf precipitation and wire tools
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
listed single-solenoid distance. PSR relays have a separate, much shorter table.
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
The existing Hunter conventional 24 VAC valve and pump-start relay tables remain
separate, as do the decoder-specific manufacturer lookups.