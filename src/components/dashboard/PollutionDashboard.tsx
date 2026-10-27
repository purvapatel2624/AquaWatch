import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  Flame, 
  Layers, 
  TrendingDown, 
  ShieldCheck, 
  GitCompare, 
  ArrowRightLeft, 
  Filter, 
  Download,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import { usePollution } from '../../context/PollutionContext';
import { PollutionObservation } from '../../types/pollution';
import { SeverityBadge, ProvenanceBadge } from '../common/Badge';
import { exportToCSV } from '../../utils/exportUtils';

export const PollutionDashboard: React.FC<{ onInspect: (loc: PollutionObservation) => void }> = ({ onInspect }) => {
  const { 
    filteredObservations, 
    observations, 
    selectedLocation, 
    setSelectedLocation,
    compareLocation,
    setCompareLocation 
  } = usePollution();

  const [timeRange, setTimeRange] = useState<number>(2023);

  // 1. KPI Aggregates
  const totalReports = filteredObservations.length;
  const criticalHotspots = filteredObservations.filter(o => o.severity === 'Critical').length;
  const highHotspots = filteredObservations.filter(o => o.severity === 'High').length;
  const avgConfidence = Math.round(
    filteredObservations.reduce((acc, curr) => acc + curr.confidence.overallScore, 0) / (totalReports || 1)
  );

  // 2. Plastic Category Aggregate Distribution
  const categorySums = {
    bottles: 0,
    bags: 0,
    packaging: 0,
    fishing_gear: 0,
    microplastics: 0,
    other: 0,
  };

  filteredObservations.forEach(o => {
    categorySums.bottles += o.categoryBreakdown.bottles;
    categorySums.bags += o.categoryBreakdown.bags;
    categorySums.packaging += o.categoryBreakdown.packaging;
    categorySums.fishing_gear += o.categoryBreakdown.fishing_gear;
    categorySums.microplastics += o.categoryBreakdown.microplastics;
    categorySums.other += o.categoryBreakdown.other;
  });

  const categoryChartData = [
    { name: 'Packaging & Sachets', value: categorySums.packaging, color: '#6366f1' },
    { name: 'Plastic Bottles & Caps', value: categorySums.bottles, color: '#0ea5e9' },
    { name: 'Bags & Thin Films', value: categorySums.bags, color: '#f59e0b' },
    { name: 'Fishing Gear & Nets', value: categorySums.fishing_gear, color: '#f43f5e' },
    { name: 'Microplastics (<5mm)', value: categorySums.microplastics, color: '#10b981' },
    { name: 'Other Mixed Debris', value: categorySums.other, color: '#94a3b8' },
  ].filter(item => item.value > 0);

  // 3. Top Hotspots Ranking
  const topHotspotsData = [...filteredObservations]
    .sort((a, b) => b.severityScore - a.severityScore)
    .slice(0, 6)
    .map(o => ({
      name: o.locationName.split(',')[0],
      score: o.severityScore,
      severity: o.severity,
      country: o.country,
      original: o,
    }));

  // 4. Waterbody Type Distribution
  const waterbodyCounts: Record<string, number> = {};
  filteredObservations.forEach(o => {
    waterbodyCounts[o.waterbodyType] = (waterbodyCounts[o.waterbodyType] || 0) + 1;
  });

  const waterbodyChartData = Object.entries(waterbodyCounts).map(([type, count]) => ({
    type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count,
  }));

  // 5. Multi-Site Trend Data (Historical 2019-2023)
  const trendYears = [2019, 2020, 2021, 2022, 2023];
  const trendComparisonData = trendYears.map(year => {
    const point: any = { year };
    observations.slice(0, 4).forEach(loc => {
      const match = loc.historicalTrend?.find(t => t.year === year);
      if (match) {
        // Normalize for visual comparison
        point[loc.locationName.split(',')[0]] = match.value;
      }
    });
    return point;
  });

  // Selected comparison sites
  const locA = selectedLocation || observations[0];
  const locB = compareLocation || observations[1];

  // Category comparison data between Loc A and Loc B
  const comparisonCategoryData = [
    { category: 'Packaging', [locA.locationName.split(',')[0]]: locA.categoryBreakdown.packaging, [locB.locationName.split(',')[0]]: locB.categoryBreakdown.packaging },
    { category: 'Bottles', [locA.locationName.split(',')[0]]: locA.categoryBreakdown.bottles, [locB.locationName.split(',')[0]]: locB.categoryBreakdown.bottles },
    { category: 'Bags', [locA.locationName.split(',')[0]]: locA.categoryBreakdown.bags, [locB.locationName.split(',')[0]]: locB.categoryBreakdown.bags },
    { category: 'Fishing Gear', [locA.locationName.split(',')[0]]: locA.categoryBreakdown.fishing_gear, [locB.locationName.split(',')[0]]: locB.categoryBreakdown.fishing_gear },
    { category: 'Microplastics', [locA.locationName.split(',')[0]]: locA.categoryBreakdown.microplastics, [locB.locationName.split(',')[0]]: locB.categoryBreakdown.microplastics },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-ocean-100 text-ocean-800 border border-ocean-200">
              Aggregated Environmental Metrics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Marine & River Pollution Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Empirical monitoring data synthesized from NOAA MDMAP, UNEP Regional Baselines, and field surveys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(filteredObservations)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Dashboard Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Analyzed Sites</span>
            <Layers className="w-4 h-4 text-ocean-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalReports}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Coastlines, rivers & ocean gyres</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Critical Hotspots</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">{criticalHotspots}</div>
          <p className="text-xs text-rose-600/80 mt-1 font-medium">
            Requires urgent intervention
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Elevated Stress Sites</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{criticalHotspots + highHotspots}</div>
          <p className="text-xs text-slate-400 mt-1">
            {Math.round(((criticalHotspots + highHotspots) / (totalReports || 1)) * 100)}% of monitored sites
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Avg Data Confidence</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{avgConfidence}<span className="text-base font-semibold text-slate-400">/100</span></div>
          <p className="text-xs text-emerald-700/80 mt-1 font-medium">
            High scientific rigor
          </p>
        </div>

      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Category Breakdown Donut */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Plastic Waste Categories
              </h3>
              <p className="text-xs text-slate-500">Aggregate item composition across monitored environments</p>
            </div>
            <span className="text-xs font-bold text-ocean-600 bg-ocean-50 px-2.5 py-1 rounded-full">
              6 Categories
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} total percentage points`, 'Tally Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
            {categoryChartData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Top Hotspots Ranking */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Locations with Highest Pollution
              </h3>
              <p className="text-xs text-slate-500">Ranked by standardized severity score (0–100)</p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 fill-rose-500" />
              Hotspots
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topHotspotsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val}/100 (${item.payload.severity})`,
                    'Severity Score',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {topHotspotsData.map((entry, index) => (
                    <Cell 
                      key={`bar-${index}`} 
                      fill={entry.score >= 90 ? '#ef4444' : entry.score >= 70 ? '#f97316' : '#f59e0b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Pasig River and GPGP core show extreme stress</span>
            <span className="font-medium text-slate-700">Click marker on map to inspect</span>
          </div>
        </div>

      </div>

      {/* Chart 3: Historical Trends Across Key Waterways */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Longitudinal Observation Trends (2019 – 2023)
            </h3>
            <p className="text-xs text-slate-500">
              Tracks multi-year baseline changes in monitored river systems, coastlines, and oceanic zones.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Focus Year:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[2019, 2020, 2021, 2022, 2023].map((y) => (
                <button
                  key={y}
                  onClick={() => setTimeRange(y)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                    timeRange === y ? 'bg-white text-ocean-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendComparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Kamilo Beach" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Versova Beach" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Rhine River Estuary" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-ocean-50/50 rounded-2xl p-3 border border-ocean-100 text-xs text-ocean-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-ocean-600 shrink-0 mt-0.5" />
          <p>
            <strong>Observation Insight:</strong> Versova Beach demonstrates an encouraging declining debris trend following sustained community volunteer mobilization and municipal trash boom installations, whereas pelagic convergence sites like Kamilo Beach maintain steady incoming flux from the North Pacific Gyre.
          </p>
        </div>
      </div>

      {/* Location Comparison Tool */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Scientific Location Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Select any two monitored locations to analyze differences in debris composition and environmental stress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Compare:</span>
            <select
              value={locA.id}
              onChange={(e) => {
                const found = observations.find(o => o.id === e.target.value);
                if (found) setSelectedLocation(found);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
            >
              {observations.map(o => (
                <option key={`opt-a-${o.id}`} value={o.id}>{o.locationName}</option>
              ))}
            </select>
            <span className="text-slate-400 font-bold">vs</span>
            <select
              value={locB.id}
              onChange={(e) => {
                const found = observations.find(o => o.id === e.target.value);
                if (found) setCompareLocation(found);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
            >
              {observations.map(o => (
                <option key={`opt-b-${o.id}`} value={o.id}>{o.locationName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Location A Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-600 bg-ocean-50 px-2 py-0.5 rounded border border-ocean-200">
                  Location 1
                </span>
                <h4 className="font-extrabold text-base text-slate-900 mt-1">{locA.locationName}</h4>
                <p className="text-xs text-slate-500">{locA.country} • {locA.waterbodyType}</p>
              </div>
              <SeverityBadge severity={locA.severity} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400">Severity Score</span>
                <div className="text-xl font-bold text-slate-900">{locA.severityScore}/100</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400">Dominant Debris</span>
                <div className="text-sm font-bold text-slate-900 capitalize">{locA.primaryDebrisCategory.replace('_', ' ')}</div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Measured Value:</span>
                <span className="font-bold text-slate-800">{locA.measuredValue.toLocaleString()} {locA.measurementUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source:</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px]">{locA.dataSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-emerald-600">{locA.confidence.overallScore}/100</span>
              </div>
            </div>

            <button
              onClick={() => onInspect(locA)}
              className="w-full py-2 text-xs font-bold text-ocean-700 bg-ocean-50 hover:bg-ocean-100 rounded-xl transition-colors"
            >
              Inspect Complete Dossier
            </button>
          </div>

          {/* Location B Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-marine-600 bg-marine-50 px-2 py-0.5 rounded border border-marine-200">
                  Location 2
                </span>
                <h4 className="font-extrabold text-base text-slate-900 mt-1">{locB.locationName}</h4>
                <p className="text-xs text-slate-500">{locB.country} • {locB.waterbodyType}</p>
              </div>
              <SeverityBadge severity={locB.severity} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400">Severity Score</span>
                <div className="text-xl font-bold text-slate-900">{locB.severityScore}/100</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400">Dominant Debris</span>
                <div className="text-sm font-bold text-slate-900 capitalize">{locB.primaryDebrisCategory.replace('_', ' ')}</div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Measured Value:</span>
                <span className="font-bold text-slate-800">{locB.measuredValue.toLocaleString()} {locB.measurementUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source:</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px]">{locB.dataSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-emerald-600">{locB.confidence.overallScore}/100</span>
              </div>
            </div>

            <button
              onClick={() => onInspect(locB)}
              className="w-full py-2 text-xs font-bold text-marine-700 bg-marine-50 hover:bg-marine-100 rounded-xl transition-colors"
            >
              Inspect Complete Dossier
            </button>
          </div>

        </div>

        {/* Side-by-side category chart */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Comparative Debris Category Profiles (%)
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonCategoryData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey={locA.locationName.split(',')[0]} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey={locB.locationName.split(',')[0]} fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
