# Third-party attribution

## Academic Project Page Template

- Source: https://github.com/eliahuhorwitz/Academic-project-page-template
- Author: Eliahu Horwitz and contributors
- Pinned revision: `d38af1ccae1ce82c3404d2820c4c646afd409f81`
- License stated by upstream: Creative Commons Attribution-ShareAlike 4.0 International, https://creativecommons.org/licenses/by-sa/4.0/
- Adaptation: OpenFlyScan content, visual styling, responsive layouts, accessible interactions, local assets, and an on-demand Spark iframe integration slot. Removed template placeholder content, analytics/external scripts, unused carousels and PDF embed machinery. Preserved the academic page component structure and vendored Bulma stylesheet.
- Upstream acknowledges the Nerfies project page: https://github.com/nerfies/nerfies.github.io (CC BY-SA 4.0).
- Visible attribution is retained in the website footer. The template/adapted website layout terms do not relicense scientific assets, underlying datasets or model files.

## Bulma

- Version: 0.9.1, as vendored by the template at the revision above.
- File: `static/vendor/bulma.min.css` (unchanged).
- Source: https://github.com/jgthms/bulma
- License: MIT, notice preserved in `static/vendor/BULMA_LICENSE.txt` and stylesheet header.

## Spark

- The separate viewer uses Spark 2.1.0 and Three.js 0.180.0; its source and model files are not included in this homepage repository.
- Spark: https://github.com/sparkjsdev/spark, MIT; notice served at https://gs.openflygo.com/openflyscan/releases/20260921/viewer/licenses/Spark-MIT.txt.
- Three.js: https://github.com/mrdoob/three.js, MIT; notice served at https://gs.openflygo.com/openflyscan/releases/20260921/viewer/licenses/Three-MIT.txt.
- The separately deployed viewer bundles these runtimes and serves their license notices. The homepage only creates its iframe after a user click.
- Reconstruction files retain their dataset/model terms; MIT runtime licensing does not relicense those assets. Public catalogs omit internal filesystem paths and incomparable evaluation metrics.
