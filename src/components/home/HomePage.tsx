import React from 'react';
import {
  Waves,
  MapPin,
  BarChart3,
  Sparkles,
  Globe,
  Users,
  Database,
  Brain,
  Search,
  TrendingUp,
  Megaphone,
  ArrowRight,
  ChevronRight,
  Droplets,
  Shell,
  Anchor,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-ocean-950 via-ocean-900 to-marine-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Animated gradient orbs */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-ocean-600/20 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-marine-500/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-48 left-1/4 w-[400px] h-[400px] rounded-full bg-ocean-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          {/* Floating decorative icons */}
          <Droplets className="absolute top-[15%] left-[10%] w-8 h-8 text-ocean-400/20 animate-bounce" style={{ animationDuration: '3s' }} />
          <Shell className="absolute top-[25%] right-[15%] w-10 h-10 text-marine-400/15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          <Anchor className="absolute bottom-[30%] left-[8%] w-9 h-9 text-ocean-300/10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
          <Waves className="absolute bottom-[20%] right-[10%] w-12 h-12 text-marine-300/15 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }} />
        </div>

        {/* Wave bottom border */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z" fill="rgb(248 250 252)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-ocean-200 text-xs font-semibold mb-8">
            <Waves className="w-4 h-4 text-marine-400" />
            Open-Source Marine Pollution Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-ocean-200 to-marine-300 bg-clip-text text-transparent">
              Track &amp; Fight
            </span>
            <br />
            <span className="bg-gradient-to-r from-ocean-300 via-marine-300 to-marine-400 bg-clip-text text-transparent">
              Aquatic Plastic Pollution
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ocean-200/80 leading-relaxed mb-10 font-medium">
            AquaWatch uses verified scientific datasets to track marine &amp; river plastic pollution globally — empowering researchers, NGOs, and citizens with real-time data and AI-powered insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('map')}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-ocean-600 to-marine-500 hover:from-ocean-500 hover:to-marine-400 shadow-lg shadow-ocean-600/30 hover:shadow-xl hover:shadow-ocean-500/40 transition-all active:scale-95 border border-white/10"
            >
              <MapPin className="w-5 h-5" />
              Explore the Map
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-extrabold text-white/90 bg-white/10 hover:bg-white/[0.15] backdrop-blur-sm border border-white/15 hover:border-white/25 transition-all active:scale-95"
            >
              <BarChart3 className="w-5 h-5 text-marine-300" />
              View Dashboard
              <ChevronRight className="w-4 h-4 text-white/50 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative -mt-1 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: '30+', label: 'Monitored Sites', icon: MapPin, color: 'ocean' },
              { value: '15+', label: 'Countries', icon: Globe, color: 'marine' },
              { value: '5', label: 'Verified Sources', icon: Database, color: 'ocean' },
              { value: 'Real-Time', label: 'AI Insights', icon: Brain, color: 'marine' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              const isOcean = stat.color === 'ocean';
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-glass border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isOcean
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'bg-marine-50 text-marine-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-xl font-extrabold ${
                      isOcean ? 'text-ocean-700' : 'text-marine-700'
                    }`}>
                      {stat.value}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocean-100 text-ocean-700 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Key Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything You Need to Monitor Pollution
            </h2>
            <p className="max-w-xl mx-auto text-slate-500 text-sm sm:text-base font-medium">
              Powerful tools built on verified scientific data, designed for researchers, NGOs, and concerned citizens worldwide.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: MapPin,
                title: 'Interactive Pollution Map',
                description: 'Explore global pollution hotspots with severity-based markers, filterable layers, and detailed scientific data for every monitored site.',
                gradient: 'from-ocean-600 to-ocean-500',
                bg: 'bg-ocean-50',
                accent: 'text-ocean-600',
                onClick: () => onNavigate('map'),
              },
              {
                icon: BarChart3,
                title: 'Scientific Dashboard',
                description: 'Charts, trends, and comparative data analysis tools that let you visualize pollution patterns across regions, time periods, and pollutant types.',
                gradient: 'from-marine-600 to-marine-500',
                bg: 'bg-marine-50',
                accent: 'text-marine-600',
                onClick: () => onNavigate('dashboard'),
              },
              {
                icon: Sparkles,
                title: 'AI-Powered Insights',
                description: 'Machine learning analysis of pollution patterns and predictions — from anomaly detection to trend forecasting and actionable recommendations.',
                gradient: 'from-ocean-700 to-marine-600',
                bg: 'bg-gradient-to-br from-ocean-50 to-marine-50',
                accent: 'text-ocean-700',
                onClick: () => onNavigate('insights'),
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <button
                  key={i}
                  onClick={feature.onClick}
                  className="group text-left bg-white rounded-2xl p-7 border border-slate-100 shadow-glass hover:shadow-xl transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:ring-offset-2"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-7 h-7 ${feature.accent}`} />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-ocean-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold ${feature.accent} group-hover:gap-2 transition-all`}>
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-marine-100 text-marine-700 text-xs font-bold mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Three Simple Steps
            </h2>
            <p className="max-w-xl mx-auto text-slate-500 text-sm sm:text-base font-medium">
              From exploration to action — here's how AquaWatch empowers you to make a difference.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Explore the Map',
                description: 'Browse verified pollution monitoring sites worldwide. Filter by severity, pollutant type, or region to find the data you need.',
                color: 'ocean',
              },
              {
                step: '02',
                icon: TrendingUp,
                title: 'Analyze the Data',
                description: 'Use our dashboard for trends, comparisons, and exports. Dive deep into scientific observations with powerful visualization tools.',
                color: 'marine',
              },
              {
                step: '03',
                icon: Megaphone,
                title: 'Take Action',
                description: 'Report pollution sightings, join community cleanups, and contribute to open science. Every data point helps protect our waters.',
                color: 'ocean',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const isOcean = item.color === 'ocean';
              return (
                <div key={i} className="relative text-center group">
                  {/* Connector line (between cards on desktop) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  )}

                  {/* Step number + Icon */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isOcean ? 'bg-ocean-50' : 'bg-marine-50'
                    } group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${isOcean ? 'text-ocean-600' : 'text-marine-600'}`} />
                    </div>
                    <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center text-white ${
                      isOcean ? 'bg-ocean-600' : 'bg-marine-600'
                    }`}>
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION SECTION ─── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-800 to-marine-900" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-ocean-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-marine-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-ocean-200 text-xs font-semibold mb-6">
            <Users className="w-4 h-4 text-marine-400" />
            Community
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Join the AquaWatch Community
          </h2>

          <p className="max-w-lg mx-auto text-ocean-200/70 text-sm sm:text-base font-medium leading-relaxed mb-10">
            Whether you're a marine scientist, an environmental NGO, or a concerned citizen — your contributions matter.
            Help us build the most comprehensive open-source water pollution database on the planet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuth}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-extrabold text-ocean-900 bg-white hover:bg-ocean-50 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Get Started — It's Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('map')}
              className="text-sm font-bold text-ocean-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              Explore as Guest
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
