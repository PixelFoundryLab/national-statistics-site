// China by the Numbers: hash routing and the controls. The pages are in
// views.js; this file decides which one to show and wires up what the reader
// can touch: the line/bars switch on every chart, the search box and the sort
// buttons on the data page. Nothing here fetches anything over the network.
//
//   #/                     overview
//   #/economy              economy
//   #/people               people
//   #/society              society
//   #/data                 every indicator, every year
//   #/indicator/<id>       one indicator on its own page
//   #/about                sources and methods
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { YEARS, INDICATORS, byId, latest, formatValue } from './countryData.js';
import { lineChart, barChart } from './chartRender.js';
import { overview, economy, people, society, indicator, dataPage, about, missing } from './sectionViews.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

const TITLES = {
  overview: 'China by the Numbers',
  economy: 'Economy',
  people: 'People',
  society: 'Society',
  data: 'All the data',
  about: 'About',
};

// Swap one chart block between its line and bar drawing.
function wireChartToggles(root) {
  root.querySelectorAll('.chart-block').forEach((block) => {
    const ind = byId(block.dataset.indicator);
    if (!ind) return;
    const slot = block.querySelector('[data-chart-slot]');
    block.querySelectorAll('[data-chart]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const kind = btn.dataset.chart;
        slot.innerHTML = kind === 'bar' ? barChart(ind) : lineChart(ind);
        block.querySelectorAll('[data-chart]').forEach((b) => {
          b.classList.toggle('on', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });
  });
}

// The data page: a search box that filters rows by name, and sort buttons.
function wireDataPage(root) {
  const input = root.querySelector('#q');
  const count = root.querySelector('#count');
  const table = root.querySelector('#data-table');
  if (!input || !table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach((r) => {
      const hit = !q || r.dataset.name.includes(q);
      r.style.display = hit ? '' : 'none';
      if (hit) shown += 1;
    });
    count.textContent = shown === INDICATORS.length ? `${INDICATORS.length} indicators` : `${shown} of ${INDICATORS.length} indicators`;
  };
  input.addEventListener('input', apply);
  table.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      const dir = btn.dataset.dir === 'asc' ? 1 : -1;
      btn.dataset.dir = dir === 1 ? 'desc' : 'asc';
      const sorted = rows.slice().sort((a, b) => {
        if (key === 'name') return dir * a.dataset.name.localeCompare(b.dataset.name);
        return dir * (Number(a.dataset.latest) - Number(b.dataset.latest));
      });
      sorted.forEach((r) => tbody.appendChild(r));
      apply();
    });
  });
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const indMatch = hash.match(/^#\/indicator\/([^/?]+)/);
  let html;
  let key = 'overview';
  if (indMatch) {
    const found = byId(decodeURIComponent(indMatch[1]));
    key = 'indicator';
    html = indicator(indMatch[1]);
    document.title = `${found ? found.name : 'Not found'} | China by the Numbers`;
  } else if (hash.startsWith('#/economy')) {
    key = 'economy';
    html = economy();
    document.title = 'Economy | China by the Numbers';
  } else if (hash.startsWith('#/people')) {
    key = 'people';
    html = people();
    document.title = 'People | China by the Numbers';
  } else if (hash.startsWith('#/society')) {
    key = 'society';
    html = society();
    document.title = 'Society | China by the Numbers';
  } else if (hash.startsWith('#/data')) {
    key = 'data';
    html = dataPage();
    document.title = 'All the data | China by the Numbers';
  } else if (hash.startsWith('#/about')) {
    key = 'about';
    html = about();
    document.title = 'About | China by the Numbers';
  } else {
    html = overview();
    document.title = 'China by the Numbers';
  }
  app.innerHTML = html;
  nav.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('on', a.dataset.page === key);
    if (a.dataset.page === key) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  wireChartToggles(app);
  wireDataPage(app);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
