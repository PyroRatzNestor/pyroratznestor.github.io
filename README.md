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