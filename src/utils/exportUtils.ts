import { PollutionObservation } from '../types/pollution';

export function exportToCSV(data: PollutionObservation[], filename = 'aquawatch-pollution-data.csv') {
  if (!data || data.length === 0) return;

  const headers = [
    'ID',
    'Location Name',
    'Waterbody Name',
    'Type',
    'Latitude',
    'Longitude',
    'Country',
    'Region',
    'Report Date',
    'Severity',
    'Severity Score (0-100)',
    'Provenance',
    'Primary Category',
    'Measured Value',
    'Measurement Unit',
    'Data Source',
    'Confidence Score',
    'Methodology',
    'Is Hotspot'
  ];

  const rows = data.map(item => [
    `"${item.id}"`,
    `"${item.locationName.replace(/"/g, '""')}"`,
    `"${item.waterbodyName.replace(/"/g, '""')}"`,
    `"${item.waterbodyType}"`,
    item.coordinates[0],
    item.coordinates[1],
    `"${item.country}"`,
    `"${item.region}"`,
    `"${item.reportedDate}"`,
    `"${item.severity}"`,
    item.severityScore,
    `"${item.provenance}"`,
    `"${item.primaryDebrisCategory}"`,
    item.measuredValue,
    `"${item.measurementUnit}"`,
    `"${item.dataSource.replace(/"/g, '""')}"`,
    item.confidence.overallScore,
    `"${item.methodology.replace(/"/g, '""')}"`,
    item.isHotspot ? 'YES' : 'NO'
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToGeoJSON(data: PollutionObservation[], filename = 'aquawatch-observations.geojson') {
  const geojson = {
    type: 'FeatureCollection',
    metadata: {
      generatedBy: 'AquaWatch Marine & River Plastic Pollution Monitoring',
      timestamp: new Date().toISOString(),
      featureCount: data.length,
      license: 'ODbL / Public Environmental Data',
    },
    features: data.map(item => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.coordinates[1], item.coordinates[0]], // [lng, lat] for GeoJSON
      },
      properties: {
        id: item.id,
        locationName: item.locationName,
        waterbodyName: item.waterbodyName,
        waterbodyType: item.waterbodyType,
        country: item.country,
        region: item.region,
        reportedDate: item.reportedDate,
        severity: item.severity,
        severityScore: item.severityScore,
        provenance: item.provenance,
        primaryDebrisCategory: item.primaryDebrisCategory,
        measuredValue: item.measuredValue,
        measurementUnit: item.measurementUnit,
        dataSource: item.dataSource,
        confidenceScore: item.confidence.overallScore,
        methodology: item.methodology,
        description: item.description,
        isHotspot: !!item.isHotspot
      }
    }))
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
