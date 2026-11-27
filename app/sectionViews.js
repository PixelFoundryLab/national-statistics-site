// HTML for each page, built from the data. Every value is escaped before it
// goes into the page. Pages are reached by hash links, so each one is a real
// address a visitor can bookmark and share.

import { YEARS, SOURCE, INDICATORS, byId, byCategory, latest, change, formatValue, formatLatest } from './countryData.js';
import { lineChart, barChart, sparkline } from './chartRender.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// A change badge: up or down since the previous year, in the indicator's units.
function changeBadge(ind) {
  const c = change(ind);
  const dir = c > 0 ? '▲' : c < 0 ? '▼' : '—';
  const cls = c > 0 ? 'up' : c < 0 ? 'down' : 'flat';
  const sign = c > 0 ? '+' : '';
  return `<span class="change ${cls}">${dir} ${sign}${formatValue(ind, Math.abs(c))} vs ${YEARS[YEARS.length - 2]}</span>`;
}

function indicatorCard(ind) {
  return `<article class="card">
  <a class="card-link" href="#/indicator/${ind.id}">
    <h3>${esc(ind.name)}</h3>
    <p class="big">${esc(formatLatest(ind))} <span class="unit">${esc(ind.unit)}</span></p>
    ${sparkline(ind)}
    <p class="card-meta">${changeBadge(ind)} · ${YEARS[YEARS.length - 1]}</p>
  </a>
</article>`;
}

// The big chart block of a section page: one indicator, a line/bar switch,
// and the indicator's own words underneath.
export function chartBlock(ind, kind) {
  const chart = kind === 'bar' ? barChart(ind) : lineChart(ind);
  return `<section class="chart-block" data-indicator="${ind.id}">
  <div class="chart-head">
    <h2>${esc(ind.name)} <span class="unit">${esc(ind.unit)}</span></h2>
    <div class="seg" role="group" aria-label="Chart type">
      <button type="button" data-chart="line" class="${kind === 'line' ? 'on' : ''}" aria-pressed="${kind === 'line'}">Line</button>
      <button type="button" data-chart="bar" class="${kind === 'bar' ? 'on' : ''}" aria-pressed="${kind === 'bar'}">Bars</button>
    </div>
  </div>
  <div class="chart" data-chart-slot>${chart}</div>
  <p class="blurb">${esc(ind.blurb)}</p>
  <p class="source-line">Source: ${esc(SOURCE)} (${ind.code}), ${YEARS[0]}–${YEARS[YEARS.length - 1]}.</p>
</section>`;
}

