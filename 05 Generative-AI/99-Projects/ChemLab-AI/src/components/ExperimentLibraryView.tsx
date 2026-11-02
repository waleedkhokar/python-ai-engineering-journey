import React, { useState, useMemo } from 'react';
import { Search, Filter, FlaskConical, Beaker, Sparkles, Flame, Activity, ArrowRight, BookOpen } from 'lucide-react';
import { EXPERIMENTS_DATA } from '../data/experiments';
import { Experiment } from '../types';

interface ExperimentLibraryViewProps {
  onSelectExperiment: (experimentId: string) => void;
}

export const ExperimentLibraryView: React.FC<ExperimentLibraryViewProps> = ({ onSelectExperiment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(EXPERIMENTS_DATA.map((exp) => exp.category)));
    return ['All', ...cats];
  }, []);

  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS_DATA.filter((exp) => {
      // Category filter
      if (selectedCategory !== 'All' && exp.category !== selectedCategory) {
        return false;
      }
      // Search query filter (name, category, description, keywords)
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = exp.name.toLowerCase().includes(q);
      const matchCat = exp.category.toLowerCase().includes(q);
      const matchDesc = exp.description.toLowerCase().includes(q);
      const matchKeywords = exp.keywords.some((kw) => kw.toLowerCase().includes(q));
      return matchName || matchCat || matchDesc || matchKeywords;
    });
  }, [searchQuery, selectedCategory]);

  const getExperimentIcon = (id: string) => {
    switch (id) {
      case 'acid-base-titration':
        return <FlaskConical className="w-6 h-6 text-teal-600" />;
      case 'standard-solution-prep':
        return <Beaker className="w-6 h-6 text-emerald-600" />;
      case 'qualitative-analysis-cations':
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
      case 'flame-test':
        return <Flame className="w-6 h-6 text-amber-600" />;
      case 'determination-of-ph':
        return <Activity className="w-6 h-6 text-purple-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-teal-600" />;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'Volumetric Analysis':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Solution Preparation':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Inorganic Chemistry':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Qualitative Analysis':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Physical Chemistry':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>Undergraduate Chemistry Curriculum</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experiment Library
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Access structured experiment guidelines, step-by-step procedures, reagents, apparatus lists, expected observations, common mistakes, and interactive AI viva prep.
        </p>

        {/* Search & Category Filter Controls */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments by name, category, reagents, or keywords (e.g. titration, pH, flame, cations)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              id="experiment-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-700 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none cursor-pointer"
              id="category-filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills bar for desktop */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
            id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Experiments Grid */}
      {filteredExperiments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No experiments found</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            We couldn't find any experiments matching "{searchQuery}". Try searching with another keyword or resetting the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-teal-600 text-white font-semibold text-xs rounded-lg hover:bg-teal-700 transition-colors"
          >
            Reset Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.map((exp: Experiment) => (
            <div
              key={exp.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-teal-500 transition-all flex flex-col justify-between space-y-4 group"
              id={`experiment-card-${exp.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getBadgeColor(exp.category)}`}>
                    {exp.category}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-teal-50 transition-colors">
                    {getExperimentIcon(exp.id)}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-xl group-hover:text-teal-700 transition-colors">
                  {exp.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {exp.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {exp.keywords.slice(0, 4).map((kw) => (
                    <span key={kw} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectExperiment(exp.id)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-teal-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-teal-600"
                  id={`view-experiment-btn-${exp.id}`}
                >
                  <span>View Experiment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
