export interface DataSourceMeta {
  id: string;
  name: string;
  organization: string;
  url: string;
  description: string;
  license: string;
  coverage: string;
  typicalCadence: string;
}

export const DATA_SOURCES_META: DataSourceMeta[] = [
  {
    id: 'noaa-mdmap',
    name: 'Marine Debris Monitoring and Assessment Project (MDMAP)',
    organization: 'National Oceanic and Atmospheric Administration (NOAA)',
    url: 'https://marinedebris.noaa.gov/research/marine-debris-monitoring-and-assessment-project',
    description: 'A global citizen science initiative recording baseline debris types and abundance along coastlines via rigorous 100-meter transects.',
    license: 'Public Domain (US Gov Open Data)',
    coverage: 'United States, Pacific Islands, and international partner shores',
    typicalCadence: 'Monthly to quarterly surveys',
  },
  {
    id: 'unep-gpml',
    name: 'Global Partnership on Marine Litter (GPML) & Regional Seas',
    organization: 'United Nations Environment Programme (UNEP)',
    url: 'https://www.unep.org/explore-topics/oceans-seas/what-we-do/working-regional-seas/global-partnership-marine-litter',
    description: 'Consolidates regional marine litter assessments (OSPAR, HELCOM, MED POL, NOWPAP) across international ocean basins.',
    license: 'Open Access UNEP Data Policy',
    coverage: 'Global marine basins and shared regional seas',
    typicalCadence: 'Annual to triennial state-of-environment reports',
  },
  {
    id: 'ocean-conservancy-icc',
    name: 'International Coastal Cleanup (ICC) Global Data',
    organization: 'Ocean Conservancy',
    url: 'https://oceanconservancy.org/trash-free-seas/international-coastal-cleanup/',
    description: 'Over 35 years of global beach and waterway volunteer tally-card data capturing single-use plastics and packaging items.',
    license: 'Open Data for Research & Non-commercial Education',
    coverage: 'Over 150 countries worldwide',
    typicalCadence: 'Annual worldwide coastal cleanups (September peak)',
  },
  {
    id: 'lebreton-riverine',
    name: 'Global Riverine Plastic Inputs to Oceans',
    organization: 'The Ocean Cleanup / Nature Communications (Lebreton et al.)',
    url: 'https://nature.com/articles/s41467-021-23165-7',
    description: 'Hydrodynamic model evaluating high-resolution plastic emissions from 1,600+ rivers into coastal waters based on terrain, rainfall, and mismanaged plastic waste (MPW).',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    coverage: 'Global river catchments',
    typicalCadence: 'Scientific research baseline model',
  },
];

export const METHODOLOGY_EXPLANATION = {
  title: 'AquaWatch Data Integrity & Provenance Framework',
  principles: [
    {
      title: 'No Fabricated Measurements',
      description: 'AquaWatch never invents pollution readings or claims real-time sensor coverage where none exists. All numbers originate from verified monitoring programs, academic literature, or transparently marked community submissions.',
    },
    {
      title: 'Standardized Measurement Units',
      description: 'Shoreline audits use items per 100-meter transect; river inputs use metric tons/year estimates; open sea gyres use surface concentration metrics. The unit of measurement is always explicitly stated.',
    },
    {
      title: 'Confidence Index Algorithm (0–100)',
      description: 'Calculated as: Confidence = (Source Authority * 0.40) + (Temporal Freshness * 0.30) + (Methodology Rigor * 0.30). Agency-verified transects score 90-100; volunteer audits score 70-89; provisional citizen reports score <70 until validated.',
    },
    {
      title: 'Clear Provenance Badging',
      description: 'Every marker, chart, and modal carries visual color-coded badges classifying the data: Verified Scientific Measurement, Historical Agency Baseline, Hydrodynamic Estimate, or Community Observation.',
    },
  ],
};
