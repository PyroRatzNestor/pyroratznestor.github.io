# pyroratznestor.github.io

Single-page field technical dashboard. Open `index.html`, or serve the repository
with `python3 -m http.server 8899`.

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