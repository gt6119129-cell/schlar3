import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Library,
  Clock
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onSelectStudent?: (studentId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectStudent
}) => {
  const { students, teachers, currentRole, showToast } = useSchool();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search Results
  const filteredStudents = useMemo(() => {
    if (!query.trim()) return students.slice(0, 4);
    const q = query.toLowerCase();
    return students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.admissionNo.toLowerCase().includes(q) ||
      s.rollNo.toString() === q ||
      s.parentName.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [students, query]);

  const filteredTeachers = useMemo(() => {
    if (!query.trim()) return teachers.slice(0, 3);
    const q = query.toLowerCase();
    return teachers.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.empId.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.designation.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [teachers, query]);

  // Modules searchable based on role
  const quickModules = useMemo(() => {
    const list = [
      { id: 'dashboard', label: 'Executive Dashboard', category: 'Overview', icon: BookOpen },
      { id: 'students', label: 'Student Directory & Dossiers', category: 'Registry', icon: GraduationCap },
      { id: 'teachers', label: 'Faculty & HR Staff Roster', category: 'Human Resources', icon: Users },
      { id: 'timetable', label: 'Timetable Coordination Master', category: 'Academics', icon: Calendar },
      { id: 'exams', label: 'Examination & Assessment Records', category: 'Academics', icon: FileText },
      { id: 'finance', label: 'Bursar & Fee Collection Ledger', category: 'Finance', icon: DollarSign },
      { id: 'notices', label: 'Institutional Circulars & Notices', category: 'Campus', icon: FileText },
      { id: 'reports', label: 'Compliance & Academic Reports', category: 'Analytics', icon: FileText }
    ];
    if (!query.trim()) return list.slice(0, 4);
    const q = query.toLowerCase();
    return list.filter(m => m.label.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Quick search students, faculty, admissions, or jump to modules..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Module Navigation */}
          {quickModules.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Quick Navigation & Workspaces
              </div>
              <div className="space-y-1">
                {quickModules.map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectTab(m.id);
                        onClose();
                        showToast(`Navigated to ${m.label}`, 'info');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-700">{m.label}</div>
                          <div className="text-[10px] text-slate-400">{m.category}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student Matches */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Students ({filteredStudents.length} matches)
              </div>
              <div className="space-y-1">
                {filteredStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectTab('students');
                      if (onSelectStudent) onSelectStudent(s.id);
                      onClose();
                      showToast(`Viewing student record: ${s.name}`, 'info');
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        #{s.rollNo}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {s.admissionNo} · Standard {s.standard}-{s.section} · Guardian: {s.parentName}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50">
                      {s.attendanceRate}% Att.
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Faculty / Staff Matches */}
          {filteredTeachers.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Faculty & Personnel ({filteredTeachers.length} matches)
              </div>
              <div className="space-y-1">
                {filteredTeachers.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTab('teachers');
                      onClose();
                      showToast(`Viewing staff record: ${t.name}`, 'info');
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-700">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {t.empId} · {t.designation} ({t.department})
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {t.phone}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Search scoped to Greenfield International School institutional database</span>
          </div>
          <span className="hidden sm:inline">Use ↑↓ keys to browse</span>
        </div>
      </div>
    </div>
  );
};
