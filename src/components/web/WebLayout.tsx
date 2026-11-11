import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  BookOpen,
  Award,
  PhoneCall,
  Library,
  ChevronLeft,
  ChevronRight,
  LogOut,
  RotateCcw,
  Sparkles,
  School,
  Search,
  Check,
  CheckCircle,
  FileText,
  UserCheck,
  CreditCard,
  MessageSquare,
  ArrowRightLeft,
  ChevronDown,
  Palette,
  Shield,
  ShieldCheck,
  Lock,
  Clock,
  X,
  Percent,
  Wallet,
  PieChart,
  Receipt,
  AlertTriangle,
  Bus,
  CheckSquare,
  User,
  Building2,
  Briefcase,
  Wrench,
  MapPin,
  Bookmark,
  Barcode,
  AlertCircle,
  Layers,
  Menu
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ROLE_DEFINITIONS, THEME_CONFIGS } from '../../data/mockData';
import { ThemeColor, RoleType } from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';
import { SCHLAR_PALETTES, getPaletteById } from '../../theme/palettes';
import {
  applyThemeToDom,
  getStoredActivePaletteId,
  saveStoredActivePaletteId,
  saveStoredActiveColors
} from '../../theme/themeEngine';

// Role views
import { PrincipalView } from './roles/PrincipalView';
import { VicePrincipalView } from './roles/VicePrincipalView';
import { TeacherWebView } from './roles/TeacherWebView';
import { AccountantView } from './roles/AccountantView';
import { ReceptionistView } from './roles/ReceptionistView';
import { LibrarianView } from './roles/LibrarianView';
import { HRManagerView } from './roles/HRManagerView';
import { TransportManagerView } from './roles/TransportManagerView';
import { ExamCoordinatorView } from './roles/ExamCoordinatorView';
import { RolePermissionsModal } from '../common/RolePermissionsModal';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { CustomThemeEditorModal } from '../theme/CustomThemeEditorModal';

