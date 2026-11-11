import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Check,
  X,
  Eye,
  FileCheck,
  Clock,
  Users,
  AlertTriangle,
  Info,
  ExternalLink,
  Search
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ROLE_DEFINITIONS, PERMISSION_MATRIX } from '../../data/mockData';
import { getThemeClasses } from '../../utils/themeHelper';
import { RoleType } from '../../types/school';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentRole, themeColor, auditLogs } = useSchool();
  const [selectedRoleTab, setSelectedRoleTab] = useState<RoleType>(currentRole || 'principal');
  const [searchTerm, setSearchTerm] = useState('');
  const themeClasses = getThemeClasses(themeColor);

  if (!isOpen) return null;

  const currentRoleMeta = ROLE_DEFINITIONS.find(r => r.id === selectedRoleTab) || ROLE_DEFINITIONS[0];

  // Modules to show permissions for
  const allModules = [
    { id: 'Student Records', name: 'Student Records & Enrollment', desc: 'Dossiers, parent contacts, demographic data, and standard 1–10 enrollment' },
    { id: 'Staff & Teachers', name: 'Faculty & HR Management', desc: 'Faculty profiles, workload limits, leave approval, and substitute scheduling' },
    { id: 'Timetable Management', name: 'Timetable & Scheduling', desc: 'Master timetable slots, conflict resolution engine, and publication authority' },
    { id: 'Attendance Register', name: 'Daily Attendance Registers', desc: 'Classroom roll calls, attendance percentages, and monthly absence reports' },
    { id: 'Exams & Marks', name: 'Exams, Marks & Moderation', desc: 'Gradebook entries, exam scheduling, score moderation, and report cards' },
    { id: 'Finance & Fees', name: 'Finance, Fees & Billing', desc: 'Fee structures, invoices, collection receipts, and defaulter tracking' },
    { id: 'Front Office', name: 'Front Desk, Visitors & Enquiries', desc: 'Gate passes, visitor logs, parent appointments, and admission enquiries' },
    { id: 'Library System', name: 'Library & Circulation Desk', desc: 'Book catalog, borrow/return desk, due date reminders, and overdue fines' }
  ];

  // Helper to determine permissions for selected role
  const getRolePermission = (moduleName: string, role: RoleType) => {
    // Check custom rules per role
    switch (role) {
      case 'principal':
        return {
          canView: true,
          canCreate: true,
          canEdit: true,
          canApprove: true,
          canPublish: true,
          scope: 'School-Wide (Institutional Admin)',
          level: 'Full Administrative Authority',
          isRestricted: false,
          notes: 'Full unrestricted governance across all campus operations'
        };
      case 'vice_principal':
        if (moduleName === 'Finance & Fees') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Read-Only (Finance Oversight)',
            level: 'View Only',
            isRestricted: true,
            notes: 'Cannot collect fees, modify invoices, or alter fee structures'
          };
        }
        if (moduleName === 'Front Office' || moduleName === 'Library System') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: true,
            canPublish: false,
            scope: 'Supervisory Read',
            level: 'Supervisory Oversight',
            isRestricted: false,
            notes: 'Reviews logs and student conduct reports'
          };
        }
        return {
          canView: true,
          canCreate: true,
          canEdit: true,
          canApprove: true,
          canPublish: moduleName === 'Timetable Management' ? true : false,
          scope: 'Academic Scope (Standards 1–10)',
          level: 'Academic Coordination Control',
          isRestricted: false,
          notes: 'Endorses exam marks, approves staff leaves, and resolves timetable clashes'
        };
      case 'teacher_web':
      case 'teacher_mobile':
        if (['Attendance Register', 'Exams & Marks'].includes(moduleName)) {
          return {
            canView: true,
            canCreate: true,
            canEdit: true,
            canApprove: false,
            canPublish: false,
            scope: 'Assigned Classes (8-A, 8-B, 9-B)',
            level: 'Instructional Control',
            isRestricted: false,
            notes: 'Can mark attendance and grade students only in assigned subjects/classes'
          };
        }
        if (moduleName === 'Timetable Management') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Personal Schedule Only',
            level: 'View Only',
            isRestricted: true,
            notes: 'View own timetable and assigned rooms'
          };
        }
        if (moduleName === 'Student Records') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Assigned Class Roster',
            level: 'Class Scope Read',
            isRestricted: true,
            notes: 'Cannot alter official student registration details or admission numbers'
          };
        }
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canApprove: false,
          canPublish: false,
          scope: 'Access Restricted',
          level: 'No Access',
          isRestricted: true,
          notes: 'Strictly prohibited from financial transactions, school settings, or front desk clearance'
        };
      case 'accountant':
        if (moduleName === 'Finance & Fees') {
          return {
            canView: true,
            canCreate: true,
            canEdit: true,
            canApprove: true,
            canPublish: true,
            scope: 'School-Wide Finance',
            level: 'Full Financial Control',
            isRestricted: false,
            notes: 'Issues invoices, collects payments, generates official receipts, and tracks defaulters'
          };
        }
        if (moduleName === 'Student Records') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Billing & Fee Lookup Only',
            level: 'Demographic Read',
            isRestricted: true,
            notes: 'Can verify student roll number, parent phone, and standard for fee calculation'
          };
        }
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canApprove: false,
          canPublish: false,
          scope: 'Access Restricted',
          level: 'No Access',
          isRestricted: true,
          notes: 'No access to academic grades, curriculum, timetable scheduling, or teacher evaluations'
        };
      case 'receptionist':
        if (moduleName === 'Front Office') {
          return {
            canView: true,
            canCreate: true,
            canEdit: true,
            canApprove: true,
            canPublish: false,
            scope: 'Campus Gates & Front Desk',
            level: 'Operational Control',
            isRestricted: false,
            notes: 'Issues gate passes, logs visitors, schedules appointments, and enters admission enquiries'
          };
        }
        if (moduleName === 'Student Records' || moduleName === 'Staff & Teachers') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Emergency Directory Only',
            level: 'Contact Read Only',
            isRestricted: true,
            notes: 'Search parent contact numbers and teacher intercom numbers for visitor coordination'
          };
        }
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canApprove: false,
          canPublish: false,
          scope: 'Access Restricted',
          level: 'No Access',
          isRestricted: true,
          notes: 'Strictly restricted from grading, financial ledger entries, timetabling, or student dossiers'
        };
      case 'librarian':
        if (moduleName === 'Library System') {
          return {
            canView: true,
            canCreate: true,
            canEdit: true,
            canApprove: true,
            canPublish: true,
            scope: 'Campus Central Library',
            level: 'Full Library Control',
            isRestricted: false,
            notes: 'Catalog management, barcode indexing, book borrowing/return, and fine assessments'
          };
        }
        if (moduleName === 'Student Records' || moduleName === 'Staff & Teachers') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Borrower Verification Only',
            level: 'Membership Verification',
            isRestricted: true,
            notes: 'Verifies student ID / teacher employee code to issue library cards'
          };
        }
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canApprove: false,
          canPublish: false,
          scope: 'Access Restricted',
          level: 'No Access',
          isRestricted: true,
          notes: 'No access to academic grading, school fee invoicing, staff appraisals, or admissions'
        };
      case 'hr_manager':
        if (moduleName === 'Staff & Teachers') {
          return {
            canView: true,
            canCreate: true,
            canEdit: true,
            canApprove: true,
            canPublish: true,
            scope: 'School-Wide Faculty & Staff Dossiers',
            level: 'Full HR & Personnel Authority',
            isRestricted: false,
            notes: 'Enrolls personnel, manages leave quotas, assigns substitute duties, and audits payroll readiness'
          };
        }
        if (moduleName === 'Attendance Register') {
          return {
            canView: true,
            canCreate: true,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Staff Biometric Gate Logs Only',
            level: 'Biometric Attendance Read/Log',
            isRestricted: true,
            notes: 'Monitors staff RFID gate logs; strictly segregated from student roll calls'
          };
        }
        if (moduleName === 'Student Records') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Emergency Staff Directory Lookup',
            level: 'Directory Contact Read',
            isRestricted: true,
            notes: 'Contact verification only; no access to student dossiers, grades, or family finances'
          };
        }
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canApprove: false,
          canPublish: false,
          scope: 'Access Restricted',
          level: 'No Access',
          isRestricted: true,
          notes: 'Strictly segregated from student grading, fee collection, bursar vouchers, and school-wide governance'
        };
      case 'parent_mobile':
        if (['Student Records', 'Attendance Register', 'Exams & Marks', 'Timetable Management'].includes(moduleName)) {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Linked Children Only',
            level: 'Family Read Access',
            isRestricted: true,
            notes: 'Exclusively restricted to Aarav Sharma & Ananya Sharma; cannot view other students'
          };
        }
        if (moduleName === 'Finance & Fees') {
          return {
            canView: true,
            canCreate: false,
            canEdit: false,
            canApprove: false,
            canPublish: false,
            scope: 'Online Payment Gateway',
            level: 'Fee Settlement Access',
            isRestricted: false,
            notes: 'Can initiate simulated online payment and download fee receipts for linked children'
          };
        }
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canApprove: false,
          canPublish: false,
          scope: 'Access Restricted',
          level: 'No Access',
          isRestricted: true,
          notes: 'Strictly isolated from school-wide administrative data, faculty evaluations, or other families'
        };
      default:
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canApprove: false,
          canPublish: false,
          scope: 'Unknown',
          level: 'Restricted',
          isRestricted: true,
          notes: 'No authorization defined'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${themeClasses.lightBg} ${themeClasses.textColor} flex items-center justify-center font-bold`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">SCHLAR Institutional RBAC Security & Permission Matrix</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ISO-27001 & FERPA Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Granular role-based access control, scope enforcement, and compliance audit trail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="pt-4 pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Role to Audit Permissions:</span>
            <span className="text-xs text-slate-500">
              Active Session: <strong className="text-slate-900">{ROLE_DEFINITIONS.find(r => r.id === currentRole)?.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {ROLE_DEFINITIONS.map(r => {
              const isSelected = selectedRoleTab === r.id;
              const isCurrentSession = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleTab(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{r.title}</span>
                  {isCurrentSession && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Current Active Role" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Summary Banner */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{currentRoleMeta.title}</span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-semibold bg-slate-200 text-slate-700">
                {currentRoleMeta.platform} Platform
              </span>
            </div>
            <p className="text-slate-500 mt-0.5">{currentRoleMeta.description}</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Designated Demo Identity</span>
            <span className="font-semibold text-slate-800">{currentRoleMeta.demoUser.name}</span>
            <span className="text-[11px] text-slate-500 block font-mono">{currentRoleMeta.demoUser.email}</span>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">School Module</th>
                  <th className="py-2.5 px-2 text-center">View</th>
                  <th className="py-2.5 px-2 text-center">Create</th>
                  <th className="py-2.5 px-2 text-center">Edit</th>
                  <th className="py-2.5 px-2 text-center">Approve</th>
                  <th className="py-2.5 px-2 text-center">Publish</th>
                  <th className="py-2.5 px-3">Enforced Scope</th>
                  <th className="py-2.5 px-3">Governance Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allModules.map(mod => {
                  const perm = getRolePermission(mod.id, selectedRoleTab);
                  return (
                    <tr key={mod.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{mod.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{mod.desc}</div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.canView ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-500 font-bold text-[11px]">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.canCreate ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-500 font-bold text-[11px]">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.canEdit ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-500 font-bold text-[11px]">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.canApprove ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-500 font-bold text-[11px]">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.canPublish ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-500 font-bold text-[11px]">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                          perm.isRestricted
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {perm.scope}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500 max-w-xs">
                        {perm.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Audit Logs Trail */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Security & Governance Audit Log
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Immutable Compliance Trail</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-slate-700">
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-semibold shrink-0">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-900 shrink-0">{log.actorRole} ({log.actorName}):</span>
                    <span className="text-slate-500 truncate">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>SCHLAR RBAC enforces Zero-Trust per session and role boundaries.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
