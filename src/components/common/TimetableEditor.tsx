import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  ArrowRightLeft,
  Users,
  DoorOpen,
  BookOpen,
  Printer,
  ShieldCheck,
  Check,
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TimetableSlot, TimetableConflict } from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';

interface TimetableEditorProps {
  allowPublish?: boolean;
  canEdit?: boolean;
}

export const TimetableEditor: React.FC<TimetableEditorProps> = ({
  allowPublish = true,
  canEdit = true
}) => {
  const {
    timetables,
    timetableVersion,
    timetableConflicts,
    teachers,
    themeColor,
    updateTimetableSlot,
    addTimetableSlot,
    deleteTimetableSlot,
    swapTimetableSlots,
    publishTimetable,
    rollbackTimetable,
    substitutions,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // View state
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room' | 'free_periods' | 'conflicts'>('class');
  const [selectedClass, setSelectedClass] = useState<string>('8-A');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('tch-01');
  const [selectedRoom, setSelectedRoom] = useState<string>('Room 204');

  // Slot Edit Modal
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [isNewSlotModal, setIsNewSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState({
    standard: 8,
    section: 'A' as 'A' | 'B',
    day: 'Monday' as TimetableSlot['day'],
    period: 1,
    time: '08:30 - 09:15',
    subject: 'Mathematics',
    teacherId: 'tch-01',
    room: 'Room 204'
  });

  // Swap Slots selection
  const [swapSourceId, setSwapSourceId] = useState<string | null>(null);
  const [publishFeedback, setPublishFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const DAYS: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const PERIODS = [
    { period: 1, time: '08:30 - 09:15' },
    { period: 2, time: '09:15 - 10:00' },
    { period: 3, time: '10:15 - 11:00' },
    { period: 4, time: '11:00 - 11:45' },
    { period: 5, time: '12:30 - 01:15' },
    { period: 6, time: '01:15 - 02:00' }
  ];

  const [stdNum, secLetter] = selectedClass.split('-');
  const activeStandard = Number(stdNum);
  const activeSection = secLetter as 'A' | 'B';

  // Filter slots for current view
  const currentSlots = timetables.filter(s => {
    if (viewMode === 'class') {
      return s.standard === activeStandard && s.section === activeSection;
    }
    if (viewMode === 'teacher') {
      return s.teacherId === selectedTeacherId;
    }
    if (viewMode === 'room') {
      return s.room === selectedRoom;
    }
    return true;
  });

  const getSlotAt = (day: string, period: number) => {
    return currentSlots.find(s => s.day === day && s.period === period);
  };

  const handleOpenAddSlot = (day: TimetableSlot['day'], period: number, time: string) => {
    setSlotForm({
      standard: activeStandard,
      section: activeSection,
      day,
      period,
      time,
      subject: 'Mathematics',
      teacherId: teachers[0]?.id || 'tch-01',
      room: selectedRoom
    });
    setIsNewSlotModal(true);
  };

  const handleSaveSlotForm = (e: React.FormEvent) => {
    e.preventDefault();
    const t = teachers.find(tch => tch.id === slotForm.teacherId);

    // Collision detection check
    const currentSlotId = editingSlot?.id;
    const teacherCollision = timetables.find(s =>
      s.id !== currentSlotId &&
      s.day === slotForm.day &&
      s.period === slotForm.period &&
      s.teacherId === slotForm.teacherId
    );
    const roomCollision = timetables.find(s =>
      s.id !== currentSlotId &&
      s.day === slotForm.day &&
      s.period === slotForm.period &&
      s.room === slotForm.room
    );

    if (teacherCollision) {
      showToast(`Warning: ${t?.name || 'Faculty'} is already scheduled for Std ${teacherCollision.standard}-${teacherCollision.section} in Period ${slotForm.period}. Double-booking conflict recorded.`, 'warning');
    } else if (roomCollision) {
      showToast(`Warning: ${slotForm.room} is already occupied by Std ${roomCollision.standard}-${roomCollision.section} in Period ${slotForm.period}. Room clash recorded.`, 'warning');
    }

    if (editingSlot) {
      updateTimetableSlot(editingSlot.id, {
        subject: slotForm.subject,
        teacherId: slotForm.teacherId,
        teacherName: t ? t.name : 'Faculty Staff',
        room: slotForm.room
      });
      setEditingSlot(null);
    } else {
      addTimetableSlot({
        standard: slotForm.standard,
        section: slotForm.section,
        day: slotForm.day,
        period: slotForm.period,
        time: slotForm.time,
        subject: slotForm.subject,
        teacherId: slotForm.teacherId,
        teacherName: t ? t.name : 'Faculty Staff',
        room: slotForm.room
      });
      setIsNewSlotModal(false);
    }
  };

  const handlePublishClick = () => {
    const result = publishTimetable('Dr. Evelyn Montgomery');
    setPublishFeedback(result);
    setTimeout(() => setPublishFeedback(null), 5000);
  };

  // Conflict test simulator: deliberately induces a double booking on Tuesday Period 3
  const handleSimulateConflict = () => {
    const tSen = teachers.find(t => t.id === 'tch-02');
    addTimetableSlot({
      standard: 9,
      section: 'B',
      day: 'Tuesday',
      period: 3,
      time: '10:15 - 11:00',
      subject: 'Physics Extra',
      teacherId: 'tch-02',
      teacherName: tSen ? tSen.name : 'Dr. Alok Sen',
      room: 'Room 204'
    });
    showToast('Simulated conflict created: Dr. Alok Sen double-booked on Tuesday Period 3. Check the conflict banner above!', 'info');
  };

  // Quick Conflict Auto-Resolver
  const handleAutoResolveConflict = () => {
    // Reassign conflicting slots to another teacher
    const conflicting = timetables.filter(
      s => s.teacherId === 'tch-02' && s.day === 'Tuesday' && s.period === 3
    );
    if (conflicting.length > 1) {
      const secondSlot = conflicting[1];
      updateTimetableSlot(secondSlot.id, {
        teacherId: 'tch-05',
        teacherName: 'Ms. Neha Gupta',
        room: 'Computer Lab B'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Status & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Master Timetable Matrix</h3>
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                timetableVersion.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {timetableVersion.status === 'published' ? 'Published & Active' : 'Draft Revision'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Academic Year 2026–2027 · Term 2</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full timetable grid editor with automated collision detection and substitution links
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (
            <button
              onClick={handleSimulateConflict}
              className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
              title="Test the conflict engine by injecting an overlapping teacher schedule"
            >
              Simulate Test Conflict
            </button>
          )}

          {timetableVersion.status === 'published' && canEdit && (
            <button
              onClick={rollbackTimetable}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Revise Timetable (Draft)
            </button>
          )}

          {allowPublish && (
            <button
              onClick={handlePublishClick}
              disabled={timetableConflicts.some(c => c.severity === 'blocking')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-all ${
                timetableConflicts.some(c => c.severity === 'blocking')
                  ? 'bg-slate-400 cursor-not-allowed'
                  : `${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Publish Timetable</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Conflict Alert Banner */}
      {timetableConflicts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {timetableConflicts.length} Conflict(s) Detected — Publication Blocked Until Resolved
              </span>
            </div>
            <button
              onClick={handleAutoResolveConflict}
              className="text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 px-3 py-1 rounded-lg shadow-sm"
            >
              1-Click Auto-Resolve Clash
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {timetableConflicts.map(c => (
              <div key={c.id} className="text-xs bg-white/90 p-2.5 rounded-xl border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-rose-900">[{c.day} Period {c.period}] </span>
                  <span className="text-slate-700">{c.description}</span>
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium shrink-0">
                  Suggestion: {c.resolutionSuggestion}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Mode & Filter Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('class')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'class' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class & Section View
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'teacher' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Individual Teacher View
          </button>
          <button
            onClick={() => setViewMode('room')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'room' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Room & Lab View
          </button>
          <button
            onClick={() => setViewMode('free_periods')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'free_periods' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Free Periods Matrix
          </button>
        </div>

        {/* Dynamic Context Selector */}
        <div className="flex items-center gap-2 text-xs">
          {viewMode === 'class' && (
            <>
              <span className="text-slate-500 font-semibold">Select Class:</span>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 font-bold bg-white"
              >
                {[
                  '1-A', '2-A', '3-A', '4-A', '5-A', '5-B',
                  '6-A', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A'
                ].map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </>
          )}

          {viewMode === 'teacher' && (
            <>
              <span className="text-slate-500 font-semibold">Select Faculty:</span>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 font-bold bg-white"
              >
                {teachers.filter(t => t.staffCategory === 'Teaching').map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                ))}
              </select>
            </>
          )}

          {viewMode === 'room' && (
            <>
              <span className="text-slate-500 font-semibold">Select Room:</span>
              <select
                value={selectedRoom}
                onChange={e => setSelectedRoom(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 font-bold bg-white"
              >
                {['Room 204', 'Room 205', 'Room 302', 'Physics Lab 1', 'Computer Lab B', 'Art Studio', 'Central Library', 'Main Field'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Main Timetable Grid (Monday to Friday, Periods 1 to 6) */}
      {viewMode !== 'free_periods' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto p-4">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-3 px-3 w-28">Period & Time</th>
                {DAYS.map(d => (
                  <th key={d} className="py-3 px-3 text-slate-900 font-bold">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {PERIODS.map(({ period, time }) => (
                <tr key={period} className="hover:bg-slate-50/30">
                  {/* Period Label */}
                  <td className="py-3 px-3 bg-slate-50/70 border-r border-slate-100 font-mono">
                    <div className="font-bold text-slate-900">Period {period}</div>
                    <div className="text-[10px] text-slate-400">{time}</div>
                  </td>

                  {/* Day Slot Cells */}
                  {DAYS.map(day => {
                    const slot = getSlotAt(day, period);
                    // Check if this slot has a substitute teacher assigned
                    const sub = substitutions.find(
                      s => s.day === day && s.period === period && s.standard === activeStandard && s.section === activeSection
                    );

                    return (
                      <td key={day} className="py-2.5 px-2.5 align-top min-w-[130px]">
                        {slot ? (
                          <div
                            className={`p-2.5 rounded-xl border text-xs transition-all relative group ${
                              swapSourceId === slot.id
                                ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300'
                                : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-slate-900">{slot.subject}</span>
                              {canEdit && (
                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingSlot(slot);
                                      setSlotForm({
                                        standard: slot.standard,
                                        section: (slot.section as 'A' | 'B') || 'A',
                                        day: slot.day,
                                        period: slot.period,
                                        time: slot.time,
                                        subject: slot.subject,
                                        teacherId: slot.teacherId || 'tch-01',
                                        room: slot.room
                                      });
                                    }}
                                    className="p-0.5 hover:text-blue-700"
                                    title="Edit slot"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteTimetableSlot(slot.id)}
                                    className="p-0.5 hover:text-rose-700"
                                    title="Delete slot"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-600 font-medium">
                              {sub ? (
                                <span className="text-amber-800 font-bold">
                                  Sub: {sub.substituteTeacherName}
                                </span>
                              ) : (
                                slot.teacherName
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{slot.room}</div>

                            {/* Slot Swap affordance */}
                            {canEdit && (
                              <div className="mt-1 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                                {swapSourceId === slot.id ? (
                                  <button
                                    onClick={() => setSwapSourceId(null)}
                                    className="text-amber-700 font-semibold"
                                  >
                                    Cancel Swap
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (swapSourceId) {
                                        swapTimetableSlots(swapSourceId, slot.id);
                                        setSwapSourceId(null);
                                      } else {
                                        setSwapSourceId(slot.id);
                                      }
                                    }}
                                    className="text-slate-400 hover:text-blue-700 font-semibold"
                                  >
                                    {swapSourceId ? 'Swap Here &crarr;' : 'Swap'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Empty Slot */
                          <div className="h-20 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-2 text-center text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                            {canEdit ? (
                              <button
                                onClick={() => handleOpenAddSlot(day, period, time)}
                                className="text-[11px] text-slate-500 font-medium hover:text-blue-700 flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add
                              </button>
                            ) : (
                              <span className="text-[10px]">Free Period</span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Free Periods Matrix */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Faculty Free Periods & Availability Roster</h3>
            <p className="text-xs text-slate-500">
              Live view of unassigned teaching staff available for substitution or co-curricular duties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {teachers.filter(t => t.staffCategory === 'Teaching').map(teacher => {
              const assignedCount = timetables.filter(s => s.teacherId === teacher.id).length;
              const freeCount = Math.max(0, teacher.maxWeeklyWorkload - assignedCount);

              return (
                <div key={teacher.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{teacher.name}</h4>
                      <span className="text-[10px] text-slate-500">{teacher.department}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {freeCount} Free Slots
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Teaching Load: <strong className="text-slate-900 font-mono">{assignedCount} / {teacher.maxWeeklyWorkload}</strong> periods/week
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Assigned: {teacher.classesAssigned.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit / Add Slot Modal */}
      {(editingSlot || isNewSlotModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingSlot ? 'Edit Timetable Slot' : 'Add Period to Timetable'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure subject, faculty allocation, and classroom room assignment
            </p>

            <form onSubmit={handleSaveSlotForm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Day</label>
                  <input
                    type="text"
                    readOnly
                    value={slotForm.day}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-100 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Period & Time</label>
                  <input
                    type="text"
                    readOnly
                    value={`P${slotForm.period} (${slotForm.time})`}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-100 font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject *</label>
                <select
                  value={slotForm.subject}
                  onChange={e => setSlotForm({ ...slotForm, subject: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science (Physics)">Science (Physics)</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Library Session">Library Session</option>
                  <option value="Fine Arts">Fine Arts</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Teacher *</label>
                <select
                  value={slotForm.teacherId}
                  onChange={e => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                >
                  {teachers.filter(t => t.staffCategory === 'Teaching').map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Classroom / Room *</label>
                <select
                  value={slotForm.room}
                  onChange={e => setSlotForm({ ...slotForm, room: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                >
                  <option value="Room 204">Room 204</option>
                  <option value="Room 205">Room 205</option>
                  <option value="Room 302">Room 302</option>
                  <option value="Physics Lab 1">Physics Lab 1</option>
                  <option value="Computer Lab B">Computer Lab B</option>
                  <option value="Art Studio">Art Studio</option>
                  <option value="Central Library">Central Library</option>
                  <option value="Main Field">Main Field</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlot(null);
                    setIsNewSlotModal(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publication Feedback Toast */}
      {publishFeedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border ${
            publishFeedback.success
              ? 'bg-emerald-900 border-emerald-700 text-emerald-100'
              : 'bg-rose-900 border-rose-700 text-rose-100'
          }`}
        >
          {publishFeedback.success ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <AlertTriangle className="w-4 h-4 text-rose-300" />}
          <span>{publishFeedback.message}</span>
        </div>
      )}
    </div>
  );
};
