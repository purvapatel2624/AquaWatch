import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Waves, 
  Fish, 
  Factory, 
  Trash2, 
  Wind,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const LearnSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const transportSteps = [
    {
      title: '1. Inland Production & Mismanaged Waste',
      subtitle: 'Terrestrial Origin Point',
      description: 'Over 80% of marine plastics originate from land-based activities. High-density urban areas lacking closed-loop municipal collection generate uncollected single-use packaging, PET bottles, and films that accumulate in roadside ditches and open dumps.',
      keyFact: 'Globally, ~22% of total plastic waste generated is mismanaged, prone to wind and rainwater transport.',
      icon: Factory,
      color: 'bg-amber-500',
    },
    {
      title: '2. Stormwater Runoff & River Ingress',
      subtitle: 'Freshwater Conduits',
      description: 'Precipitation washes buoyant plastics into stormwater pipes and tributaries. Urban river corridors (such as the Pasig, Citarum, and Ganges) act as express conveyor belts, funneling tons of macroplastics per day toward sea outlets.',
      keyFact: 'Studies show that roughly 1,000 rivers worldwide emit nearly 80% of all global riverine plastic entering oceans.',
      icon: Waves,
      color: 'bg-teal-500',
    },
    {
      title: '3. Estuaries, Mangroves & Coastal Tidal Wash',
      subtitle: 'Tidal Accumulation Zone',
      description: 'At river mouths, brackish estuarine zones and mangrove root networks trap significant floating debris. Incoming ocean tides push waste back onto public beaches and mudflats, causing massive stranding events during seasonal monsoons.',
      keyFact: 'Tidal mangrove forests retain up to 30% of coastal river plastic before it escapes into offshore open waters.',
      icon: Trash2,
      color: 'bg-sky-500',
    },
    {
      title: '4. Pelagic Currents & Oceanic Gyres',
      subtitle: 'Open Sea Convergence',
      description: 'Plastics escaping the coastal zone are swept by Coriolis forces into five major oceanic gyres (e.g. Great Pacific Garbage Patch). Solar UV radiation and wave action physically fragment macro items into trillions of persistent microplastics (<5mm).',
      keyFact: 'It can take centuries for dense polymers to fully mineralize; instead, they continually fragment into micro and nano particles.',
      icon: Wind,
      color: 'bg-indigo-500',
    },
  ];

  const ecologicalImpacts = [
    {
      title: 'Physical Entanglement & Ghost Fishing',
      description: 'Abandoned monofilament lines, commercial trawl nets, and packing straps continuously trap seals, sea turtles, sharks, and seabirds, leading to drowning or starvation.',
      severity: 'Severe Acute Impact',
      icon: Fish,
    },
    {
      title: 'Microplastic Ingestion & False Satiation',
      description: 'Filter feeders (whales, oysters) and planktivorous fish mistake plastic fragments for zooplankton. Particles fill stomachs without nutritional value, causing chronic malnutrition.',
      severity: 'Widespread Chronic Impact',
      icon: AlertTriangle,
    },
    {
      title: 'Chemical Leaching & Toxic Sorption',
      description: 'Plastics leach chemical additives (phthalates, bisphenols) and absorb persistent organic pollutants (PCBs, DDT) from surrounding water, introducing toxins into marine food webs.',
      severity: 'Bioaccumulation Risk',
      icon: Factory,
    },
    {
      title: 'Vector for Invasive Alien Species',
      description: 'Floating, durable plastic rafts allow barnacles, algae, and pathogens to drift across entire ocean basins, colonizing and disrupting vulnerable native reef ecosystems.',
      severity: 'Biodiversity Disruption',
      icon: Waves,
    },
  ];

  const reductionMeasures = [
    {
      category: 'Individual & Student Actions',
      items: [
        'Adopt durable reusables (stainless bottles, cloth bags, metal tiffins) to eliminate high-frequency single-use items.',
        'Install fiber-capturing laundry bags or lint filters to stop synthetic microfibers entering sewer systems.',
        'Participate in standardized shoreline citizen science audits (NOAA MDMAP or ICC) to generate verifiable data.',
      ],
    },
    {
      category: 'Community & Municipal Solutions',
      items: [
        'Deploy physical floating trash barriers (interceptor booms) at urban river mouths prior to coastal discharge.',
        'Implement automated trash capture screens on municipal stormwater outfalls.',
        'Establish deposit-return systems (DRS) for beverage bottles with high return incentives (>90% recovery).',
      ],
    },
    {
      category: 'Systemic & Corporate Responsibility',
      items: [
        'Enforce legally binding Extended Producer Responsibility (EPR) requiring FMCG brands to fund collection.',
        'Phase out multi-layer non-recyclable sachets in favor of refillable dispensing systems.',
        'Mandate satellite tagging and port buy-back programs for commercial fishing gear to halt ghost net dumping.',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            Environmental Science Education
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How Plastic Waste Affects Aquatic Ecosystems
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Understanding the lifecycle, transport physics, and systemic solutions to stop the global marine litter crisis.
        </p>
      </div>

      {/* Interactive Pathway: River to Ocean */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-600">The Hydrodynamic Journey</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            How Plastic Waste Travels from Rivers to the Ocean
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click through the stages below to see how inland land-use decisions directly impact open ocean gyres.
          </p>
        </div>

        {/* Step Navigation Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {transportSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-ocean-50 border-ocean-300 shadow-sm ring-1 ring-ocean-400'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl ${step.color} text-white flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{step.title}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">{step.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Spotlight */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-700 bg-ocean-100 px-2.5 py-0.5 rounded-full">
              Detailed Stage Analysis
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {transportSteps[activeStep].title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {transportSteps[activeStep].description}
          </p>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-ocean-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ocean-500 shrink-0" />
            <span>Empirical Fact: {transportSteps[activeStep].keyFact}</span>
          </div>
        </div>
      </div>

      {/* Ecological Impacts Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Biodiversity Consequences</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            Documented Impacts on Aquatic Wildlife & Habitats
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ecologicalImpacts.map((impact, idx) => {
            const Icon = impact.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">{impact.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{impact.description}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 self-start">
                  {impact.severity}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Reduction Measures */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Action Matrix</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            Practical Waste-Reduction Solutions That Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reductionMeasures.map((sec, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {sec.category}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {sec.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trustworthy Scientific Resources */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-400">Trusted Literature & Data</span>
          <h2 className="text-lg font-extrabold text-white mt-1">
            Authoritative Environmental Organizations & Research Portals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dive deeper with peer-reviewed research and official monitoring guidelines:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <a
            href="https://marinedebris.noaa.gov/"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <span className="font-bold text-white block">NOAA Marine Debris Program</span>
              <span className="text-slate-400 text-[11px]">US Shoreline Monitoring Protocols</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://www.unep.org/intergovernmental-negotiating-committee-plastic-pollution"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <span className="font-bold text-white block">UNEP Global Plastics Treaty (INC)</span>
              <span className="text-slate-400 text-[11px]">Legally binding global treaty docs</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://oceanconservancy.org/trash-free-seas/"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <span className="font-bold text-white block">Ocean Conservancy Trash Free Seas</span>
              <span className="text-slate-400 text-[11px]">35+ Year Beach Cleanup Audits</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

    </div>
  );
};
