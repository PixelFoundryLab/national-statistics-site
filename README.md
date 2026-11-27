# China by the Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/PixelFoundryLab/national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/PixelFoundryLab/national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics site for China: population, economy, health, work, school and internet use, 2019–2024, each figure with its source and year. Fifteen indicators from the World Bank's World Development Indicators, presented as an overview, three sections, a page per indicator, and one searchable table of every figure.

## Run it

Serve `app/` with any static server and open `index.html`:

```sh
node serve.ts
# then open http://localhost:8080
```

Or build the entry output the way the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How it is built

- `app/` — the site itself: plain HTML, CSS and JavaScript, no framework, no network requests. Charts are SVG drawn from the same data files the tables read.
- `app/data.js` — all fifteen indicators, values 2019–2024, with their World Bank indicator codes.
- `app/charts.js` — line, bar and sparkline charts as inline SVG.
- `app/views.js` — the pages: overview, economy, people, society, one page per indicator, the full data table, and about.
- `app/main.js` — hash routing plus the controls: the line/bars switch on every chart, the search box and sort buttons on the data page.
- `screenshots/` — three screenshots of the site running in a browser.
- `main.ts` — hands the site in: copies `app/` and `screenshots/` to the output and writes `dossier.json`.

## Sources

Every figure: World Bank, World Development Indicators, retrieved 27 November 2026. Each indicator page names its WDI code so any figure can be checked again at data.worldbank.org.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
