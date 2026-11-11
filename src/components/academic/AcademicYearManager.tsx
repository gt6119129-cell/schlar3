import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit2,
  Archive,
  Info,
  X,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AcademicYear, AcademicTerm } from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';

export const AcademicYearManager: React.FC = () => {
  const {
    academicYears,
    activeAcademicYearId,
    setActiveAcademicYearId,
    addAcademicYear,
    updateAcademicYear,
    archiveAcademicYear,
    themeColor,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  const [expandedYearId, setExpandedYearId] = useState<string | null>(activeAcademicYearId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  // Year Form State
  const [formName, setFormName] = useState('2027–2028');
  const [formCode, setFormCode] = useState('AY-2027-28');
  const [formStartDate, setFormStartDate] = useState('2027-06-01');
  const [formEndDate, setFormEndDate] = useState('2028-04-30');
  const [formStatus, setFormStatus] = useState<AcademicYear['status']>('upcoming');
  const [formDescription, setFormDescription] = useState('Scheduled upcoming academic session.');
  const [formWorkingDays, setFormWorkingDays] = useState(224);
  const [formTerms, setFormTerms] = useState<AcademicTerm[]>([
    { id: 't1', name: 'Term 1', code: 'T1', startDate: '2027-06-01', endDate: '2027-10-15', status: 'upcoming' },
    { id: 't2', name: 'Term 2', code: 'T2', startDate: '2027-10-25', endDate: '2028-02-28', status: 'upcoming' },
    { id: 't3', name: 'Term 3', code: 'T3', startDate: '2028-03-05', endDate: '2028-04-30', status: 'upcoming' }
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingYear(null);
    setFormName('2027–2028');
    setFormCode('AY-2027-28');
    setFormStartDate('2027-06-01');
    setFormEndDate('2028-04-30');
    setFormStatus('upcoming');
    setFormDescription('Upcoming academic session intake and curriculum schedule.');
    setFormWorkingDays(226);
    setFormTerms([
      { id: 't-new-1', name: 'Term 1 (Foundational)', code: 'T1', startDate: '2027-06-01', endDate: '2027-10-15', status: 'upcoming' },
      { id: 't-new-2', name: 'Term 2 (Intermediate)', code: 'T2', startDate: '2027-10-25', endDate: '2028-02-28', status: 'upcoming' },
      { id: 't-new-3', name: 'Term 3 (Annual Finals)', code: 'T3', startDate: '2028-03-05', endDate: '2028-04-30', status: 'upcoming' }
    ]);
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setFormName(year.name);
    setFormCode(year.code);
    setFormStartDate(year.startDate);
    setFormEndDate(year.endDate);
    setFormStatus(year.status);
    setFormDescription(year.description || '');
    setFormWorkingDays(year.totalWorkingDays);
    setFormTerms(year.terms && year.terms.length > 0 ? [...year.terms] : [
      { id: 't1', name: 'Term 1', code: 'T1', startDate: year.startDate, endDate: '2026-10-15', status: 'completed' },
      { id: 't2', name: 'Term 2', code: 'T2', startDate: '2026-10-25', endDate: year.endDate, status: 'active', isCurrent: true }
    ]);
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSaveYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formStartDate || !formEndDate) {
      setFormError('Academic session name, start date and end date are required.');
      return;
    }

    if (new Date(formEndDate) <= new Date(formStartDate)) {
      setFormError('End date must be strictly after the start date.');
      return;
    }

    if (editingYear) {
      const res = updateAcademicYear(editingYear.id, {
        name: formName.trim(),
        code: formCode.trim(),
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        totalWorkingDays: Number(formWorkingDays),
        description: formDescription.trim(),
        terms: formTerms
      });
      if (!res.success) {
        setFormError(res.message);
        return;
      }
    } else {
      const res = addAcademicYear({
        name: formName.trim(),
        code: formCode.trim(),
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        totalWorkingDays: Number(formWorkingDays),
        description: formDescription.trim(),
        examinationWindowsCount: formTerms.length,
        terms: formTerms
      });
      if (!res.success) {
        setFormError(res.message);
        return;
      }
    }

    setShowAddModal(false);
  };

  const handleActivateYear = (yearId: string) => {
    const year = academicYears.find(y => y.id === yearId);
    if (!year) return;
    updateAcademicYear(yearId, { status: 'active' });
    setActiveAcademicYearId(yearId);
    showToast(`Active academic session set to ${year.name}. All class allocations and timetables synced.`, 'success');
  };

  const activeYear = academicYears.find(y => y.id === activeAcademicYearId) || academicYears[0];

  return (
    <div className="space-y-6">
      {/* Active Academic Session Top Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Institutional Session
              </span>
              <span className="text-xs font-mono text-slate-300">{activeYear?.code}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Academic Year {activeYear?.name}</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              {activeYear?.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 block uppercase">Working Days</span>
              <span className="text-lg font-bold font-mono text-emerald-300">{activeYear?.totalWorkingDays || 224}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 block uppercase">Terms Configured</span>
              <span className="text-lg font-bold font-mono text-blue-300">{activeYear?.terms?.length || 3} Terms</span>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-blue-700" /> Register Academic Year
            </button>
          </div>
        </div>

        {/* Current Active Terms Timeline */}
        {activeYear?.terms && activeYear.terms.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeYear.terms.map(term => (
              <div
                key={term.id}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  term.isCurrent || term.status === 'active'
                    ? 'bg-blue-500/20 border-blue-400/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>{term.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    term.status === 'completed'
                      ? 'bg-slate-700 text-slate-300'
                      : term.status === 'active' || term.isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {term.status === 'active' || term.isCurrent ? 'Current Term' : term.status}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{term.startDate} to {term.endDate}</span>
                </div>
                {term.examStartDate && (
                  <div className="text-[10px] text-amber-300/90 mt-1 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Assessments: {term.examStartDate} – {term.examEndDate}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Academic Sessions Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institutional Academic Sessions Directory</h3>
            <p className="text-xs text-slate-500">Manage multi-year school calendars, statutory terms, and archival retention</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {academicYears.length} Sessions Registered
          </span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {academicYears.map(year => {
            const isActive = year.id === activeAcademicYearId || year.status === 'active';
            const isExpanded = expandedYearId === year.id;

            return (
              <div key={year.id} className="transition-colors bg-white">
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? `${themeClasses.primaryBg} text-white` : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{year.name}</h4>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">{year.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          year.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : year.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {year.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Duration: {year.startDate} to {year.endDate} · {year.totalWorkingDays} Statutory Working Days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {!isActive && year.status !== 'archived' && (
                      <button
                        onClick={() => handleActivateYear(year.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
                        title="Set this session as active school year"
                      >
                        <Check className="w-3.5 h-3.5" /> Set Active
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEdit(year)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Dates
                    </button>

                    {year.status !== 'archived' && !isActive && (
                      <button
                        onClick={() => archiveAcademicYear(year.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1"
                        title="Archive historical year"
                      >
                        <Archive className="w-3.5 h-3.5" /> Archive
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedYearId(isExpanded ? null : year.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title={isExpanded ? 'Collapse terms breakdown' : 'Expand terms breakdown'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Term Details */}
                {isExpanded && (
                  <div className="bg-slate-50 p-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Configured Academic Terms & Examination Windows
                      </span>
                      <span className="text-slate-500">{year.terms?.length || 0} Terms Registered</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {year.terms && year.terms.length > 0 ? (
                        year.terms.map(term => (
                          <div key={term.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="flex justify-between items-center font-bold text-slate-900">
                              <span>{term.name}</span>
                              <span className="font-mono text-[10px] text-slate-500">{term.code}</span>
                            </div>
                            <div className="text-slate-600 font-mono text-[11px]">
                              {term.startDate} &rarr; {term.endDate}
                            </div>
                            {term.examStartDate && (
                              <div className="text-[10px] text-amber-700 bg-amber-50 p-1 rounded font-medium mt-1">
                                Exam Window: {term.examStartDate} to {term.examEndDate}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic col-span-3">No specific terms mapped. Using standard annual division.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Academic Year Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingYear ? `Edit Academic Session: ${editingYear.name}` : 'Register New Academic Year'}
                </h3>
                <p className="text-xs text-slate-500">Configure academic calendar window, statutory days, and evaluation terms</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveYear} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Year Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. 2026–2027"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session Code *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="e.g. AY-2026-27"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={e => setFormStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={e => setFormEndDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="active">Active Session</option>
                    <option value="upcoming">Upcoming Session</option>
                    <option value="archived">Archived Historical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Statutory Working Days</label>
                  <input
                    type="number"
                    min={180}
                    max={260}
                    value={formWorkingDays}
                    onChange={e => setFormWorkingDays(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Curriculum Framework</label>
                  <input
                    type="text"
                    disabled
                    value="CBSE Secondary & Senior Secondary Standard Regulations"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Description & Notes</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Official administrative directives, promotion criteria and regulatory notices..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Term structure manager */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Term Schedule Breakdown ({formTerms.length} Terms)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextTermNum = formTerms.length + 1;
                      setFormTerms(prev => [
                        ...prev,
                        {
                          id: `term-${Date.now()}`,
                          name: `Term ${nextTermNum}`,
                          code: `T${nextTermNum}`,
                          startDate: formStartDate,
                          endDate: formEndDate,
                          status: 'upcoming'
                        }
                      ]);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Term
                  </button>
                </div>

                <div className="space-y-2">
                  {formTerms.map((t, idx) => (
                    <div key={t.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={t.name}
                        onChange={e => {
                          const val = e.target.value;
                          setFormTerms(prev => prev.map((term, i) => (i === idx ? { ...term, name: val } : term)));
                        }}
                        className="w-36 p-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold"
                        placeholder="Term Name"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px]">Start:</span>
                        <input
                          type="date"
                          value={t.startDate}
                          onChange={e => {
                            const val = e.target.value;
                            setFormTerms(prev => prev.map((term, i) => (i === idx ? { ...term, startDate: val } : term)));
                          }}
                          className="p-1 text-[11px] bg-white border border-slate-200 rounded font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px]">End:</span>
                        <input
                          type="date"
                          value={t.endDate}
                          onChange={e => {
                            const val = e.target.value;
                            setFormTerms(prev => prev.map((term, i) => (i === idx ? { ...term, endDate: val } : term)));
                          }}
                          className="p-1 text-[11px] bg-white border border-slate-200 rounded font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormTerms(prev => prev.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 ml-auto p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors shadow-sm`}
                >
                  {editingYear ? 'Save Academic Year Changes' : 'Confirm Academic Year Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
