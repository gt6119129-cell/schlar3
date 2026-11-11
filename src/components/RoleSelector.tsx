import React, { useState } from 'react';
import {
  GraduationCap,
  Monitor,
  Smartphone,
  Check,
  Shield,
  Award,
  BookOpen,
  DollarSign,
  PhoneCall,
  Library,
  Users,
  RotateCcw,
  Sparkles,
  Download,
  School,
  ChevronRight,
  Palette,
  UserCheck,
  Bus,
  CheckSquare,
  X,
  ArrowRight,
  Info,
  Sliders
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { ROLE_DEFINITIONS } from '../data/mockData';
import { RoleType } from '../types/school';
import { SCHLAR_PALETTES, DEFAULT_PALETTE, getPaletteById } from '../theme/palettes';
import {
  applyThemeToDom,
  getStoredActivePaletteId,
  saveStoredActivePaletteId,
  saveStoredActiveColors
} from '../theme/themeEngine';
import { getThemeClasses } from '../utils/themeHelper';
import { SchlarLogo } from './common/SchlarLogo';
import { CustomThemeEditorModal } from './theme/CustomThemeEditorModal';

interface ApprovedRoleItem {
  id: string;
  roleType?: RoleType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  demoUser: {
    name: string;
    designation: string;
  };
  hasDualPlatform?: boolean;
}

export const RoleSelector: React.FC = () => {
  const {
    switchRole,
    resetDemoData,
    students,
    teachers,
    showToast
  } = useSchool();

  const [activePaletteId, setActivePaletteId] = useState<string>(getStoredActivePaletteId);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Platform selection modal for Teacher (Teacher Web vs Teacher Mobile)
  const [teacherPlatformModalOpen, setTeacherPlatformModalOpen] = useState(false);

  const activePalette = getPaletteById(activePaletteId);
  const themeClasses = getThemeClasses(activePaletteId);

  // Switch palette helper
  const handleSelectPalette = (paletteId: string) => {
    const palette = getPaletteById(paletteId);
    setActivePaletteId(paletteId);
    saveStoredActivePaletteId(paletteId);
    saveStoredActiveColors(palette.colors);
    applyThemeToDom(palette.colors);
    showToast(`Theme switched to "${palette.name}" (Palette ${palette.paletteNumber})`, 'success');
  };

  const handleDownloadStandalone = () => {
    const link = document.createElement('a');
    link.href = '/edcore_school_management.html';
    link.download = 'edcore_school_management.html';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 4000);
  };

  // The 10 approved roles per authoritative Prompt 1 specification
  const APPROVED_ROLES: ApprovedRoleItem[] = [
    {
      id: 'admin',
      roleType: 'principal',
      title: 'Admin',
      subtitle: 'Institutional Leadership & School Governance',
      description: 'High-level administration across all standards 1–10. Oversees student rosters, faculty, timetable publishing, staff leaves, fee overview, and compliance audit trail.',
      icon: Shield,
      demoUser: {
        name: 'Dr. Evelyn Montgomery',
        designation: 'Principal & Head of School'
      }
    },
    {
      id: 'vice_principal',
      roleType: 'vice_principal',
      title: 'Vice Principal',
      subtitle: 'Curriculum Pacing, Timetables & Moderation',
      description: 'Direct pedagogical oversight, teacher duty substitutions, master timetable matrix conflict engine, marks moderation, syllabus coverage, and admit card fee clearance.',
      icon: Award,
      demoUser: {
        name: 'Prof. Marcus Vance',
        designation: 'Vice Principal & Academic Dean'
      }
    },
    {
      id: 'teacher',
      title: 'Teacher',
      subtitle: 'Classroom Instruction, Roll Call & Gradebook',
      description: 'Daily roll-call attendance register, unit test & term gradebook, assignments, weekly lesson timetable, leave requests, and parent communications.',
      icon: BookOpen,
      hasDualPlatform: true,
      badge: 'Web + Mobile Experience',
      demoUser: {
        name: 'Mrs. Shalini Verma',
        designation: 'Senior Faculty — Mathematics (8-A & 9-B)'
      }
    },
    {
      id: 'parent',
      roleType: 'parent_mobile',
      title: 'Parent',
      subtitle: 'Child Progress, Fee Payments & Attendance Alerts',
      description: 'Multi-child progress tracker, real-time attendance alerts, CBSE report cards, term fee checkout with instant digital receipts, and teacher chat.',
      icon: Users,
      badge: 'Mobile App Experience',
      demoUser: {
        name: 'Dr. Rajesh Sharma',
        designation: 'Guardian of Aarav (8-A) & Ananya (5-B)'
      }
    },
    {
      id: 'accountant',
      roleType: 'accountant',
      title: 'Accountant / Fee Manager',
      subtitle: 'Bursar, Fee Collections, Vouchers & Daybook',
      description: 'Tuition fee structures, student ledger cards, fee collection receipts, concession sanctioning, departmental expense vouchers, and double-entry daybook.',
      icon: DollarSign,
      demoUser: {
        name: 'Mr. David Reynolds',
        designation: 'Chief Bursar & Finance Officer'
      }
    },
    {
      id: 'hr_manager',
      roleType: 'hr_manager',
      title: 'HR / Staff Manager',
      subtitle: 'Staff Rosters, Leaves & Biometric Records',
      description: 'Faculty dossiers, biometric gate attendance, leave quota tracking and approvals, duty substitutions, appraisals, and payroll readiness rosters.',
      icon: UserCheck,
      demoUser: {
        name: 'Ms. Anita Desai',
        designation: 'Director of Human Resources'
      }
    },
    {
      id: 'librarian',
      roleType: 'librarian',
      title: 'Librarian',
      subtitle: 'Book Catalog, Circulation Desk & Overdue Fines',
      description: 'School library repository management, barcode check-out, member cards, tracking due books, fine collections, and catalog procurement.',
      icon: Library,
      demoUser: {
        name: 'Mr. Samuel O\'Connor',
        designation: 'Head Librarian'
      }
    },
    {
      id: 'transport_manager',
      roleType: 'transport_manager',
      title: 'Transport Manager',
      subtitle: 'Fleet Logistics, Bus Routes & Transit Safety',
      description: 'Campus vehicle fleet tracking, bus route planning, driver and conductor allocations, student pickup/drop manifests, and vehicle maintenance logs.',
      icon: Bus,
      demoUser: {
        name: 'Mr. Harpreet Singh',
        designation: 'Director of Campus Logistics & Fleet'
      }
    },
    {
      id: 'receptionist',
      roleType: 'receptionist',
      title: 'Receptionist / Front Office',
      subtitle: 'Visitor Passes, Enquiries & Admissions Desk',
      description: 'Front gate digital visitor badges, new student admission enquiries pipeline, gate passes, student movement logging, and emergency contact directories.',
      icon: PhoneCall,
      demoUser: {
        name: 'Ms. Clara Martinez',
        designation: 'Front Office Executive'
      }
    },
    {
      id: 'exam_coordinator',
      roleType: 'exam_coordinator',
      title: 'Exam Coordinator',
      subtitle: 'Exam Schedules, Seating & CBSE Grading',
      description: 'Institutional examination control: datesheet planning, seating plans, invigilation duty rosters, marks moderation, and CBSE 9-point grading scale report cards.',
      icon: CheckSquare,
      demoUser: {
        name: 'Dr. Sunita Kulkarni',
        designation: 'Chief Examination Controller'
      }
    }
  ];

  const handleRoleCardClick = (role: ApprovedRoleItem) => {
    if (role.id === 'teacher') {
      setTeacherPlatformModalOpen(true);
    } else if (role.id === 'parent') {
      switchRole('parent_mobile');
    } else if (role.roleType) {
      switchRole(role.roleType);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo & Institution */}
          <div className="flex items-center gap-3">
            <SchlarLogo size="md" variant="light" schoolSubtitle="Greenfield International School" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
              <span className="font-mono text-slate-400">v3.2</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                Standards 1–10 (CBSE)
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors shadow-2xs"
              title="Open SCHLAR Design Tokens & 12 Theme Palettes"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Theme Studio</span>
            </button>
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
              title="Reset sample students, faculty and fee records"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>
            <button
              onClick={handleDownloadStandalone}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-950/80 hover:bg-blue-900 border border-blue-800/80 rounded-xl transition-colors"
              title="Download standalone HTML file with zero server dependency"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Standalone HTML</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SCHLAR Institutional Demo · Greenfield International School</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Role & Launch Experience
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Welcome to SCHLAR, the premium school management platform. Explore 10 distinct institutional role experiences with shared persistent mock state in localStorage and dynamic 12-palette design token support.
          </p>

          {/* Quick Institutional Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-3 bg-slate-950/60 rounded-2xl border border-slate-800 max-w-2xl mx-auto shadow-md">
            <div>
              <div className="text-lg font-bold text-white tabular-nums">{students.length}</div>
              <div className="text-xs text-slate-400">Sample Students</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">{teachers.length}</div>
              <div className="text-xs text-slate-400">Faculty & Personnel</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">Std 1 to 10</div>
              <div className="text-xs text-slate-400">Academic Wing</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400 font-mono">10 Roles Active</div>
              <div className="text-xs text-slate-400">Role Workspaces</div>
            </div>
          </div>
        </div>

        {/* Palette Selector Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Active Brand Palette:
                </span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  Palette {activePalette.paletteNumber} · {activePalette.name}
                </span>
                {activePalette.isDefault && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Colors update across all 10 roles, sidebars, forms, tables, and mobile simulator in real time.
              </p>
            </div>

            {/* Quick 12-palette swatches button */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {SCHLAR_PALETTES.map(p => {
                  const isSelected = activePaletteId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPalette(p.id)}
                      title={`Palette ${p.paletteNumber}: ${p.name} (${p.colors.primary})`}
                      aria-label={`Select palette ${p.paletteNumber}: ${p.name}`}
                      className={`relative p-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'border-white bg-slate-800 shadow-md ring-2 ring-white/20'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center -space-x-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: p.colors.primary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: p.colors.secondary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: p.colors.accent }} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 pl-0.5 hidden xl:inline">
                        P{p.paletteNumber}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-white ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition-all shadow-xs hover:opacity-90 shrink-0"
                style={{ backgroundColor: activePalette.colors.primary }}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Theme Editor</span>
              </button>
            </div>
          </div>
        </div>

        {/* 10 Approved Roles Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <span>All 10 Approved Institutional Roles</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                10 Workspaces
              </span>
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Click any card to launch that role's interactive workspace
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {APPROVED_ROLES.map(role => {
              const IconComp = role.icon;
              return (
                <div
                  key={role.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div>
                    {/* Header with Icon and Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                        style={{ backgroundColor: activePalette.colors.primary }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      {role.badge ? (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/80 font-semibold">
                          {role.badge}
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 uppercase">
                          Web Workspace
                        </span>
                      )}
                    </div>

                    {/* Role Title and Subtitle */}
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5 mb-2 line-clamp-1">
                      {role.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {role.description}
                    </p>
                  </div>

                  {/* Demo User Info & Launch CTA */}
                  <div className="pt-3 border-t border-slate-900 mt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <div className="truncate">
                        <span className="text-slate-400">Demo User: </span>
                        <span className="text-slate-200 font-medium">{role.demoUser.name}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRoleCardClick(role)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md group-hover:opacity-95"
                      style={{ backgroundColor: activePalette.colors.primary }}
                    >
                      {role.hasDualPlatform ? (
                        <>
                          <span>Select Experience (Web / Mobile)</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      ) : (
                        <>
                          <span>Launch {role.title.split('/')[0].trim()}</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo Specification Notice */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-slate-300 shrink-0" />
            <span>
              <strong>SCHLAR Specification:</strong> Exactly 10 approved roles. Student and Super Admin are explicitly excluded. Teacher and Parent feature dual Web & Mobile platforms.
            </span>
          </div>
          <span className="text-slate-400 text-xs shrink-0 font-medium">
            Greenfield International School · CBSE Standards 1–10
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Greenfield International School. SCHLAR Academic Management Platform.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Offline-Ready (localStorage)</span>
            <span>·</span>
            <span>12 Authoritative Palettes</span>
            <span>·</span>
            <span>Responsive Web & Mobile Simulator</span>
          </div>
        </div>
      </footer>

      {/* PLATFORM CHOICE MODAL: TEACHER */}
      {teacherPlatformModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: activePalette.colors.primary }}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Teacher Experience</h3>
                  <p className="text-xs text-slate-400">Choose your workspace platform</p>
                </div>
              </div>
              <button
                onClick={() => setTeacherPlatformModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Teacher accounts support both the desktop web classroom portal and the mobile-first companion simulator for attendance roll call and on-the-go grading.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setTeacherPlatformModalOpen(false);
                  switchRole('teacher_web');
                }}
                className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-800/80 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300">Teacher Web Portal</h4>
                    <p className="text-xs text-slate-400">Full desktop gradebook, daily roll call, timetable, mark entry</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  setTeacherPlatformModalOpen(false);
                  switchRole('teacher_mobile');
                }}
                className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-800/80 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">Teacher Mobile App</h4>
                    <p className="text-xs text-slate-400">Mobile-first companion with instant roll call, lesson reminders</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reset All Demo Data?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              This will restore all default mock records for Greenfield International School, including student admissions, attendance, term marks, invoices, concessions, and library books. Any additions or edits you made during this session will be reverted.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Theme Editor Modal */}
      <CustomThemeEditorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onThemeApplied={(palId) => {
          setActivePaletteId(palId);
          setIsThemeModalOpen(false);
        }}
        showToast={showToast}
      />

      {/* Download notice */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-700 text-emerald-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>Standalone file <code>edcore_school_management.html</code> prepared and downloaded!</span>
        </div>
      )}
    </div>
  );
};
