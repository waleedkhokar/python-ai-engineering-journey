/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewMode, Experiment } from './types';
import { EXPERIMENTS_DATA } from './data/experiments';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ExperimentLibraryView } from './components/ExperimentLibraryView';
import { ExperimentDetailsView } from './components/ExperimentDetailsView';
import { AiAssistantView } from './components/AiAssistantView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>('acid-base-titration');
  const [activeExperimentContext, setActiveExperimentContext] = useState<Experiment | null>(null);

  const selectedExperiment = EXPERIMENTS_DATA.find((e) => e.id === selectedExperimentId) || EXPERIMENTS_DATA[0];

  const handleSelectExperiment = (experimentId: string) => {
    setSelectedExperimentId(experimentId);
    setCurrentView('experiment-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAssistantWithContext = (experiment: Experiment) => {
    setActiveExperimentContext(experiment);
    setCurrentView('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeExperimentName={activeExperimentContext?.name}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectExperiment={handleSelectExperiment}
          />
        )}

        {currentView === 'experiments' && (
          <ExperimentLibraryView
            onSelectExperiment={handleSelectExperiment}
          />
        )}

        {currentView === 'experiment-detail' && (
          <ExperimentDetailsView
            experiment={selectedExperiment}
            onBack={() => handleNavigate('experiments')}
            onOpenAssistantWithContext={handleOpenAssistantWithContext}
          />
        )}

        {currentView === 'assistant' && (
          <AiAssistantView
            activeExperimentContext={activeExperimentContext}
            onClearContext={() => setActiveExperimentContext(null)}
            onSelectExperimentContext={(exp) => setActiveExperimentContext(exp)}
            allExperiments={EXPERIMENTS_DATA}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
