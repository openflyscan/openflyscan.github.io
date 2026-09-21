# OpenFlyScan project page

Research project page for **OpenFlyScan: A Quality-Guided Aerial Reconstruction System for Consumer Drones**.

- Homepage: https://openflyscan.github.io/
- Independent Gaussian scene viewer: https://gs.openflygo.com/

## Edit and publish

This repository contains the static homepage, figures, paper PDF, and presentation video. Edit `index.html`, `static/css/site.css`, and `static/js/site.js`; release links are configured in `static/js/config.js`. Push to `main` to publish through GitHub Pages, configured to serve the repository root. `.nojekyll` keeps the files unprocessed.

For a local preview, run `python3 -m http.server 4173 --bind 127.0.0.1` and open http://127.0.0.1:4173/.

The interactive viewer is hosted separately and loaded on demand through an iframe. Gaussian model files, training data, credentials, and internal deployment records are not stored here. Code, app, and dataset downloads remain planned releases until their public links are available.

## Attribution

The page adapts the Academic Project Page Template and Nerfies, with attribution in the footer. Website layout/adaptations use CC BY-SA 4.0; research assets retain their respective terms. See `THIRD_PARTY.md` for dependencies and attribution.
