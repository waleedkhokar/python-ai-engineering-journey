import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  Square, 
  ListChecks, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  Activity,
  Droplet,
  HeartPulse,
  Apple
} from 'lucide-react';
import { DailyChecklistTask } from '../types';

interface DailyRecoveryChecklistProps {
  tasks: DailyChecklistTask[];
  onToggleTask: (id: string) => void;
  onOpenSourceModal: (quote: string, title: string) => void;
}

export const DailyRecoveryChecklist: React.FC<DailyRecoveryChecklistProps> = ({
  tasks,
  onToggleTask,
  onOpenSourceModal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header & Progress */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white font-black">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black uppercase text-base tracking-widest text-slate-950">
                Daily Recovery Care Checklist
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Day-by-day guided recovery instructions extracted from discharge papers
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 shrink-0 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{completedCount} / {tasks.length} ({completionPercent}%)</span>
          </div>
        </div>

        {/* Heavy Progress Bar */}
        <div className="w-full bg-slate-200 h-3 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 text-xs font-black uppercase tracking-wider text-slate-600">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2.5 rounded-xl transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Items ({tasks.length})
          </button>

          <button
            onClick={() => setActiveCategory('wound_care')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeCategory === 'wound_care'
                ? 'bg-blue-600 text-white font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Wound Care</span>
          </button>

          <button
            onClick={() => setActiveCategory('activity')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeCategory === 'activity'
                ? 'bg-indigo-600 text-white font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity & Mobility</span>
          </button>

          <button
            onClick={() => setActiveCategory('nutrition')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeCategory === 'nutrition'
                ? 'bg-emerald-600 text-white font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Diet & Fluids</span>
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`glass-card rounded-3xl p-5 border transition-all duration-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              task.completed
                ? 'border-emerald-300 bg-emerald-50/30 text-slate-500 accent-border-emerald'
                : 'accent-border hover:border-blue-400'
            }`}
          >
            <div className="flex items-start space-x-4 min-w-0">
              <button
                onClick={() => onToggleTask(task.id)}
                className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Square className="w-7 h-7 text-slate-300 hover:text-blue-600" />
                )}
              </button>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className={`text-base font-black uppercase tracking-wide ${task.completed ? 'line-through text-slate-400' : 'text-slate-950'}`}>
                    {task.title}
                  </h3>
                  <span className="mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                    {task.dayOffset}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700 mt-1.5 leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenSourceModal(task.sourceQuote, task.title)}
              className="text-slate-500 hover:text-slate-900 font-black uppercase tracking-wider text-[11px] hover:underline flex items-center space-x-1 shrink-0 self-end sm:self-center"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Inspect Quote</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
