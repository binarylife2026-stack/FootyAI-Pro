
import React, { useState } from 'react';
import { MatchInput } from '../types';

interface MatchFormProps {
  onAnalyze: (input: MatchInput) => void;
  isLoading: boolean;
}

const SPORTS = [
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'cricket', label: 'Cricket', icon: '🏏' },
  { id: 'basketball', label: 'Basketball', icon: '🏀' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'hockey', label: 'Hockey', icon: '🏑' },
  { id: 'baseball', label: 'Baseball', icon: '⚾' },
  { id: 'table tennis', label: 'Table Tennis', icon: '🏓' }
];

export const MatchForm: React.FC<MatchFormProps> = ({ onAnalyze, isLoading }) => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [sport, setSport] = useState('football');
  const [league, setLeague] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeTeam && awayTeam) {
      onAnalyze({ homeTeam, awayTeam, sport, league });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto glass-card p-6 rounded-2xl shadow-2xl space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        {SPORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSport(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
              sport === s.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Home / Team 1</label>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            placeholder="Team A"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Away / Team 2</label>
          <input
            type="text"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            placeholder="Team B"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Tournament Info</label>
        <input
          type="text"
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          placeholder="e.g. World Cup, IPL, NBA"
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 ${
          isLoading 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing Live Stats...</span>
          </span>
        ) : (
          'Generate Prediction Engine'
        )}
      </button>
    </form>
  );
};
