import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Layers,
  ChevronRight,
  Filter,
  X,
  Clock,
  DoorOpen,
  Check,
  UserCheck,
  Award
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SubjectEntity, SubjectAllocation, Teacher } from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';

interface SubjectAllocationManagerProps {
  canEdit?: boolean;
}

export const SubjectAllocationManager: React.FC<SubjectAllocationManagerProps> = ({
  canEdit = true
}) => {
  const {
    subjects,
    subjectAllocations,
    classes,
    teachers,
    timetables,
    rooms,
    themeColor,
    addSubject,
    updateSubject,
    deleteSubject,
    saveSubjectAllocation,
    deleteSubjectAllocation,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Tabs: 'allocations' (Matrix) vs 'catalog' (Subjects list)
  const [activeSubTab, setActiveSubTab] = useState<'allocations' | 'catalog'>('allocations');

  // Allocation Matrix Filters
  const [selectedStandard, setSelectedStandard] = useState<number>(8);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [allocSearch, setAllocSearch] = useState('');

  // Subject Catalog Search & Filter
  const [catalogSearch, setCatalogSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectEntity | null>(null);
  const [subjName, setSubjName] = useState('');
  const [subjCode, setSubjCode] = useState('');
  const [subjCategory, setSubjCategory] = useState<SubjectEntity['category']>('Core Academic');
  const [subjPeriods, setSubjPeriods] = useState(5);
  const [subjStandards, setSubjStandards] = useState<number[]>([6, 7, 8, 9, 10]);
  const [subjDesc, setSubjDesc] = useState('');
  const [subjectError, setSubjectError] = useState<string | null>(null);

  // Allocation Modal
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [allocatingSubject, setAllocatingSubject] = useState<SubjectEntity | null>(null);
  const [allocTeacherId, setAllocTeacherId] = useState('');
  const [allocPeriods, setAllocPeriods] = useState(5);
  const [allocRoom, setAllocRoom] = useState('Room 204');
  const [allocError, setAllocError] = useState<string | null>(null);

  // Teaching faculty list
  const teachingFaculty = useMemo(() => {
    return teachers.filter(t => t.staffCategory === 'Teaching' && t.employmentStatus === 'Active');
  }, [teachers]);

  // Selected class's subjects
  const classSubjects = useMemo(() => {
    return subjects.filter(s => s.applicableStandards.includes(selectedStandard));
  }, [subjects, selectedStandard]);

  // Handle open add subject
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjName('');
    setSubjCode('SUB-NEW');
    setSubjCategory('Core Academic');
    setSubjPeriods(5);
    setSubjStandards([6, 7, 8, 9, 10]);
    setSubjDesc('');
    setSubjectError(null);
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (subj: SubjectEntity) => {
    setEditingSubject(subj);
    setSubjName(subj.name);
    setSubjCode(subj.code);
    setSubjCategory(subj.category);
    setSubjPeriods(subj.weeklyPeriodsRequired);
    setSubjStandards([...subj.applicableStandards]);
    setSubjDesc(subj.description || '');
    setSubjectError(null);
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjName.trim() || !subjCode.trim()) {
      setSubjectError('Subject title and statutory code are required.');
      return;
    }

    if (subjStandards.length === 0) {
      setSubjectError('At least one applicable grade standard must be selected.');
      return;
    }

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: subjName.trim(),
        code: subjCode.trim().toUpperCase(),
        category: subjCategory,
        weeklyPeriodsRequired: Number(subjPeriods),
        applicableStandards: subjStandards,
        description: subjDesc.trim()
      });
      setShowSubjectModal(false);
    } else {
      addSubject({
        name: subjName.trim(),
        code: subjCode.trim().toUpperCase(),
        category: subjCategory,
        weeklyPeriodsRequired: Number(subjPeriods),
        applicableStandards: subjStandards,
        description: subjDesc.trim(),
        status: 'active'
      });
      setShowSubjectModal(false);
    }
  };

  // Open Allocate Modal
  const handleOpenAllocate = (subj: SubjectEntity) => {
    setAllocatingSubject(subj);
    const existing = subjectAllocations.find(
      a => a.standard === selectedStandard && a.section === selectedSection && a.subjectId === subj.id
    );

    setAllocTeacherId(existing?.teacherId || teachingFaculty[0]?.id || '');
    setAllocPeriods(existing?.weeklyPeriods || subj.weeklyPeriodsRequired);
    setAllocRoom(existing?.room || (selectedStandard === 8 && selectedSection === 'A' ? 'Room 204' : `Room ${selectedStandard}01`));
    setAllocError(null);
    setShowAllocModal(true);
  };

  const handleSaveAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingSubject) return;

    const teacher = teachingFaculty.find(t => t.id === allocTeacherId);
    if (!teacher) {
      setAllocError('Please select a valid teaching faculty member.');
      return;
    }

    // Workload check warning
    const currentLoad = timetables.filter(t => t.teacherId === teacher.id).length;
    if (currentLoad + allocPeriods > teacher.maxWeeklyWorkload) {
      showToast(`Note: Allocation will place ${teacher.name} near or above weekly workload threshold.`, 'warning');
    }

    saveSubjectAllocation({
      academicYear: '2026–2027',
      standard: selectedStandard,
      section: selectedSection,
      subjectId: allocatingSubject.id,
      subjectName: allocatingSubject.name,
      subjectCode: allocatingSubject.code,
      teacherId: teacher.id,
      teacherName: teacher.name,
      weeklyPeriods: Number(allocPeriods),
      room: allocRoom,
      status: 'assigned'
    });

    setShowAllocModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Curriculum Subjects & Faculty Allocation</h3>
            <p className="text-xs text-slate-500">Subject catalog, weekly period quotas, classroom assignments, and teacher allocations</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setActiveSubTab('allocations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSubTab === 'allocations'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Class Allocation Matrix
              </button>
              <button
                onClick={() => setActiveSubTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSubTab === 'catalog'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Subject Catalog ({subjects.length})
              </button>
            </div>

            {canEdit && activeSubTab === 'catalog' && (
              <button
                onClick={handleOpenAddSubject}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-sm`}
              >
                <Plus className="w-4 h-4" /> Add Subject
              </button>
            )}
          </div>
        </div>

        {/* Filters according to active sub-tab */}
        {activeSubTab === 'allocations' ? (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Select Standard:</span>
                <select
                  value={selectedStandard}
                  onChange={e => setSelectedStandard(Number(e.target.value))}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(std => (
                    <option key={std} value={std}>Standard {std}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Section:</span>
                <div className="flex gap-1">
                  {['A', 'B', 'C'].map(sec => (
                    <button
                      key={sec}
                      onClick={() => setSelectedSection(sec)}
                      className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                        selectedSection === sec
                          ? `${themeClasses.primaryBg} text-white shadow-2xs`
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Sec {sec}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Academic Session: 2026–2027 · Std {selectedStandard}-{selectedSection}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                placeholder="Search subject catalog or code..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Category:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="py-1 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="Core Academic">Core Academic</option>
                <option value="Science & Tech">Science & Tech</option>
                <option value="Languages">Languages</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Arts & Co-Curricular">Arts & Co-Curricular</option>
                <option value="Physical Education">Physical Education</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: Allocation Matrix */}
      {activeSubTab === 'allocations' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Subject Allocation Matrix · Class {selectedStandard}-{selectedSection}
              </h4>
              <p className="text-xs text-slate-500">
                Verify faculty allocations and weekly period quotas against current master timetable
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              {classSubjects.length} Prescribed Subjects
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Allocated Faculty</th>
                  <th className="py-2.5 px-3 text-center">Periods Quota</th>
                  <th className="py-2.5 px-3 text-center">Scheduled in TT</th>
                  <th className="py-2.5 px-3">Room / Lab</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {classSubjects.map(subj => {
                  const alloc = subjectAllocations.find(
                    a => a.standard === selectedStandard && a.section === selectedSection && a.subjectId === subj.id
                  );
                  const scheduledPeriods = timetables.filter(
                    t => t.standard === selectedStandard && t.section === selectedSection && t.subject.toLowerCase().includes(subj.name.toLowerCase().split(' ')[0])
                  ).length;
                  const isAssigned = !!alloc?.teacherId;

                  return (
                    <tr key={subj.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{subj.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{subj.code}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {subj.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {isAssigned ? (
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <span>{alloc?.teacherName}</span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-[10px] border border-rose-200">
                            Unassigned — Action Required
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold">
                        {alloc?.weeklyPeriods || subj.weeklyPeriodsRequired} p/wk
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          scheduledPeriods >= (alloc?.weeklyPeriods || subj.weeklyPeriodsRequired)
                            ? 'bg-emerald-100 text-emerald-800'
                            : scheduledPeriods > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {scheduledPeriods} / {alloc?.weeklyPeriods || subj.weeklyPeriodsRequired}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {alloc?.room || 'Room 204'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenAllocate(subj)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            {isAssigned ? 'Reassign' : 'Allocate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Subject Catalog */}
      {activeSubTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects
            .filter(s => {
              const matchSearch =
                s.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                s.code.toLowerCase().includes(catalogSearch.toLowerCase());
              const matchCategory = categoryFilter === 'all' || s.category === categoryFilter;
              return matchSearch && matchCategory;
            })
            .map(subj => (
              <div
                key={subj.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-sm transition-all space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{subj.name}</h4>
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">{subj.code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800">
                    {subj.category}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] line-clamp-2">{subj.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Weekly Requirement: <strong className="font-mono text-slate-900">{subj.weeklyPeriodsRequired} periods</strong></span>
                  <span>Standards: <strong className="font-mono text-slate-900">{subj.applicableStandards.join(', ')}</strong></span>
                </div>

                {canEdit && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditSubject(subj)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-slate-500" /> Edit
                    </button>
                    {subjects.length > 5 && (
                      <button
                        onClick={() => deleteSubject(subj.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSubject ? `Edit Subject: ${editingSubject.name}` : 'Register New Curriculum Subject'}
                </h3>
                <p className="text-xs text-slate-500">Define academic subject code, category, and standard applicability</p>
              </div>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {subjectError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{subjectError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={subjName}
                    onChange={e => setSubjName(e.target.value)}
                    placeholder="e.g. Environmental Science"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={subjCode}
                    onChange={e => setSubjCode(e.target.value)}
                    placeholder="e.g. EVS-08"
                    className="w-full p-2.5 rounded-xl border border-slate-200 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={subjCategory}
                    onChange={e => setSubjCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="Core Academic">Core Academic</option>
                    <option value="Science & Tech">Science & Tech</option>
                    <option value="Languages">Languages</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Arts & Co-Curricular">Arts & Co-Curricular</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weekly Periods Required</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={subjPeriods}
                    onChange={e => setSubjPeriods(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicable Standards *</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-200 bg-slate-50/50">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(std => {
                    const isSelected = subjStandards.includes(std);
                    return (
                      <button
                        type="button"
                        key={std}
                        onClick={() => {
                          if (isSelected) {
                            setSubjStandards(prev => prev.filter(s => s !== std));
                          } else {
                            setSubjStandards(prev => [...prev, std].sort((a, b) => a - b));
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? `${themeClasses.primaryBg} text-white`
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Std {std}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Syllabus Overview / Notes</label>
                <textarea
                  rows={2}
                  value={subjDesc}
                  onChange={e => setSubjDesc(e.target.value)}
                  placeholder="Key competencies, learning objectives, and practical requirements..."
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-sm`}
                >
                  {editingSubject ? 'Save Changes' : 'Register Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Teacher Modal */}
      {showAllocModal && allocatingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Allocate Faculty · Std {selectedStandard}-{selectedSection}
                </h3>
                <p className="text-xs text-slate-500">Assign subject teacher for {allocatingSubject.name} ({allocatingSubject.code})</p>
              </div>
              <button
                onClick={() => setShowAllocModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {allocError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{allocError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAllocation} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Teaching Faculty *</label>
                <select
                  required
                  value={allocTeacherId}
                  onChange={e => setAllocTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="">-- Choose Instructor --</option>
                  {teachingFaculty.map(t => {
                    const scheduledLoad = timetables.filter(slot => slot.teacherId === t.id).length;
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.department}) · Load: {scheduledLoad}/{t.maxWeeklyWorkload} periods/wk
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Workload preview for selected teacher */}
              {allocTeacherId && (() => {
                const selT = teachingFaculty.find(t => t.id === allocTeacherId);
                if (!selT) return null;
                const scheduledLoad = timetables.filter(slot => slot.teacherId === selT.id).length;
                const projectedLoad = scheduledLoad + allocPeriods;
                const isOverloaded = projectedLoad > selT.maxWeeklyWorkload;

                return (
                  <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    isOverloaded ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex justify-between items-center font-bold">
                      <span>Faculty Workload Projection:</span>
                      <span className="font-mono">{projectedLoad} / {selT.maxWeeklyWorkload} periods</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isOverloaded ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, (projectedLoad / selT.maxWeeklyWorkload) * 100)}%` }}
                      />
                    </div>
                    {isOverloaded && (
                      <p className="text-[11px] text-amber-700 font-medium">
                        Warning: This assignment will exceed {selT.name}'s max workload limit ({selT.maxWeeklyWorkload} periods).
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weekly Periods</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={allocPeriods}
                    onChange={e => setAllocPeriods(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designated Venue / Lab</label>
                  <select
                    value={allocRoom}
                    onChange={e => setAllocRoom(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.roomNumber}>{r.roomNumber} ({r.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAllocModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-sm`}
                >
                  Confirm Subject Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
