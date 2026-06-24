# Master's Dissertation Artifact — D3 Web Artifact

This repository contains a web-based D3 visualization artifact for the master's dissertation. It includes a minimal development setup using Vite, a D3 starter visualization, example data layout and CI.

Quick start

PowerShell:

```powershell
# install dependencies
npm install

# Start the dev server
npm run dev

# Run tests
npm test
```

Project layout

- `public/` — static HTML and assets (entry `index.html`)
- `src/` — JavaScript source, D3 visualizations
- `data/` — datasets (keep large raw data out of repo)
- `experiments/` — experiment configs and results
- `paper/` — chapter templates and notes
- `slides/` — presentation templates
- `tests/` — basic CI tests (node-side smoke tests)

See `CONTRIBUTING.md` for workflow notes.
