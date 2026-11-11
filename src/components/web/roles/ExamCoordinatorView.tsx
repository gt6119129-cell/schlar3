import React from 'react';
import { ExaminationManager } from '../../common/ExaminationManager';
import { useSchool } from '../../../context/SchoolContext';
import { getThemeClasses } from '../../../utils/themeHelper';
import { Award, Calendar, CheckSquare, Layers } from 'lucide-react';

export const ExamCoordinatorView: React.FC = () => {
  const { themeColor } = useSchool();
  const themeClasses = getThemeClasses(themeColor);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-blue-50 text-blue-800 border border-blue-200">
              Exam Controller Terminal
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Standards 1–10 CBSE Evaluation Wing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Institutional Examination & Assessment Directorate
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Datesheet scheduling, hall tickets, seating plans, invigilator assignments, mark moderation, and CBSE 9-point report cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Term 2 Examination Cycle
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <ExaminationManager />
      </div>
    </div>
  );
};
