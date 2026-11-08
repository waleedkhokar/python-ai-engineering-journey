import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Pill, 
  Calendar, 
  ShieldAlert, 
  Bot, 
  User as UserIcon, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  FileText, 
  Sparkles, 
  Settings, 
  HelpCircle,
  Home,
  CheckSquare,
  Lock,
  Stethoscope,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { LocalUser } from '../lib/firestoreService';

export type NavigationTab = 
  | 'overview' 
  | 'uploads' 
  | 'reports'
  | 'prescription_analysis'
  | 'medications' 
  | 'reminders'
  | 'checklist' 
  | 'warning_signs' 
  | 'followups' 
  | 'chat' 
  | 'profile' 
  | 'auth'
  | 'landing';

interface SidebarNavigationProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  patientName: string;
  hospitalName: string;
  medicationCount: number;
  warningCount: number;
  followupCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onSelectTab,
  patientName,
  hospitalName,
  medicationCount,
  warningCount,
  followupCount,
  isCollapsed,
  onToggleCollapse
}) => {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() => {
    try {
      const raw = localStorage.getItem('discharge_care_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const navItems = [
    {
      id: 'landing' as NavigationTab,
      label: 'Home & Features',
      icon: Home,
      badge: null,
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'overview' as NavigationTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-blue-100 text-blue-700 border border-blue-200'
    },
    {
      id: 'uploads' as NavigationTab,
      label: 'Create Recovery Plan',
      icon: PlusCircle,
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200'
    },
    {
      id: 'reports' as NavigationTab,
      label: 'Saved Recovery Plans',
      icon: FileText,
      badge: 'Cloud',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    },
    {
      id: 'prescription_analysis' as NavigationTab,
      label: 'Prescription Analysis',
      icon: Stethoscope,
      badge: 'AI',
      badgeColor: 'bg-teal-100 text-teal-800 font-bold'
    },
    {
      id: 'medications' as NavigationTab,
      label: 'Medication Timeline',
      icon: Pill,
      badge: medicationCount > 0 ? `${medicationCount}` : null,
      badgeColor: 'bg-blue-600 text-white font-bold'
    },
    {
      id: 'reminders' as NavigationTab,
      label: 'Reminders & Calendar',
      icon: Calendar,
      badge: followupCount > 0 ? `${followupCount}` : null,
      badgeColor: 'bg-emerald-600 text-white font-bold'
    },
    {
      id: 'checklist' as NavigationTab,
      label: 'Recovery Checklist',
      icon: CheckSquare,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'warning_signs' as NavigationTab,
      label: 'Warning Signs',
      icon: ShieldAlert,
      badge: warningCount > 0 ? `${warningCount}` : null,
      badgeColor: 'bg-rose-500 text-white font-bold animate-pulse'
    },
    {
      id: 'chat' as NavigationTab,
      label: 'AI Discharge Copilot',
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-teal-500 text-white font-black'
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Profile & Settings',
      icon: UserIcon,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'auth' as NavigationTab,
      label: currentUser ? 'Account Auth' : 'Login / Sign Up',
      icon: Lock,
      badge: currentUser ? 'Active' : null,
      badgeColor: 'bg-emerald-500 text-white font-bold'
    }
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-black tracking-tighter text-slate-950 uppercase text-sm">
                    DISCHARGECARE
                  </span>
                  <span className="text-xs font-black text-blue-600">AI</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
                  Enterprise Health
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Item Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`} />
                  {!isCollapsed && (
                    <span className="truncate uppercase tracking-wider text-[11px] font-black">
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`mono text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Patient Profile Card at Bottom */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          {!isCollapsed ? (
            <div 
              onClick={() => onSelectTab('profile')}
              className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                  {patientName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-xs truncate leading-snug">
                    {patientName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {hospitalName}
                  </p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            </div>
          ) : (
            <button 
              onClick={() => onSelectTab('profile')}
              className="w-full flex items-center justify-center p-2 rounded-2xl bg-white border border-slate-200 hover:border-blue-400"
              title={patientName}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                {patientName.slice(0, 2).toUpperCase()}
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2 shadow-lg flex items-center justify-around">
        <button
          onClick={() => onSelectTab('overview')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'overview' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('medications')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors relative ${
            activeTab === 'medications' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Pill className="w-5 h-5 mb-0.5" />
          <span>Meds</span>
          {medicationCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        <button
          onClick={() => onSelectTab('uploads')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'uploads' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <div className="p-2 bg-blue-600 text-white rounded-full -mt-4 shadow-md">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="mt-0.5">New Plan</span>
        </button>

        <button
          onClick={() => onSelectTab('reminders')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'reminders' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Bell className="w-5 h-5 mb-0.5" />
          <span>Reminders</span>
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'profile' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};
