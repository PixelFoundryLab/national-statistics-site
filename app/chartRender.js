// Charts drawn as inline SVG, from the data alone: no library, no network.
// Both builders take an indicator and a list of years and return an SVG string
// sized to the box they are given. The page re-renders them when the reader
// switches a chart between lines and bars.

import { YEARS, formatValue } from './countryData.js';

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Nice round numbers for the vertical axis: pick a step that gives 3-5 ticks.
function ticks(min, max) {
  const span = max - min || 1;
  const raw = span / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const out = [];
  for (let v = lo; v <= max + step * 0.001; v += step) out.push(v);
  return { step, values: out };
}

// Short axis label for a value: 1.41bn, 18.7tn, 78.0, 4.59.
function axisLabel(ind, v) {
  if (ind.scale) return `${(v / ind.scale).toFixed(1)}${ind.scaleLabel === 'trillion' ? 'tn' : ''}`;
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(3)}bn`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}m`;
  if (abs >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return Number(v.toFixed(1)).toString();
}

function frame(w, h, pad) {
  return {
    w,
    h,
    pad,
    innerW: w - pad.left - pad.right,
    innerH: h - pad.top - pad.bottom,
  };
}

export function lineChart(ind, opts = {}) {
  const w = opts.width ?? 640;
  const h = opts.height ?? 300;
  const color = opts.color ?? '#b3402a';
  const f = frame(w, h, { top: 14, right: 14, bottom: 30, left: 58 });
  const vals = ind.values;
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const padSpan = (max - min) * 0.12;
  min -= padSpan;
  max += padSpan;
  const t = ticks(min, max);
  const x = (i) => f.pad.left + (i / (vals.length - 1)) * f.innerW;
  const y = (v) => f.pad.top + ((max - v) / (max - min)) * f.innerH;
  const grid = t.values
    .map(
      (v) =>
        `<line x1="${f.pad.left}" y1="${y(v)}" x2="${w - f.pad.right}" y2="${y(v)}" stroke="#e4e0d8" stroke-width="1"/><text x="${f.pad.left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#6b655c">${esc(axisLabel(ind, v))}</text>`,
    )
    .join('');
  const xlabels = YEARS.map(
    (yr, i) => `<text x="${x(i)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#6b655c">${yr}</text>`,
  ).join('');
  const points = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${f.pad.left},${y(min)} ${points} ${x(vals.length - 1).toFixed(1)},${y(min)}`;
  const dots = vals
    .map(
      (v, i) =>
        `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff" stroke="${color}" stroke-width="2"><title>${YEARS[i]}: ${esc(formatValue(ind, v))} ${esc(ind.unit)}</title></circle>`,
    )
    .join('');
  const last = vals.length - 1;
  const callout = `<text x="${x(last)}" y="${y(vals[last]) - 12}" text-anchor="end" font-size="13" font-weight="700" fill="${color}">${esc(formatValue(ind, vals[last]))} ${esc(ind.unit)} (${YEARS[last]})</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Line chart of ${esc(ind.name)}, ${YEARS[0]} to ${YEARS[YEARS.length - 1]}">
${grid}
<polygon points="${area}" fill="${color}" opacity="0.08"/>
<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
${dots}
${xlabels}
${callout}
</svg>`;
}

export function barChart(ind, opts = {}) {
  const w = opts.width ?? 640;
  const h = opts.height ?? 300;
  const color = opts.color ?? '#b3402a';
  const f = frame(w, h, { top: 26, right: 14, bottom: 30, left: 58 });
  const vals = ind.values;
  const max = Math.max(...vals, 0);
  const min = Math.min(...vals, 0);
  const t = ticks(min, max);
  const y = (v) => f.pad.top + ((max - v) / (max - min)) * f.innerH;
  const slot = f.innerW / vals.length;
  const barW = Math.min(46, slot * 0.62);
  const grid = t.values
    .map(
      (v) =>
        `<line x1="${f.pad.left}" y1="${y(v)}" x2="${w - f.pad.right}" y2="${y(v)}" stroke="#e4e0d8" stroke-width="1"/><text x="${f.pad.left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#6b655c">${esc(axisLabel(ind, v))}</text>`,
    )
    .join('');
  const zeroY = y(0);
  const bars = vals
    .map((v, i) => {
      const bx = f.pad.left + i * slot + (slot - barW) / 2;
      const by = v >= 0 ? y(v) : zeroY;
      const bh = Math.max(1, Math.abs(y(v) - zeroY));
      const isLast = i === vals.length - 1;
      return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${isLast ? color : '#c9b8a6'}"><title>${YEARS[i]}: ${esc(formatValue(ind, v))} ${esc(ind.unit)}</title></rect>
<text x="${(bx + barW / 2).toFixed(1)}" y="${(by - 6).toFixed(1)}" text-anchor="middle" font-size="11" fill="${isLast ? color : '#6b655c'}" font-weight="${isLast ? 700 : 400}">${esc(formatValue(ind, v))}</text>`;
    })
    .join('');
  const xlabels = YEARS.map(
    (yr, i) =>
      `<text x="${(f.pad.left + i * slot + slot / 2).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#6b655c">${yr}</text>`,
  ).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Bar chart of ${esc(ind.name)}, ${YEARS[0]} to ${YEARS[YEARS.length - 1]}">
${grid}
<line x1="${f.pad.left}" y1="${zeroY}" x2="${w - f.pad.right}" y2="${zeroY}" stroke="#b9b2a6" stroke-width="1"/>
${bars}
${xlabels}
</svg>`;
}

// A small sparkline for an indicator card: the last six years as a line.
export function sparkline(ind, color = '#b3402a') {
  const w = 120;
  const h = 36;
  const vals = ind.values;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i) => 2 + (i / (vals.length - 1)) * (w - 4);
  const y = (v) => 3 + ((max - v) / span) * (h - 6);
  const points = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" width="120" height="36" aria-hidden="true"><polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
