// China by the Numbers — the figures.
// Every value comes from the World Bank's World Development Indicators (WDI),
// retrieved 27 November 2026. Years run 2019 to 2024; a null means the Bank
// has published no value for that year. Units and the exact indicator code
// sit beside each series so any figure can be checked against the source.

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const SOURCE = 'World Bank, World Development Indicators';

export const INDICATORS = [
  {
    id: 'population',
    code: 'SP.POP.TOTL',
    name: 'Population',
    category: 'people',
    unit: 'people',
    decimals: 0,
    blurb:
      'People living in China at mid-year. The population peaked in 2021 and has fallen for three straight years.',
    values: [1407745000, 1411100000, 1412360000, 1412175000, 1410710000, 1408975000],
  },
  {
    id: 'pop-growth',
    code: 'SP.POP.GROW',
    name: 'Population growth',
    category: 'people',
    unit: '% per year',
    decimals: 2,
    blurb:
      'Annual change in the population. Growth turned negative in 2022 for the first time in six decades.',
    values: [0.35, 0.24, 0.09, -0.01, -0.1, -0.12],
  },
  {
    id: 'life-expectancy',
    code: 'SP.DYN.LE00.IN',
    name: 'Life expectancy at birth',
    category: 'people',
    unit: 'years',
    decimals: 1,
    blurb:
      'How long a newborn could expect to live if death rates stayed as they are. It has held near 78 years since 2020.',
    values: [77.9, 78.0, 78.1, 78.2, 78.0, 78.0],
  },
  {
    id: 'infant-mortality',
    code: 'SP.DYN.IMRT.IN',
    name: 'Infant mortality',
    category: 'people',
    unit: 'deaths per 1,000 live births',
    decimals: 1,
    blurb:
      'Babies dying before their first birthday. It fell by a third between 2019 and 2024, to 4.1 per 1,000.',
    values: [6.0, 5.5, 5.1, 4.8, 4.4, 4.1],
  },
  {
    id: 'fertility',
    code: 'SP.DYN.TFRT.IN',
    name: 'Fertility rate',
    category: 'people',
    unit: 'births per woman',
    decimals: 2,
    blurb:
      'Children a woman would have over her lifetime at current birth rates. At 1.01 in 2024 it is far below the 2.1 needed to replace the population.',
    values: [1.5, 1.24, 1.12, 1.03, 1.0, 1.01],
  },
  {
    id: 'urban-share',
    code: 'SP.URB.TOTL.IN.ZS',
    name: 'Urban population',
    category: 'people',
    unit: '% of population',
    decimals: 1,
    blurb:
      'Share of people living in towns and cities. Two in three people now live in urban areas, up from 62.7% in 2019.',
    values: [62.7, 63.5, 64.7, 65.2, 65.5, 65.9],
  },
  {
    id: 'gdp',
    code: 'NY.GDP.MKTP.CD',
    name: 'GDP',
    category: 'economy',
    unit: 'US$',
    decimals: 0,
    scale: 1e12,
    scaleLabel: 'trillion',
    blurb:
      'The value of everything produced in a year, in current US dollars. China is the world\u2019s second-largest economy, at $18.7 trillion in 2024.',
    values: [14560167101283, 14996414166715, 18201698719564, 18316765021690, 18270356654533, 18729668435848],
  },
  {
    id: 'gdp-growth',
    code: 'NY.GDP.MKTP.KD.ZG',
    name: 'GDP growth',
    category: 'economy',
    unit: '% per year',
    decimals: 1,
    blurb:
      'Annual growth of GDP in constant prices. It rebounded to 8.6% in 2021, slowed to 3.1% in 2022, and ran at 5.0% in 2024.',
    values: [6.1, 2.3, 8.6, 3.1, 5.4, 5.0],
  },
  {
    id: 'gdp-per-capita',
    code: 'NY.GDP.PCAP.CD',
    name: 'GDP per capita',
    category: 'economy',
    unit: 'US$',
    decimals: 0,
    blurb:
      'GDP divided by the population. It passed $10,000 in 2019 and reached $13,293 in 2024.',
    values: [10343, 10627, 12887, 12971, 12951, 13293],
  },
  {
    id: 'exports',
    code: 'NE.EXP.GNFS.ZS',
    name: 'Exports of goods and services',
    category: 'economy',
    unit: '% of GDP',
    decimals: 1,
    blurb:
      'What China sells abroad as a share of its economy. Exports were 20.4% of GDP in 2024, the highest share since 2019.',
    values: [18.1, 18.3, 19.4, 20.2, 19.4, 20.4],
  },
  {
    id: 'imports',
    code: 'NE.IMP.GNFS.ZS',
    name: 'Imports of goods and services',
    category: 'economy',
    unit: '% of GDP',
    decimals: 1,
    blurb:
      'What China buys from abroad as a share of its economy. Imports were 17.5% of GDP in 2024.',
    values: [17.3, 16.1, 17.2, 17.3, 17.3, 17.5],
  },
  {
    id: 'inflation',
    code: 'FP.CPI.TOTL.ZG',
    name: 'Inflation, consumer prices',
    category: 'economy',
    unit: '% per year',
    decimals: 2,
    blurb:
      'How fast consumer prices rise. Prices were nearly flat in 2023 and 2024, at 0.2% a year, after 2.9% in 2019.',
    values: [2.9, 2.42, 0.98, 1.97, 0.23, 0.22],
  },
  {
    id: 'unemployment',
    code: 'SL.UEM.TOTL.ZS',
    name: 'Unemployment',
    category: 'society',
    unit: '% of labour force',
    decimals: 2,
    blurb:
      'Share of the labour force without work but looking for it. It was 4.59% in 2024, close to its 2019 level.',
    values: [4.56, 5.0, 4.55, 4.98, 4.67, 4.59],
  },
  {
    id: 'primary-enrolment',
    code: 'SE.PRM.ENRR',
    name: 'Primary school enrolment',
    category: 'society',
    unit: '% net',
    decimals: 1,
    blurb:
      'Children of primary-school age actually in school. Net enrolment has run above 99% since 2021.',
    values: [97.8, 98.8, 99.2, 100.1, 99.2, 99.6],
  },
  {
    id: 'internet-users',
    code: 'IT.NET.USER.ZS',
    name: 'People using the internet',
    category: 'society',
    unit: '% of population',
    decimals: 1,
    blurb:
      'Share of the population that used the internet in the last three months. It reached 92% in 2024, up from 64% in 2019.',
    values: [64.1, 70.1, 73.1, 75.6, 90.6, 92.0],
  },
];

export function byId(id) {
  return INDICATORS.find((i) => i.id === id);
}

export function byCategory(category) {
  return INDICATORS.filter((i) => i.category === category);
}

export function latest(ind) {
  return ind.values[ind.values.length - 1];
}

export function previous(ind) {
  return ind.values[ind.values.length - 2];
}

// Change from the previous year to the latest, in the indicator's own units.
export function change(ind) {
  return latest(ind) - previous(ind);
}

// Format a raw value for display: big numbers get commas, scaled ones get
// their scale label (e.g. 18.73 trillion).
export function formatValue(ind, value) {
  if (value === null || value === undefined) return '—';
  if (ind.scale) {
    const scaled = value / ind.scale;
    return `${scaled.toFixed(2)} ${ind.scaleLabel}`;
  }
  const rounded = Number(value.toFixed(ind.decimals));
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: ind.decimals,
    maximumFractionDigits: ind.decimals,
  });
}

export function formatLatest(ind) {
  return formatValue(ind, latest(ind));
}