// A compact table of one category's indicators across all years.
function yearTable(inds) {
  const head = `<tr><th scope="col">Indicator</th>${YEARS.map((y) => `<th scope="col" class="num">${y}</th>`).join('')}</tr>`;
  const rows = inds
    .map(
      (ind) =>
        `<tr><th scope="row"><a href="#/indicator/${ind.id}">${esc(ind.name)}</a><span class="unit"> · ${esc(ind.unit)}</span></th>${ind.values.map((v) => `<td class="num">${esc(formatValue(ind, v))}</td>`).join('')}</tr>`,
    )
    .join('');
  return `<div class="table-wrap"><table class="years"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
}

export function overview() {
  const picks = ['population', 'gdp', 'gdp-per-capita', 'life-expectancy'].map(byId);
  const pop = byId('population');
  const gdp = byId('gdp');
  return `<section class="hero">
  <p class="kicker">National statistics · China · ${YEARS[0]}–${YEARS[YEARS.length - 1]}</p>
  <h1>China by the Numbers</h1>
  <p class="lede">The country in fifteen figures: how many people live here, what the economy makes, and how life is changing — each number with its source and its year, nothing guessed.</p>
  <p class="hero-links"><a class="btn" href="#/economy">Explore the economy</a> <a class="btn ghost" href="#/data">See all the data</a></p>
</section>
<section>
  <h2>At a glance, ${YEARS[YEARS.length - 1]}</h2>
  <div class="cards">${picks.map(indicatorCard).join('')}</div>
</section>
${chartBlock(pop, 'line')}
${chartBlock(gdp, 'line')}
<section>
  <h2>What changed in ${YEARS[YEARS.length - 1]}</h2>
  <ul class="takeaways">
    <li><strong>Population fell</strong> for the third year in a row, to ${formatLatest(pop)} — down ${formatValue(pop, Math.abs(change(pop)))} on ${YEARS[YEARS.length - 2]}.</li>
    <li><strong>The economy grew 5.0%</strong> and reached ${formatLatest(gdp)} in current US dollars.</li>
    <li><strong>Prices were nearly flat</strong>: consumer-price inflation was just 0.22%, after 0.23% in 2023.</li>
    <li><strong>Internet use hit 92%</strong> of the population, up from 64% in 2019.</li>
  </ul>
  <p class="source-line">All figures: ${esc(SOURCE)}. Read the notes on <a href="#/about">sources and methods</a>.</p>
</section>`;
}

function sectionPage(title, intro, category, featureId) {
  const inds = byCategory(category);
  const feature = byId(featureId);
  return `<section class="page-head">
  <h1>${esc(title)}</h1>
  <p class="lede">${esc(intro)}</p>
</section>
${chartBlock(feature, 'line')}
<section>
  <h2>All ${esc(title.toLowerCase())} indicators</h2>
  <div class="cards">${inds.map(indicatorCard).join('')}</div>
</section>
<section>
  <h2>Every year, ${YEARS[0]}–${YEARS[YEARS.length - 1]}</h2>
  ${yearTable(inds)}
  <p class="source-line">Source: ${esc(SOURCE)}. Figures are as published; a value the Bank has not published shows as —.</p>
</section>`;
}

export function economy() {
  return sectionPage(
    'Economy',
    'What China makes, sells and charges: GDP and its growth, what each person produces, trade with the world, and the price of everyday life.',
    'economy',
    'gdp',
  );
}

export function people() {
  return sectionPage(
    'People',
    'Who lives in China and how life is changing: how many people, how fast the population is growing or shrinking, how long they live, and where they live.',
    'people',
    'population',
  );
}

export function society() {
  return sectionPage(
    'Society',
    'Work, school and connection: who has a job, who is in school, and who is online.',
    'society',
    'internet-users',
  );
}

// One indicator on its own page: the chart, the numbers, and its story.
export function indicator(id) {
  const ind = byId(id);
  if (!ind) return missing();
  const rows = YEARS.map(
    (y, i) => `<tr><th scope="row">${y}</th><td class="num">${esc(formatValue(ind, ind.values[i]))}</td></tr>`,
  ).join('');
  return `<p class="crumb"><a href="#/">&larr; All sections</a></p>
<h1>${esc(ind.name)}</h1>
<p class="lede">${esc(ind.blurb)}</p>
${chartBlock(ind, 'line')}
<section>
  <h2>Values by year</h2>
  <div class="table-wrap"><table class="years narrow"><thead><tr><th scope="col">Year</th><th scope="col" class="num">${esc(ind.name)} (${esc(ind.unit)})</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="source-line">Indicator ${esc(ind.code)} · Source: ${esc(SOURCE)} · Retrieved 27 November 2026.</p>
</section>`;
}

// The full data table: every indicator, every year, searchable and sortable.
export function dataPage() {
  const head = `<tr><th scope="col"><button type="button" class="sort" data-sort="name" data-dir="asc">Indicator ↕</button></th><th scope="col">Unit</th>${YEARS.map((y) => `<th scope="col" class="num">${y}</th>`).join('')}<th scope="col"><button type="button" class="sort" data-sort="latest" data-dir="desc">Latest ↕</button></th></tr>`;
  const rows = INDICATORS.map(
    (ind) =>
      `<tr data-name="${esc(ind.name.toLowerCase())}" data-latest="${latest(ind)}"><th scope="row"><a href="#/indicator/${ind.id}">${esc(ind.name)}</a></th><td>${esc(ind.unit)}</td>${ind.values.map((v) => `<td class="num">${esc(formatValue(ind, v))}</td>`).join('')}<td class="num"><strong>${esc(formatLatest(ind))}</strong></td></tr>`,
  ).join('');
  return `<section class="page-head">
  <h1>All the data</h1>
  <p class="lede">Fifteen indicators, six years each. Search to filter the list, or sort by name or by the latest value.</p>
</section>
<p><label class="search-label" for="q">Search indicators</label>
<input id="q" type="search" placeholder="Try “population”, “GDP” or “internet”…" autocomplete="off"></p>
<p class="result-count" id="count" aria-live="polite">${INDICATORS.length} indicators</p>
<div class="table-wrap"><table class="years" id="data-table"><thead>${head}</thead><tbody>${rows}</tbody></table></div>
<p class="source-line">Source: ${esc(SOURCE)}. Every figure is as the Bank published it; the indicator code beside each name lets you check it. See <a href="#/about">sources and methods</a>.</p>`;
}

export function about() {
  return `<section class="page-head">
  <h1>About this site</h1>
  <p class="lede">China by the Numbers is an independent statistics site. It is not affiliated with the World Bank or with any government.</p>
</section>
<section>
  <h2>Where the numbers come from</h2>
  <p>Every figure on this site comes from the World Bank&rsquo;s <strong>World Development Indicators</strong> (WDI), the Bank&rsquo;s main collection of development data, compiled from national statistics offices and international agencies. The figures were retrieved on 27 November 2026 and cover 2019 to 2024, the latest six years the Bank has published for these indicators.</p>
  <p>Each indicator page and each table names the indicator&rsquo;s WDI code (for example, SP.POP.TOTL for population), so any figure can be looked up again at <strong>data.worldbank.org</strong>. Nothing on this site is estimated, modelled or filled in: where the Bank has published no value, the table shows —.</p>
  <h2>How to read the figures</h2>
  <ul>
    <li><strong>GDP</strong> is in current US dollars, converted at the year&rsquo;s market exchange rate. <strong>GDP growth</strong> is in constant prices, so it strips out inflation.</li>
    <li><strong>GDP per capita</strong> is GDP divided by the mid-year population.</li>
    <li><strong>Life expectancy</strong> is the years a newborn could expect to live if death rates stayed as they are in that year.</li>
    <li><strong>Net primary enrolment</strong> counts children of primary-school age who are actually in school; it can pass 100% when children outside the age band are enrolled.</li>
    <li><strong>Internet users</strong> are people who used the internet in the last three months, as a share of the population.</li>
  </ul>
  <h2>What this site is for</h2>
  <p>It answers the questions people actually ask about a country: how many people live there, how big the economy is, whether it is growing, how long people live, and how connected daily life has become. The overview gives the headline numbers; each section goes deeper; the data page holds every figure in one table.</p>
  <h2>Built how</h2>
  <p>The site is plain static files — HTML, CSS and JavaScript, no framework, no tracking, no network requests. The charts are drawn as SVG from the same data files the tables read. It works offline and on a phone.</p>
</section>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no page at this address. <a href="#/">Back to the overview</a>.</p>`;
}
