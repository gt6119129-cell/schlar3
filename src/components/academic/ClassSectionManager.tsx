import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Users,
  Search,
  Plus,
  Edit2,
  Archive,
  Layers,
  ChevronRight,
  GraduationCap,
  DoorOpen,
  Calendar,
  CheckCircle,
  AlertTriangle,
  X,
  Filter,
  Eye,
  ArrowRightLeft,
  UserCheck
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ClassEntity, SectionEntity, Student, Teacher } from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';
import { StudentProfileModal } from '../common/StudentProfileModal';

interface ClassSectionManagerProps {
  canEdit?: boolean;
}

export const ClassSectionManager: React.FC<ClassSectionManagerProps> = ({
  canEdit = true
}) => {
  const {
    classes,
    students,
    teachers,
    timetables,
    subjects,
    subjectAllocations,
    rooms,
    themeColor,
    addClass,
    updateClass,
    addSection,
    updateSection,
    archiveSection,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [wingFilter, setWingFilter] = useState<'all' | 'Primary Wing' | 'Middle Wing' | 'Secondary Wing'>('all');
  const [selectedClassForDossier, setSelectedClassForDossier] = useState<ClassEntity | null>(null);

  // Section Add / Edit Modal
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [targetClassForSection, setTargetClassForSection] = useState<ClassEntity | null>(null);
  const [editingSection, setEditingSection] = useState<SectionEntity | null>(null);
  const [sectionCode, setSectionCode] = useState('C');
  const [sectionTeacherId, setSectionTeacherId] = useState('');
  const [sectionRoom, setSectionRoom] = useState('Room 206');
  const [sectionCapacity, setSectionCapacity] = useState(40);
  const [sectionError, setSectionError] = useState<string | null>(null);

  // Inspect student from roster
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Teaching staff only for class teachers
  const teachingFaculty = useMemo(() => {
    return teachers.filter(t => t.staffCategory === 'Teaching' && t.employmentStatus === 'Active');
  }, [teachers]);

  // Filtered classes list
  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.coordinatorName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchWing = wingFilter === 'all' || c.wing === wingFilter;
      return matchSearch && matchWing;
    });
  }, [classes, searchQuery, wingFilter]);

  // Open Section Modal
  const handleOpenAddSection = (cls: ClassEntity) => {
    setTargetClassForSection(cls);
    setEditingSection(null);
    // Find next available section letter
    const existingLetters = cls.sections.filter(s => s.status !== 'archived').map(s => s.section.toUpperCase());
    const candidates = ['A', 'B', 'C', 'D', 'E'];
    const nextLetter = candidates.find(letter => !existingLetters.includes(letter)) || 'C';

    setSectionCode(nextLetter);
    setSectionTeacherId(teachingFaculty[0]?.id || '');
    setSectionRoom(`Room ${cls.standard}03`);
    setSectionCapacity(40);
    setSectionError(null);
    setShowSectionModal(true);
  };

  const handleOpenEditSection = (cls: ClassEntity, sec: SectionEntity) => {
    setTargetClassForSection(cls);
    setEditingSection(sec);
    setSectionCode(sec.section);
    setSectionTeacherId(sec.classTeacherId || '');
    setSectionRoom(sec.room);
    setSectionCapacity(sec.capacity);
    setSectionError(null);
    setShowSectionModal(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClassForSection) return;

    if (!sectionCode.trim()) {
      setSectionError('Section identifier is required.');
      return;
    }

    const assignedTeacher = teachingFaculty.find(t => t.id === sectionTeacherId);

    if (editingSection) {
      updateSection(editingSection.id, {
        section: sectionCode.trim().toUpperCase(),
        name: `${targetClassForSection.standard}-${sectionCode.trim().toUpperCase()}`,
        classTeacherId: sectionTeacherId,
        classTeacherName: assignedTeacher ? assignedTeacher.name : undefined,
        room: sectionRoom,
        capacity: Number(sectionCapacity)
      });
      setShowSectionModal(false);
    } else {
      const res = addSection(targetClassForSection.id, {
        standard: targetClassForSection.standard,
        section: sectionCode.trim().toUpperCase(),
        name: `${targetClassForSection.standard}-${sectionCode.trim().toUpperCase()}`,
        classTeacherId: sectionTeacherId,
        classTeacherName: assignedTeacher ? assignedTeacher.name : undefined,
        room: sectionRoom,
        capacity: Number(sectionCapacity)
      });

      if (!res.success) {
        setSectionError(res.message);
        return;
      }
      setShowSectionModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Academic Standards & Sections Directory</h3>
            <p className="text-xs text-slate-500">Curriculum divisions, enrolled rosters, room allocations, and class teacher governance</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              {classes.length} Standards · {classes.reduce((acc, c) => acc + c.sections.filter(s => s.status !== 'archived').length, 0)} Active Sections
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search standards, codes or coordinators..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Wing Filter:</span>
            <select
              value={wingFilter}
              onChange={e => setWingFilter(e.target.value as any)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
            >
              <option value="all">All Academic Wings</option>
              <option value="Primary Wing">Primary Wing (Std 1–4)</option>
              <option value="Middle Wing">Middle Wing (Std 5–8)</option>
              <option value="Secondary Wing">Secondary Wing (Std 9–10)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClasses.map(cls => {
          const classStudents = students.filter(s => s.standard === cls.standard);
          const activeSections = cls.sections.filter(s => s.status !== 'archived');

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-sm transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${themeClasses.primaryBg} text-white font-extrabold flex items-center justify-center text-sm shadow-sm`}>
                    {cls.standard}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{cls.name}</h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{cls.code}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {cls.wing} · Coordinator: <span className="text-slate-800 font-semibold">{cls.coordinatorName || 'Academic Office'}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClassForDossier(cls)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/80 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Full Class Dossier
                </button>
              </div>

              {/* Roster & Sections Snapshot */}
              <div className="grid grid-cols-3 gap-2 py-1 text-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Enrolled Roster</span>
                  <strong className="text-sm font-mono text-slate-900">{classStudents.length} Students</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Active Sections</span>
                  <strong className="text-sm font-mono text-blue-700">{activeSections.length} Sections</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Weekly Lessons</span>
                  <strong className="text-sm font-mono text-emerald-700">
                    {timetables.filter(t => t.standard === cls.standard).length} Periods
                  </strong>
                </div>
              </div>

              {/* Sections Breakdown Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Sections & Class Teachers</span>
                  {canEdit && (
                    <button
                      onClick={() => handleOpenAddSection(cls)}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Add Section
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSections.map(sec => {
                    const secStudents = classStudents.filter(s => s.section === sec.section);

                    return (
                      <div
                        key={sec.id}
                        className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="text-sm">Section {sec.section}</span>
                          <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                            {secStudents.length} / {sec.capacity} Enrolled
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-0.5">
                          <div>Class Teacher: <strong className="text-slate-800">{sec.classTeacherName || 'Not Assigned'}</strong></div>
                          <div className="text-slate-400 flex items-center gap-1 font-mono">
                            <DoorOpen className="w-3 h-3" /> {sec.room}
                          </div>
                        </div>

                        {canEdit && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5 text-[11px]">
                            <button
                              onClick={() => handleOpenEditSection(cls, sec)}
                              className="text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100 flex items-center gap-0.5"
                            >
                              <Edit2 className="w-3 h-3 text-slate-400" /> Edit
                            </button>
                            {activeSections.length > 1 && (
                              <button
                                onClick={() => archiveSection(sec.id)}
                                className="text-rose-600 hover:text-rose-800 px-2 py-0.5 rounded hover:bg-rose-50 flex items-center gap-0.5"
                                title="Archive empty or discontinued section"
                              >
                                <Archive className="w-3 h-3" /> Archive
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Create / Edit Modal */}
      {showSectionModal && targetClassForSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSection ? `Edit Section ${editingSection.name}` : `Create New Section for ${targetClassForSection.name}`}
                </h3>
                <p className="text-xs text-slate-500">Configure section code, class teacher allocation, and designated classroom</p>
              </div>
              <button
                onClick={() => setShowSectionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sectionError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{sectionError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSection} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard</label>
                  <input
                    type="text"
                    disabled
                    value={targetClassForSection.name}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section Identifier *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={sectionCode}
                    onChange={e => setSectionCode(e.target.value)}
                    placeholder="e.g. C"
                    className="w-full p-2.5 rounded-xl border border-slate-200 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Teacher Assignment *</label>
                <select
                  required
                  value={sectionTeacherId}
                  onChange={e => setSectionTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="">-- Select Faculty Member --</option>
                  {teachingFaculty.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department} - {t.empId}) · Currently {t.currentWeeklyWorkload}/{t.maxWeeklyWorkload} p/wk
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Class teacher holds primary pastoral and roll-call moderation responsibility.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Classroom *</label>
                  <select
                    value={sectionRoom}
                    onChange={e => setSectionRoom(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono"
                  >
                    {rooms.filter(r => r.type === 'Classroom').map(r => (
                      <option key={r.id} value={r.roomNumber}>
                        {r.roomNumber} ({r.wing} - Cap: {r.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Desk Capacity</label>
                  <input
                    type="number"
                    min={20}
                    max={50}
                    value={sectionCapacity}
                    onChange={e => setSectionCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-sm`}
                >
                  {editingSection ? 'Save Section Changes' : 'Confirm Section Creation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Full Dossier Drawer / Modal */}
      {selectedClassForDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${themeClasses.primaryBg} text-white font-bold flex items-center justify-center text-lg shadow-sm`}>
                  {selectedClassForDossier.standard}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedClassForDossier.name} Academic Dossier</h3>
                  <p className="text-xs text-slate-500">
                    {selectedClassForDossier.wing} · Academic Session: 2026–2027 · Coordinator: {selectedClassForDossier.coordinatorName || 'Prof. Marcus Vance'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClassForDossier(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sections Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedClassForDossier.sections.filter(s => s.status !== 'archived').map(sec => {
                const enrolled = students.filter(s => s.standard === selectedClassForDossier.standard && s.section === sec.section);

                return (
                  <div key={sec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Section {sec.section}</span>
                      <span className="text-blue-700 font-mono">{enrolled.length} Enrolled</span>
                    </div>
                    <div className="text-slate-600 text-[11px]">Teacher: <strong>{sec.classTeacherName || 'Unassigned'}</strong></div>
                    <div className="text-slate-400 text-[10px] font-mono">Location: {sec.room}</div>
                  </div>
                );
              })}
            </div>

            {/* Enrolled Students Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Enrolled Student Roster ({students.filter(s => s.standard === selectedClassForDossier.standard).length} Students)</h4>
                <span className="text-slate-500">Click any student to inspect individual academic record</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Roll #</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3">Guardian Contact</th>
                      <th className="py-2.5 px-3">Attendance</th>
                      <th className="py-2.5 px-3 text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {students
                      .filter(s => s.standard === selectedClassForDossier.standard)
                      .slice(0, 12)
                      .map(student => (
                        <tr key={student.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold">{student.rollNo}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{student.name}</td>
                          <td className="py-2.5 px-3 font-mono">Sec {student.section}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{student.parentPhone}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              student.attendanceRate >= 90
                                ? 'bg-emerald-50 text-emerald-800'
                                : student.attendanceRate >= 75
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {student.attendanceRate}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setViewingStudent(student)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weekly Timetable Distribution Summary */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Weekly Subject Curriculum Pacing</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {subjects
                  .filter(s => s.applicableStandards.includes(selectedClassForDossier.standard))
                  .map(subj => {
                    const alloc = subjectAllocations.find(
                      a => a.standard === selectedClassForDossier.standard && a.subjectId === subj.id
                    );

                    return (
                      <div key={subj.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="font-bold text-slate-900 text-[11px] truncate">{subj.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{subj.code} · {subj.weeklyPeriodsRequired} p/wk</div>
                        <div className="text-[10px] text-blue-700 font-medium mt-0.5 truncate">
                          {alloc?.teacherName || 'Faculty Assigned'}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedClassForDossier(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        initialTab="academics"
      />
    </div>
  );
};
