import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  MessageSquare,
  Clock,
  AlertCircle,
  Receipt,
  Download,
  Send,
  Eye,
  Check,
  Percent,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { getThemeClasses } from '../../../utils/themeHelper';
import { FeeInvoice } from '../../../types/school';

export const ParentWebView: React.FC = () => {
  const {
    themeColor,
    students,
    activeChildId,
    setActiveChildId,
    attendance,
    marks,
    assignments,
    fees,
    feeConcessions,
    notices,
    recordFeePayment,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Available children under this parent account
  const myChildren = useMemo(() => {
    return students.filter(s => s.id === 'stu-101' || s.id === 'stu-102');
  }, [students]);

  const activeChild = myChildren.find(c => c.id === activeChildId) || myChildren[0] || students[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'marks' | 'attendance' | 'teachers'>('overview');
  const [payingInvoice, setPayingInvoice] = useState<FeeInvoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [viewingReceipt, setViewingReceipt] = useState<FeeInvoice | null>(null);

  const childFees = useMemo(() => fees.filter(f => f.studentId === activeChild?.id), [fees, activeChild?.id]);
  const childConcessions = useMemo(() => {
    return feeConcessions.filter(c => c.studentId === activeChild?.id && c.status === 'active');
  }, [feeConcessions, activeChild?.id]);

  const feeSummary = useMemo(() => {
    const totalAssigned = childFees.reduce((acc, f) => acc + f.amount, 0);
    const totalPaid = childFees.reduce((acc, f) => acc + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0);
    const totalOutstanding = childFees.reduce((acc, f) => acc + (f.status === 'paid' ? 0 : (f.remainingBalance ?? f.amount)), 0);
    const totalConcessions = childConcessions.reduce((acc, c) => acc + c.calculatedDeduction, 0);
    return { totalAssigned, totalPaid, totalOutstanding, totalConcessions };
  }, [childFees, childConcessions]);

  const childAttendance = useMemo(() => attendance.filter(a => a.studentId === activeChild?.id), [attendance, activeChild?.id]);
  const childMarks = useMemo(() => marks.filter(m => m.studentId === activeChild?.id), [marks, activeChild?.id]);

  const handleOpenPayModal = (inv: FeeInvoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.remainingBalance ?? (inv.status === 'paid' ? 0 : inv.amount));
    setPayMethod('UPI');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice || payAmount <= 0) return;
    recordFeePayment(payingInvoice.id, payAmount, payMethod);
    showToast(`Tuition installment of ₹${payAmount.toLocaleString()} settled successfully via ${payMethod}. Official receipt generated.`, 'success');
    setPayingInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Child Switcher Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-blue-50 text-blue-800 border border-blue-200">
              Parent Guardian Portal (Web)
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">AY 2026–2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Guardian Academic & Fee Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time child progress, fee settlement receipts, attendance alerts, and direct faculty communications.
          </p>
        </div>

        {/* Multi-Child Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          {myChildren.map(child => {
            const isSelected = child.id === activeChild?.id;
            return (
              <button
                key={child.id}
                onClick={() => setActiveChildId(child.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>{child.name}</span>
                <span className="text-[10px] font-mono text-slate-400">Std {child.standard}-{child.section}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Child Summary Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Attendance Record</span>
          <div className="text-2xl font-bold text-slate-900">{activeChild?.attendanceRate}%</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Good Standing (CBSE &gt; 75%)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Outstanding Tuition Due</span>
          <div className={`text-2xl font-bold font-mono ${
            feeSummary.totalOutstanding === 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            ₹{feeSummary.totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {feeSummary.totalOutstanding === 0 ? 'All terms settled' : 'Immediate settlement required'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Scholarship & Concessions</span>
          <div className="text-2xl font-bold text-amber-700 font-mono">₹{feeSummary.totalConcessions.toLocaleString()}</div>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">
            {childConcessions.length > 0 ? childConcessions[0].concessionType : 'No active concessions'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Academic Performance</span>
          <div className="text-2xl font-bold text-blue-700">Grade A2</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Rank #3 in Class {activeChild?.standard}-{activeChild?.section}</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'fees', label: 'Fees & Invoices Ledger' },
          { id: 'marks', label: 'Marks & Report Cards' },
          { id: 'attendance', label: 'Attendance Record' },
          { id: 'teachers', label: 'Faculty Messages' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeChild?.name}</h3>
                  <p className="text-xs text-slate-500">
                    Admission No: <strong className="font-mono text-slate-700">{activeChild?.admissionNo}</strong> · Roll #{activeChild?.rollNo}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {activeChild?.status} Status
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Academic Class</span>
                  <span className="font-semibold text-slate-800">Standard {activeChild?.standard}-{activeChild?.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">House Wing</span>
                  <span className="font-semibold text-slate-800">Kaveri Blue</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{activeChild?.dob}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Group</span>
                  <span className="font-semibold text-slate-800">{activeChild?.bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Invoices Alert Banner */}
            {feeSummary.totalOutstanding > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Term 2 Tuition Due Notification</span>
                  </span>
                  <span className="font-mono font-bold text-rose-700">₹{feeSummary.totalOutstanding.toLocaleString()}</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  Please settle pending dues before November 10, 2026 to ensure uninterrupted admit card issuance for final exams.
                </p>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-opacity hover:opacity-90 inline-flex items-center gap-1"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  <span>Go to Payment Center</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Notices */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">School Circulars & Notices</h3>
              <div className="space-y-3">
                {notices.slice(0, 4).map(n => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">{n.date} · {n.author}</span>
                    <h4 className="font-bold text-slate-800">{n.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEES & INVOICES LEDGER */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Sanctioned Fees</span>
              <span className="text-xl font-bold font-mono text-slate-900">₹{feeSummary.totalAssigned.toLocaleString()}</span>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-xs text-emerald-800 block">Total Paid to Date</span>
              <span className="text-xl font-bold font-mono text-emerald-800">₹{feeSummary.totalPaid.toLocaleString()}</span>
            </div>
            <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 shadow-2xs">
              <span className="text-xs text-rose-800 block">Outstanding Balance</span>
              <span className="text-xl font-bold font-mono text-rose-800">₹{feeSummary.totalOutstanding.toLocaleString()}</span>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-xs text-amber-800 block">Scholarship Deductions</span>
              <span className="text-xl font-bold font-mono text-amber-800">₹{feeSummary.totalConcessions.toLocaleString()}</span>
            </div>
          </div>

          {/* Active Concessions Card */}
          {childConcessions.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-700" />
                  <span>Sanctioned Scholarships & Concessions</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                  Active AY 2026–27
                </span>
              </div>
              {childConcessions.map(c => (
                <div key={c.id} className="p-3 bg-white rounded-xl border border-amber-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{c.concessionType}</span>
                    <span className="text-slate-500 text-[11px] block">{c.reason} · Ref #{c.concessionNo}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `-₹${c.discountValue.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Tuition Installments & Official Receipt Records</h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Fee Particular</th>
                    <th className="py-2.5 px-3">Sanctioned</th>
                    <th className="py-2.5 px-3">Settled / Due</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {childFees.map(fee => {
                    const isFullyPaid = fee.status === 'paid';
                    const remaining = fee.remainingBalance ?? (isFullyPaid ? 0 : fee.amount);

                    return (
                      <tr key={fee.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{fee.invoiceNo}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-slate-900">{fee.feeType}</span>
                          {fee.concessionApplied && (
                            <span className="block text-[10px] text-amber-700">
                              Less {fee.concessionType}: -₹{fee.concessionApplied.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">₹{fee.amount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">
                          <span className="text-emerald-700 block">Paid: ₹{(fee.paidAmount || (isFullyPaid ? fee.amount : 0)).toLocaleString()}</span>
                          {remaining > 0 && <span className="text-rose-700 block">Due: ₹{remaining.toLocaleString()}</span>}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{fee.dueDate}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            fee.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : fee.status === 'partial'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {fee.status === 'partial' ? 'Partial' : fee.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {remaining > 0 && (
                              <button
                                onClick={() => handleOpenPayModal(fee)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-white rounded-lg shadow-2xs hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: themeClasses.hex }}
                              >
                                Pay Online
                              </button>
                            )}
                            {(fee.status === 'paid' || fee.status === 'partial' || fee.receiptNo) && (
                              <button
                                onClick={() => setViewingReceipt(fee)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg inline-flex items-center gap-1"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKS */}
      {activeTab === 'marks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">CBSE Subject Scorecards & Unit Test Marks</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Exam Term</th>
                  <th className="py-2.5 px-3">Score Obtained</th>
                  <th className="py-2.5 px-3">Max Score</th>
                  <th className="py-2.5 px-3">Grade Point</th>
                  <th className="py-2.5 px-3">Teacher Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {childMarks.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{m.subject}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{m.examName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{m.marksObtained}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">/ {m.maxMarks}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {m.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 italic">{m.remarks || 'Consistent subject comprehension.'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Online Fee Settlement</h3>
            <p className="text-xs text-slate-500 mb-4">
              Invoice #{payingInvoice.invoiceNo} · {payingInvoice.feeType} for {activeChild?.name}
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount to Pay (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={payingInvoice.remainingBalance ?? payingInvoice.amount}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-base font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'NetBanking'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        payMethod === m ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                Payment simulation gateway for Greenfield International School demo. An official receipt will be generated immediately.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Confirm & Pay ₹{payAmount.toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official Paid Voucher
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">Receipt #{viewingReceipt.receiptNo || 'REC-2026-0994'}</h3>
              </div>
              <button onClick={() => setViewingReceipt(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                ✕ Close
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{activeChild?.name} (Std {activeChild?.standard}-{activeChild?.section})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee Particular:</span>
                <span className="font-bold text-slate-900">{viewingReceipt.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold font-mono text-emerald-700">₹{(viewingReceipt.paidAmount || viewingReceipt.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-slate-800">{viewingReceipt.paymentMethod || 'UPI Payment'}</span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => {
                  showToast('Official PDF receipt downloaded.', 'success');
                  setViewingReceipt(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs"
                style={{ backgroundColor: themeClasses.hex }}
              >
                Download Receipt PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
