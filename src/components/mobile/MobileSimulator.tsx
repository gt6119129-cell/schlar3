import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  ArrowLeft,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
  ShieldCheck
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TeacherMobileView } from './TeacherMobileView';
import { ParentMobileView } from './ParentMobileView';
import { getThemeClasses } from '../../utils/themeHelper';
import { RolePermissionsModal } from '../common/RolePermissionsModal';

export const MobileSimulator: React.FC = () => {
  const {
    currentRole,
    phoneFrameMode,
    setPhoneFrameMode,
    signOut,
    switchRole,
    themeColor
  } = useSchool();

  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const themeClasses = getThemeClasses(themeColor);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Simulator Control Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Role Hub</span>
          </button>
          <div className="text-xs">
            <span className="font-bold text-white">
              {currentRole === 'teacher_mobile' ? 'Teacher Mobile Experience' : 'Parent Mobile Experience'}
            </span>
            <span className="text-slate-400 hidden sm:inline ml-2">· Greenfield International School</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* RBAC Inspection Button */}
          <button
            onClick={() => setPermissionsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/60 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Permissions & Scope</span>
          </button>

          {/* Toggle between Phone Frame and Responsive Canvas */}
          <button
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Toggle between phone frame device view and responsive width"
          >
            {phoneFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Expand Canvas</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Phone Frame View</span>
              </>
            )}
          </button>

          {/* Quick Switch between the 2 mobile experiences */}
          <button
            onClick={() => switchRole(currentRole === 'teacher_mobile' ? 'parent_mobile' : 'teacher_mobile')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Switch to {currentRole === 'teacher_mobile' ? 'Parent App' : 'Teacher App'}
          </button>
        </div>
      </header>

      {/* Simulator Canvas */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {phoneFrameMode ? (
          /* Phone Frame Container */
          <div
            className="relative w-full sm:max-w-[420px] h-[calc(100vh-62px)] sm:h-[800px] bg-slate-950 rounded-none sm:rounded-[44px] p-0 sm:p-3 shadow-2xl border-0 sm:border-4 border-slate-700 ring-0 sm:ring-1 ring-slate-800 flex flex-col overflow-hidden"
            style={{ transform: 'translateZ(0)' }}
          >
            {/* Phone Top Notch / Status Bar (shown on desktop simulation) */}
            <div className="hidden sm:flex bg-slate-950 px-6 pt-2 pb-1.5 items-center justify-between text-[11px] text-slate-400 font-semibold select-none z-40 shrink-0">
              <span className="font-mono text-white">9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Simulated Phone Screen Viewport */}
            <div
              className="flex-1 bg-slate-50 rounded-none sm:rounded-[32px] overflow-hidden relative flex flex-col min-h-0"
              style={{ transform: 'translateZ(0)' }}
            >
              {currentRole === 'teacher_mobile' ? <TeacherMobileView /> : <ParentMobileView />}
            </div>

            {/* Bottom Home Indicator Bar (shown on desktop simulation) */}
            <div className="hidden sm:flex pt-2 pb-1 justify-center shrink-0">
              <div className="w-28 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Canvas Responsive View */
          <div
            className="w-full max-w-lg h-full bg-slate-50 rounded-none sm:rounded-2xl shadow-xl overflow-hidden border border-slate-800"
            style={{ transform: 'translateZ(0)' }}
          >
            {currentRole === 'teacher_mobile' ? <TeacherMobileView /> : <ParentMobileView />}
          </div>
        )}
      </main>

      {/* Role Permissions & RBAC Modal */}
      <RolePermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
      />
    </div>
  );
};
