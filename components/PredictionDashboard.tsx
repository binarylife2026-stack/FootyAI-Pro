
import React from 'react';
import { AnalysisResponse, PredictionItem, GroundingSource } from '../types';

interface PredictionDashboardProps {
  data: AnalysisResponse;
}

const ProbabilityBadge: React.FC<{ probability: number }> = ({ probability }) => {
  const getStyle = (p: number) => {
    if (p >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (p >= 60) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (p >= 40) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-slate-700/30 text-slate-400 border-slate-600/30';
  };

  return (
    <span className={`text-[11px] font-black px-2 py-0.5 rounded border ${getStyle(probability)}`}>
      {probability}%
    </span>
  );
};

const MarketRow: React.FC<{ item: PredictionItem }> = ({ item }) => {
  return (
    <div className="group p-4 border-b border-slate-800/40 last:border-0 hover:bg-slate-800/20 transition-all">
      <div className="flex justify-between items-start gap-3">
        <h4 className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors leading-tight">
          {item.marketName}
        </h4>
        <ProbabilityBadge probability={item.probability} />
      </div>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1.5 italic">
        {item.explanation}
      </p>
      <div className="w-full bg-slate-800/50 rounded-full h-1 mt-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            item.probability >= 70 ? 'bg-blue-500' : 'bg-slate-600'
          }`}
          style={{ width: `${item.probability}%` }}
        />
      </div>
    </div>
  );
};

export const PredictionDashboard: React.FC<PredictionDashboardProps> = ({ data }) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Live Search Analysis Active
        </div>
        <div className="flex items-center justify-center gap-6 md:gap-16 px-4">
          <div className="text-right flex-1 min-w-0">
            <h2 className="text-xl md:text-5xl font-black text-white tracking-tighter uppercase truncate">{data.homeTeam}</h2>
          </div>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900">
              <span className="text-slate-500 font-black text-lg italic">VS</span>
            </div>
          </div>
          <div className="text-left flex-1 min-w-0">
            <h2 className="text-xl md:text-5xl font-black text-white tracking-tighter uppercase truncate">{data.awayTeam}</h2>
          </div>
        </div>
      </header>

      {/* Sources Section */}
      {data.sources && data.sources.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border-white/5 mx-4">
          <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Live Data Grounding Sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 px-3 py-1.5 rounded-xl text-[10px] text-slate-300 transition-colors flex items-center gap-2"
              >
                <span className="truncate max-w-[150px]">{source.title}</span>
                <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        {data.categories.map((category, idx) => (
          <div key={idx} className="glass-card rounded-3xl overflow-hidden border-white/5 flex flex-col shadow-2xl">
            <div className="bg-slate-800/60 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.1em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {category.title}
              </h3>
              <span className="text-[9px] font-black text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {category.items.length} Options
              </span>
            </div>
            <div className="flex-1 bg-slate-900/40">
              {category.items.map((item, i) => (
                <MarketRow key={i} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-3xl border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 mx-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-tight">Verified Web Data Analysis</h4>
            <p className="text-slate-500 text-xs">AI has cross-referenced real-time H2H stats and news.</p>
          </div>
        </div>
        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          Powered by Gemini Google Search tool
        </div>
      </div>
    </div>
  );
};