interface NavGroup {
  groupName?: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const WebLayout: React.FC = () => {
  const {
    currentRole,
    switchRole,
    signOut,
    activeTab,
    setActiveTab,
    themeColor,
    setThemeColor,
    isSidebarCollapsed,
    toggleSidebar,
    resetDemoData,
    notices,
    showToast
  } = useSchool();

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [roleSwitchModalOpen, setRoleSwitchModalOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [customThemeModalOpen, setCustomThemeModalOpen] = useState(false);
  const [activePaletteId, setActivePaletteId] = useState<string>(getStoredActivePaletteId);

  const themeClasses = getThemeClasses(themeColor);
  const roleMeta = ROLE_DEFINITIONS.find(r => r.id === currentRole) || ROLE_DEFINITIONS[0];
  const activePalette = getPaletteById(activePaletteId);

  const handleSelectPalette = (paletteId: string) => {
    const palette = getPaletteById(paletteId);
    setActivePaletteId(paletteId);
    saveStoredActivePaletteId(paletteId);
    saveStoredActiveColors(palette.colors);
    applyThemeToDom(palette.colors);
    setThemeDropdownOpen(false);
    showToast(`Theme switched to "${palette.name}" (Palette ${palette.paletteNumber})`, 'success');
  };

  // Categorized enterprise navigation items
  const getCategorizedNav = (): NavGroup[] => {
    switch (currentRole) {
      case 'principal':
        return [
          {
            groupName: 'Executive',
            items: [
              { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }
            ]
          },
          {
            groupName: 'People & HR',
            items: [
              { id: 'students', label: 'Student Directory', icon: GraduationCap },
              { id: 'teachers', label: 'Faculty & HR Staff', icon: Users }
            ]
          },
          {
            groupName: 'Academics & Operations',
            items: [
              { id: 'attendance', label: 'Attendance & Operations', icon: UserCheck },
              { id: 'classes', label: 'Classes & Wings', icon: BookOpen },
              { id: 'timetable', label: 'Timetable Master', icon: Calendar },
              { id: 'exams', label: 'Exams & Marks', icon: Award },
              { id: 'assignments', label: 'Assignments Monitor', icon: FileText }
            ]
          },
          {
            groupName: 'Institutional',
            items: [
              { id: 'notices', label: 'Notices & Circulars', icon: Bell },
              { id: 'events', label: 'Campus Events', icon: Calendar },
              { id: 'finance', label: 'Finance & Bursar', icon: DollarSign },
              { id: 'reports', label: 'Institutional Reports', icon: FileText },
              { id: 'settings', label: 'Settings & Security', icon: Settings }
            ]
          }
        ];
      case 'vice_principal':
        return [
          {
            groupName: 'Academic Governance',
            items: [
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'academic_ops', label: 'Academic Operations', icon: BookOpen },
              { id: 'classes', label: 'Class & Section Oversight', icon: School },
              { id: 'attendance', label: 'Attendance Oversight', icon: UserCheck },
              { id: 'timetable', label: 'Timetable Coordination', icon: Calendar }
            ]
          },
          {
            groupName: 'Faculty & Curriculum',
            items: [
              { id: 'coordination', label: 'Teacher Coordination', icon: Users },
              { id: 'substitutions', label: 'Leaves & Substitutions', icon: ArrowRightLeft },
              { id: 'subjects', label: 'Subject Curriculum', icon: BookOpen }
            ]
          },
          {
            groupName: 'Students & Assessments',
            items: [
              { id: 'progress', label: 'Student Progress', icon: GraduationCap },
              { id: 'exams', label: 'Examinations & Results', icon: Award },
              { id: 'assignments', label: 'Assignments Oversight', icon: FileText }
            ]
          },
          {
            groupName: 'Institutional',
            items: [
              { id: 'notices', label: 'Announcements', icon: Bell },
              { id: 'reports', label: 'Academic Reports', icon: FileText },
              { id: 'settings', label: 'Profile & Settings', icon: Settings }
            ]
          }
        ];
      case 'teacher_web':
        return [
          {
            groupName: 'Teaching & Schedule',
            items: [
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'classes', label: 'My Classes', icon: BookOpen },
              { id: 'attendance', label: 'Attendance', icon: UserCheck },
              { id: 'timetable', label: 'Timetable', icon: Calendar }
            ]
          },
          {
            groupName: 'Academic Workflow',
            items: [
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'exams', label: 'Examinations', icon: Award },
              { id: 'marks', label: 'Marks & Results', icon: CheckSquare },
              { id: 'progress', label: 'Student Progress', icon: GraduationCap }
            ]
          },
          {
            groupName: 'Communication & Account',
            items: [
              { id: 'notices', label: 'Announcements', icon: Bell },
              { id: 'settings', label: 'Profile & Settings', icon: Settings }
            ]
          }
        ];
      case 'accountant':
        return [
          {
            groupName: 'Bursar Overview',
            items: [
              { id: 'dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
              { id: 'collections', label: 'Fee Collection', icon: CreditCard },
              { id: 'daybook', label: 'Payment History & Daybook', icon: Receipt }
            ]
          },
          {
            groupName: 'Student Accounts & Billing',
            items: [
              { id: 'students', label: 'Student Fee Accounts', icon: Users },
              { id: 'structure', label: 'Fee Structure', icon: DollarSign },
              { id: 'pending_overdue', label: 'Outstanding Dues', icon: AlertTriangle },
              { id: 'concessions', label: 'Concessions & Scholarships', icon: Percent },
              { id: 'adjustments', label: 'Refunds & Adjustments', icon: ArrowRightLeft }
            ]
          },
          {
            groupName: 'Expenditure & Audit',
            items: [
              { id: 'expenses', label: 'Expenses & Vouchers', icon: Wallet },
              { id: 'budgets', label: 'Departmental Budgets', icon: PieChart },
              { id: 'receipts', label: 'Official Receipts', icon: CheckCircle },
              { id: 'payroll_attendance', label: 'Staff Payroll Attendance', icon: UserCheck },
              { id: 'reports', label: 'Finance Reports', icon: FileText },
              { id: 'profile', label: 'My Profile', icon: User }
            ]
          }
        ];
      case 'receptionist':
        return [
          {
            groupName: 'Overview',
            items: [
              { id: 'dashboard', label: 'Front Office Dashboard', icon: LayoutDashboard }
            ]
          },
          {
            groupName: 'Visitor Operations',
            items: [
              { id: 'visitors', label: 'Active Visitors & Passes', icon: Users },
              { id: 'visitor_history', label: 'Visit History Register', icon: Clock }
            ]
          },
          {
            groupName: 'Enquiries & Leads',
            items: [
              { id: 'enquiries', label: 'Admission Enquiries', icon: PhoneCall },
              { id: 'followups', label: 'Follow-ups Tracker', icon: CheckSquare }
            ]
          },
          {
            groupName: 'Appointments',
            items: [
              { id: 'appointments', label: 'Appointments Schedule', icon: Calendar }
            ]
          },
          {
            groupName: 'Desk & Helpdesk',
            items: [
              { id: 'call_log', label: 'Phone Call Log', icon: PhoneCall },
              { id: 'requests', label: 'Reception Requests', icon: MessageSquare }
            ]
          },
          {
            groupName: 'Records & Registry',
            items: [
              { id: 'directory', label: 'Directory Lookup', icon: Search },
              { id: 'documents', label: 'Document Requests', icon: FileText },
              { id: 'reports', label: 'Daily Register & Reports', icon: Receipt },
              { id: 'profile', label: 'Front Desk Profile', icon: User }
            ]
          }
        ];
      case 'librarian':
        return [
          {
            groupName: 'Circulation & Loans',
            items: [
              { id: 'dashboard', label: 'Circulation Terminal', icon: LayoutDashboard },
              { id: 'issue_books', label: 'Issue Books Desk', icon: ArrowRightLeft },
              { id: 'return_books', label: 'Return Books Desk', icon: RotateCcw },
              { id: 'active_loans', label: 'Active Loans', icon: BookOpen },
              { id: 'overdue_books', label: 'Overdue Books', icon: Clock },
              { id: 'reservations', label: 'Book Reservations', icon: Bookmark }
            ]
          },
          {
            groupName: 'Catalogue & Inventory',
            items: [
              { id: 'catalogue', label: 'Book Catalogue', icon: Library },
              { id: 'inventory', label: 'Physical Copy Inventory', icon: Layers },
              { id: 'categories', label: 'Categories & Genres', icon: Bookmark },
              { id: 'authors', label: 'Authors & Publishers', icon: Building2 },
              { id: 'lost_damaged', label: 'Lost & Damaged Books', icon: AlertCircle }
            ]
          },
          {
            groupName: 'Members & Records',
            items: [
              { id: 'members', label: 'Library Members', icon: Users },
              { id: 'transactions', label: 'Circulation Transactions', icon: Receipt },
              { id: 'reports', label: 'Library Reports', icon: FileText },
              { id: 'profile', label: 'My Profile', icon: User }
            ]
          }
        ];
      case 'hr_manager':
        return [
          {
            groupName: 'Staff & Organizational Structure',
            items: [
              { id: 'dashboard', label: 'HR Dashboard', icon: LayoutDashboard },
              { id: 'staff', label: 'Staff Directory', icon: Users },
              { id: 'profiles', label: 'Staff Profiles', icon: UserCheck },
              { id: 'departments', label: 'Departments & Designations', icon: Building2 },
              { id: 'attendance', label: 'Staff Attendance', icon: Clock }
            ]
          },
          {
            groupName: 'Duty & Talent Operations',
            items: [
              { id: 'leaves', label: 'Leave Management', icon: Calendar },
              { id: 'work_assignments', label: 'Work Assignments', icon: ArrowRightLeft },
              { id: 'documents', label: 'Employment Documents', icon: FileText },
              { id: 'recruitment', label: 'Recruitment & Candidates', icon: Briefcase }
            ]
          },
          {
            groupName: 'Compensation & Governance',
            items: [
              { id: 'payroll', label: 'Payroll Overview', icon: Wallet },
              { id: 'reports', label: 'HR Reports', icon: PieChart },
              { id: 'profile', label: 'My Profile', icon: User }
            ]
          }
        ];
      case 'transport_manager':
        return [
          {
            groupName: 'Fleet Operations & Maintenance',
            items: [
              { id: 'dashboard', label: 'Transit Dashboard', icon: LayoutDashboard },
              { id: 'vehicles', label: 'Vehicle Fleet Register', icon: Bus },
              { id: 'maintenance', label: 'Vehicle Maintenance & Logs', icon: Wrench },
              { id: 'drivers', label: 'Drivers & Transport Staff', icon: Users },
              { id: 'incidents', label: 'Transport Incident Register', icon: AlertTriangle }
            ]
          },
          {
            groupName: 'Routes & Commuter Operations',
            items: [
              { id: 'routes', label: 'Bus Routes & Stops', icon: MapPin },
              { id: 'stops', label: 'Bus Stops & Schedules', icon: Clock },
              { id: 'assignments', label: 'Student Commuter Allocations', icon: UserCheck },
              { id: 'rosters', label: 'Route Passenger Rosters', icon: FileText }
            ]
          },
          {
            groupName: 'Safety, Broadcasts & Governance',
            items: [
              { id: 'announcements', label: 'Transit Broadcasts & Alerts', icon: Bell },
              { id: 'reports', label: 'Fleet & Route Reports', icon: PieChart },
              { id: 'profile', label: 'My Profile', icon: User }
            ]
          }
        ];
      case 'exam_coordinator':
        return [
          {
            groupName: 'Assessment Control',
            items: [
              { id: 'dashboard', label: 'Exam Directorate', icon: LayoutDashboard },
              { id: 'datesheet', label: 'Exam Datesheet Scheduler', icon: Calendar },
              { id: 'seating', label: 'Seating & Room Plans', icon: Users }
            ]
          },
          {
            groupName: 'Evaluation & CBSE',
            items: [
              { id: 'moderation', label: 'Marks Moderation', icon: Award },
              { id: 'grading', label: 'CBSE 9-Point Grading', icon: FileText },
              { id: 'report_cards', label: 'Report Card Generator', icon: CheckSquare }
            ]
          }
        ];
      case 'parent_web':
        return [
          {
            groupName: 'Guardian Portal',
            items: [
              { id: 'dashboard', label: 'Child Dashboard', icon: LayoutDashboard },
              { id: 'fees', label: 'Tuition Fees & Invoices', icon: DollarSign },
              { id: 'marks', label: 'Marks & Report Cards', icon: Award },
              { id: 'attendance', label: 'Attendance Record', icon: Calendar },
              { id: 'notices', label: 'School Notices', icon: Bell }
            ]
          }
        ];
      default:
        return [
          {
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
            ]
          }
        ];
    }
  };

  const navGroups = getCategorizedNav();

  const getClearanceTag = () => {
    switch (currentRole) {
      case 'admin':
      case 'principal':
        return { label: 'Clearance Level 5 · Administrative Authority', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'vice_principal':
        return { label: 'Clearance Level 4 · Academic Governance', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'exam_coordinator':
        return { label: 'Clearance Level 3 · Examination Controller', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'accountant':
        return { label: 'Clearance Level 3 · Finance & Collections', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'hr_manager':
        return { label: 'Clearance Level 3 · Human Resources & Personnel', color: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'transport_manager':
        return { label: 'Clearance Level 2 · Fleet & Transit Logistics', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'receptionist':
        return { label: 'Clearance Level 2 · Front Office & Registry', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'librarian':
        return { label: 'Clearance Level 2 · Library Circulation', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'teacher_web':
        return { label: 'Clearance Level 2 · Assigned Classroom Scope', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'parent_web':
        return { label: 'Clearance Level 1 · Guardian Child Scope', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Standard Access', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const clearance = getClearanceTag();

  const renderActiveView = () => {
    switch (currentRole) {
      case 'admin':
      case 'principal':
        return <PrincipalView />;
      case 'vice_principal':
        return <VicePrincipalView />;
      case 'teacher_web':
        return <TeacherWebView />;
      case 'accountant':
        return <AccountantView />;
      case 'hr_manager':
        return <HRManagerView />;
      case 'transport_manager':
        return <TransportManagerView />;
      case 'receptionist':
        return <ReceptionistView />;
      case 'librarian':
        return <LibrarianView />;
      case 'exam_coordinator':
        return <ExamCoordinatorView />;
      case 'parent_web':
        return (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 m-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Parent Experience is Mobile-Only</h3>
            <p className="text-xs text-slate-500">SCHLAR parents utilize the dedicated Greenfield Parent Mobile Companion app.</p>
            <button
              onClick={() => switchRole('parent_mobile')}
              className="px-4 py-2 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Launch Parent Mobile Companion
            </button>
          </div>
        );
      default:
        return <PrincipalView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-row text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* MOBILE NAVIGATION DRAWER (Viewport < lg)                                  */}
      {/* ========================================================================= */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 text-slate-200 z-50 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${themeClasses.primaryBg} text-white flex items-center justify-center font-bold shrink-0 shadow-sm`}>
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                      SCHLAR
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">v3.2</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Greenfield Int. School</div>
                  </div>
                </div>

                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Workspace Card */}
              <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 shrink-0">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspace</div>
                <div className="text-xs font-bold text-white truncate mt-0.5">{roleMeta.title}</div>
                <div className="text-[11px] text-slate-400 truncate">{roleMeta.demoUser.name}</div>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="p-2 space-y-4 flex-1">
                {navGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    {group.groupName && (
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-1">
                        {group.groupName}
                      </div>
                    )}
                    {group.items.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                          }`}
                          style={{
                            backgroundColor: isActive ? themeClasses.hex : 'transparent'
                          }}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1 text-left">{item.label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Drawer Footer Controls */}
            <div className="p-3 border-t border-slate-800 space-y-1.5 shrink-0 bg-slate-950/60">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  setRoleSwitchModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Switch Role Experience</span>
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Sign Out to Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR NAVIGATION (Viewport >= lg)                               */}
      {/* ========================================================================= */}
      <aside
        className={`hidden lg:flex bg-slate-900 text-slate-200 border-r border-slate-800/90 flex-col justify-between shrink-0 transition-all duration-300 ease-in-out sticky top-0 h-screen z-30 ${
          isSidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <div className={`flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <div className={`w-9 h-9 rounded-xl ${themeClasses.primaryBg} text-white flex items-center justify-center font-bold shrink-0 shadow-sm`}>
                <School className="w-5 h-5" />
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    SCHLAR
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal font-mono">v3.2</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Greenfield Int. School</div>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand Button for Collapsed Mode */}
          {isSidebarCollapsed && (
            <div className="py-2 flex justify-center border-b border-slate-800 shrink-0">
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Active Role Card in Sidebar */}
          {!isSidebarCollapsed ? (
            <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 shrink-0">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspace</div>
              <div className="text-xs font-bold text-white truncate mt-0.5">{roleMeta.title}</div>
              <div className="text-[11px] text-slate-400 truncate">{roleMeta.demoUser.name}</div>
            </div>
          ) : (
            <div className="py-2.5 text-center shrink-0" title={`${roleMeta.title} (${roleMeta.demoUser.name})`}>
              <span className="w-2.5 h-2.5 rounded-full inline-block ring-2 ring-slate-800" style={{ backgroundColor: themeClasses.hex }} />
            </div>
          )}

          {/* Categorized Navigation Menu */}
          <nav className="p-2 space-y-4 flex-1">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {group.groupName && !isSidebarCollapsed && (
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-1">
                    {group.groupName}
                  </div>
                )}
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group ${
                        isActive
                          ? 'text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                      style={{
                        backgroundColor: isActive ? themeClasses.hex : 'transparent'
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {isActive && !isSidebarCollapsed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-2 border-t border-slate-800/80 space-y-1 shrink-0 bg-slate-950/40">
          <button
            onClick={() => setRoleSwitchModalOpen(true)}
            title={isSidebarCollapsed ? 'Switch Role' : undefined}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4 shrink-0 text-slate-400" />
            {!isSidebarCollapsed && <span>Switch Role</span>}
          </button>

          <button
            onClick={signOut}
            title={isSidebarCollapsed ? 'Sign Out to Hub' : undefined}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            {!isSidebarCollapsed && <span>Sign Out to Hub</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs">
          {/* Breadcrumb Trail & Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs truncate min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg shrink-0"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-slate-900 tracking-tight shrink-0">SCHLAR</span>
            <span className="text-slate-400 font-mono">/</span>
            <span className="font-semibold text-slate-700 truncate max-w-[100px] sm:max-w-none">{roleMeta.title.split('/')[0].trim()}</span>
            <span className="text-slate-400 font-mono">/</span>
            <span className="text-slate-600 font-medium capitalize truncate max-w-[120px] sm:max-w-none">{activeTab.replace(/_/g, ' ')}</span>
            <span className="hidden xl:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 ml-2">
              AY 2026–27 · Term 2
            </span>
          </div>

          {/* Center / Right Header Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Global Search Bar (Trigger for Command Palette) */}
            <button
              onClick={() => setGlobalSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-400 hover:text-slate-600 text-xs transition-colors w-40 lg:w-60"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Quick search (⌘K)...</span>
              <kbd className="ml-auto font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 border border-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Indicator & Drawer Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
                title="Institutional Notices & Alerts"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Campus Circulars</h4>
                    <span className="text-[10px] text-blue-700 font-semibold">{notices.length} Active</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notices.slice(0, 3).map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                        <div className="flex justify-between items-center font-bold text-slate-900">
                          <span className="truncate">{n.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{n.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{n.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('notices');
                        setNotificationsOpen(false);
                      }}
                      className="text-blue-700 hover:underline font-semibold text-[11px]"
                    >
                      View All Notices &rarr;
                    </button>
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        showToast('Notifications marked as acknowledged', 'info');
                      }}
                      className="text-slate-400 hover:text-slate-600 text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RBAC Inspection Button */}
            <button
              onClick={() => setPermissionsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-colors shadow-2xs"
              title="Inspect Active Role Security Matrix & Authorization Scopes"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">RBAC Matrix</span>
            </button>

            {/* Enhanced Theme Selector Dropdown (12 Presets + Custom HEX Studio) */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                title="Change theme & palette"
                aria-label="Change theme palette"
              >
                <span className="w-2.5 h-2.5 rounded-full ring-1 ring-slate-300" style={{ backgroundColor: themeClasses.hex }} />
                <span className="hidden sm:inline capitalize">{activePalette?.name || themeColor}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in max-h-80 overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Institutional Palettes
                  </div>
                  <div className="space-y-0.5">
                    {SCHLAR_PALETTES.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPalette(p.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl transition-colors ${
                          activePaletteId === p.id
                            ? 'bg-slate-100 font-bold text-slate-900'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-3 h-3 rounded-full shrink-0 border border-slate-300" style={{ backgroundColor: p.colors.primary }} />
                          <span className="truncate">{p.name}</span>
                        </div>
                        {activePaletteId === p.id && <Check className="w-3.5 h-3.5 text-slate-800 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setThemeDropdownOpen(false);
                        setCustomThemeModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors justify-center shadow-xs"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Custom HEX Studio...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Button */}
            <button
              onClick={() => setRoleSwitchModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Switch Role</span>
            </button>

            {/* Profile Avatar & Details Dropdown */}
            <div className="relative pl-1 border-l border-slate-200">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 text-left p-1 rounded-xl hover:bg-slate-100 transition-colors"
                title="User profile settings"
              >
                <div
                  className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  {roleMeta.demoUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-900 truncate max-w-[120px]">{roleMeta.demoUser.name}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{roleMeta.demoUser.designation}</div>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in text-xs space-y-1">
                  <div className="p-2.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{roleMeta.demoUser.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{roleMeta.demoUser.email}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">{clearance.label}</div>
                  </div>
                  <button
                    onClick={() => {
                      setPermissionsModalOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-slate-700 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>RBAC Permissions</span>
                  </button>
                  <button
                    onClick={() => {
                      setResetConfirmOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-slate-700 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset Demo Data</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-rose-50 text-rose-700 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out to Hub</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Institutional RBAC Clearance Strip */}
        <section className="bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RBAC Scope:</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full border font-mono text-[11px] font-semibold ${clearance.color}`}>
              {clearance.label}
            </span>
            <span className="text-slate-400 hidden md:inline">·</span>
            <div className="text-slate-600 text-[11px] truncate max-w-xl">
              {currentRole === 'principal' && 'Unrestricted Campus Authority · Complete CRUD · Staff HR · Financial Realization'}
              {currentRole === 'vice_principal' && 'Academic Governance · Mark Moderation · Timetable Coordination'}
              {currentRole === 'teacher_web' && 'Assigned Classes 8-A, 8-B, 7-A · Daily Roll-Call · Gradebook & Homework'}
              {currentRole === 'accountant' && 'Bursar Collections & Invoices · Fee Structures · Receipts Audit'}
              {currentRole === 'hr_manager' && 'Faculty & Staff Dossiers · Biometric Gate Logs · Leave Approvals & Workload Rosters'}
              {currentRole === 'receptionist' && 'Front Desk Terminal · Visitor Passes · Admission Enquiries CRM'}
              {currentRole === 'librarian' && 'Circulation Terminal · Repository Catalog · Borrow/Return Log'}
            </div>
          </div>

          <button
            onClick={() => setPermissionsModalOpen(true)}
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View Permissions Matrix</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </section>

        {/* Main Content Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Command Palette Search Modal */}
      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        onSelectTab={tabId => setActiveTab(tabId)}
      />

      {/* Switch Role Modal */}
      {roleSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Switch Role Workspace</h3>
                <p className="text-xs text-slate-500">Jump directly into any of the 10 authorized role workspaces</p>
              </div>
              <button
                onClick={() => setRoleSwitchModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLE_DEFINITIONS.filter(r => r.id !== 'parent_web').map(r => (
                <div
                  key={r.id}
                  onClick={() => {
                    switchRole(r.id as RoleType);
                    setRoleSwitchModalOpen(false);
                    showToast(`Switched active workspace to ${r.title}`, 'info');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:-translate-y-0.5 ${
                    currentRole === r.id
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{r.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600 uppercase">
                      {r.platform}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{r.description}</p>
                  <div className="text-[10px] text-blue-700 font-medium mt-1">{r.demoUser.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Reset All Demo Data?</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              This will reload Greenfield International School seed data (students, faculty, attendance, invoices, marks, books). Any records added or modified in this session will revert to default.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetConfirmOpen(false);
                  showToast('Institutional seed data restored to initial state', 'success');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-xs"
              >
                Reset Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Permissions & RBAC Modal */}
      <RolePermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
      />

      {/* Custom Theme Editor & Palette Studio Modal */}
      <CustomThemeEditorModal
        isOpen={customThemeModalOpen}
        onClose={() => setCustomThemeModalOpen(false)}
        onThemeApplied={(paletteId, colors) => {
          saveStoredActivePaletteId(paletteId);
          saveStoredActiveColors(colors);
          applyThemeToDom(colors);
          setActivePaletteId(paletteId);
          showToast('Theme applied successfully across SCHLAR.', 'success');
        }}
        showToast={showToast}
      />
    </div>
  );
};
