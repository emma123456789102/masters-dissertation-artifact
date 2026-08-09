# Disease Trajectory Visualisation Dashboard

This repository contains the software artifact developed for the MSc dissertation:

**Visualising the Trajectory of Diseases Through Interactive Information Visualisation**

The project is an interactive web-based dashboard for exploring disease trajectory data. It was developed to investigate how information visualisation and interactive filtering can support the exploration of ordered disease sequences and relationships between diagnoses.
All Code is located within the Public Folder !!!
## Features

The dashboard provides three complementary visualisation views:

- **Sankey Diagram** – displays the progression of diseases across trajectory stages, with link width representing transition frequency.
- **Node-Link Diagram** – provides an alternative representation of relationships between diseases.
- **Common Pathways** – presents a simplified ranking of high-frequency disease transitions.

Additional functionality includes:

- Search by ICD-10 disease code
- Filter by trajectory stage
- Filter by minimum transition frequency
- Demographic filtering for compatible datasets, including sex, age group and SIMD
- Dataset selection
- Upload of compatible CSV datasets
- ICD-10 contextual information
- Summary statistics and pathway information
- Interactive tooltips
- Zoom and drag interaction within the node-link view
- Reset functionality
- Introductory guidance for new users

## Datasets

The dashboard was developed using two disease trajectory datasets:

1. **Scottish National disease trajectory dataset**
2. **Fife and Tayside disease trajectory dataset**

The datasets contain ordered disease sequences represented using ICD-10 codes. The Fife and Tayside dataset additionally provides demographic information that can be explored using the dashboard filters.

Raw trajectory data are transformed into transition-based records containing:

- source disease
- target disease
- trajectory stage
- transition frequency
- retained trajectory information
- demographic information where available

Python pre-processing scripts used for this transformation are included in the `public/` directory.

## Technologies

The application was developed using:

- HTML
- CSS
- JavaScript
- D3.js
- d3-sankey
- Vite
- Jest
- Python and pandas for dataset preprocessing

## Running the Application Locally

### Requirements

Install:

- Node.js
- npm

Then clone the repository:

```bash
git clone https://github.com/emma123456789102/masters-dissertation-artifact.git
cd masters-dissertation-artifact
```

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local address used to access the dashboard in your browser.

## Questions

If you have any questions about the project, please feel free to contact me.
