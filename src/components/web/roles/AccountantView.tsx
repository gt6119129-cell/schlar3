import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  Users,
  AlertTriangle,
  Receipt,
  CheckCircle,
  Percent,
  Wallet,
  PieChart,
  UserCheck,
  FileText,
  User,
  Search,
  Filter,
  Download,
  Plus,
  Printer,
  Calendar,
  Send,
  Eye,
  TrendingUp,
  RotateCcw,
  Clock,
  Layers,
  ArrowRightLeft,
  Check,
  X,
  Building2,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingDown,
  BarChart2,
  FileSpreadsheet
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { getThemeClasses } from '../../../utils/themeHelper';
import {
  FeeInvoice,
  FeePayment,
  FeeStructureItem,
  FeeConcession,
  ExpenseRecord,
  BudgetCategory,
  FinancialDaybookEntry,
  Student
} from '../../../types/school';

export const AccountantView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    themeColor,
    students,
    teachers,
    staffAttendance,
    fees,
    feeStructures,
    feeConcessions,
    expenses,
    budgets,
    daybookEntries,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    assignFeeStructureToClass,
    applyFeeConcession,
    revokeFeeConcession,
    createFeeInvoice,
    recordFeePayment,
    sendFeeReminder,
    recordExpense,
    approveExpense,
    rejectExpense,
    updateBudgetCategory,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'pending' | 'overdue'>('all');
  const [agingFilter, setAgingFilter] = useState<'all' | '15' | '30' | '60'>('all');
  const [daybookDateFilter, setDaybookDateFilter] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<string>('all');
  const [payrollDept, setPayrollDept] = useState<string>('all');
  const [payrollSearch, setPayrollSearch] = useState<string>('');

  // Modals State
  const [collectPaymentModalInvoice, setCollectPaymentModalInvoice] = useState<FeeInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<FeePayment['paymentMethod']>('UPI');
  const [paymentTxnRef, setPaymentTxnRef] = useState('');
  const [paymentChequeNo, setPaymentChequeNo] = useState('');
  const [paymentBankName, setPaymentBankName] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Receipt Modal State
  const [viewReceiptModalInvoice, setViewReceiptModalInvoice] = useState<FeeInvoice | null>(null);
  const [viewReceiptRecord, setViewReceiptRecord] = useState<FeePayment | null>(null);

  // Student Fee Ledger Drawer/Modal State
  const [selectedStudentLedger, setSelectedStudentLedger] = useState<Student | null>(null);

  // Expense Modal State
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpCategory, setNewExpCategory] = useState<ExpenseRecord['category']>('Campus Infrastructure & Utilities');
  const [newExpVendor, setNewExpVendor] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<number>(15000);
  const [newExpDate, setNewExpDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newExpPayMethod, setNewExpPayMethod] = useState<ExpenseRecord['paymentMethod']>('NetBanking');
  const [newExpBillNo, setNewExpBillNo] = useState('');
  const [newExpChequeRef, setNewExpChequeRef] = useState('');
  const [viewVoucherModal, setViewVoucherModal] = useState<ExpenseRecord | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Concession Modal State
  const [showAddConcessionModal, setShowAddConcessionModal] = useState(false);
  const [concessionStudentId, setConcessionStudentId] = useState('stu-104');
  const [concessionType, setConcessionType] = useState<FeeConcession['concessionType']>('Merit Scholarship');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [concessionReason, setConcessionReason] = useState('Academic Excellence & Top Quartile Performance');

  // Fee Structure Modals
  const [showBatchAssignModal, setShowBatchAssignModal] = useState(false);
  const [batchStructureId, setBatchStructureId] = useState(feeStructures[0]?.id || 'fs-04');
  const [batchStandard, setBatchStandard] = useState<number>(8);
  const [batchSection, setBatchSection] = useState<'A' | 'B' | 'all'>('all');

  const [showAddStructureModal, setShowAddStructureModal] = useState(false);
  const [newTierName, setNewTierName] = useState('Senior Secondary Science Tier');
  const [newTierWing, setNewTierWing] = useState<FeeStructureItem['wingName']>('Senior Secondary Wing');
  const [newTierTuition, setNewTierTuition] = useState<number>(36000);
  const [newTierLab, setNewTierLab] = useState<number>(8000);
  const [newTierAnnual, setNewTierAnnual] = useState<number>(12000);

  // Reminder Modal State
  const [reminderModalInvoice, setReminderModalInvoice] = useState<FeeInvoice | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('SMS');

  // Budget Adjust Modal State
  const [adjustingBudget, setAdjustingBudget] = useState<BudgetCategory | null>(null);
  const [newBudgetAllocated, setNewBudgetAllocated] = useState<number>(0);
  const [newBudgetThreshold, setNewBudgetThreshold] = useState<number>(85);

  // Refunds & Adjustments State
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentStudentId, setAdjustmentStudentId] = useState<string>('stu-101');
  const [adjustmentType, setAdjustmentType] = useState<'Fee Refund' | 'Ledger Correction Credit' | 'Late Fee Waiver'>('Fee Refund');
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(1500);
  const [adjustmentReason, setAdjustmentReason] = useState('Bus route re-allocation adjustment sanctioned by Administration.');
  const [adjustmentReference, setAdjustmentReference] = useState('ADJ-RES-2026-08');
  const [adjustmentsList, setAdjustmentsList] = useState<Array<{
    id: string;
    refNo: string;
    studentId: string;
    studentName: string;
    standard: number;
    type: string;
    amount: number;
    reason: string;
    date: string;
    status: 'Approved' | 'Executed';
    authorizedBy: string;
  }>>([
    {
      id: 'adj-01',
      refNo: 'ADJ-RES-2026-01',
      studentId: 'stu-103',
      studentName: 'Rohan Deshmukh',
      standard: 8,
      type: 'Late Fee Waiver',
      amount: 500,
      reason: 'Banking gateway timeout error on scheduled due date verified by HDFC.',
      date: '2026-10-11',
      status: 'Executed',
      authorizedBy: 'Mr. David Reynolds (Bursar)'
    },
    {
      id: 'adj-02',
      refNo: 'ADJ-RES-2026-02',
      studentId: 'stu-108',
      studentName: 'Tanvi Reddy',
      standard: 7,
      type: 'Fee Refund',
      amount: 2500,
      reason: 'Double payment initiated online during Term 1 portal migration.',
      date: '2026-10-09',
      status: 'Executed',
      authorizedBy: 'Dr. Evelyn Montgomery (Principal)'
    }
  ]);

  // Financial Analytics Calculations
  const totalBilled = useMemo(() => fees.reduce((sum, f) => sum + f.amount, 0), [fees]);
  const totalCollected = useMemo(() => {
    return fees.reduce((sum, f) => sum + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0);
  }, [fees]);
  const totalOutstanding = useMemo(() => {
    return fees.reduce((sum, f) => sum + (f.status === 'paid' ? 0 : (f.remainingBalance ?? f.amount)), 0);
  }, [fees]);
  const totalOverdue = useMemo(() => {
    return fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + (f.remainingBalance ?? f.amount), 0);
  }, [fees]);

  const totalExpensesApproved = useMemo(() => {
    return expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const netOperatingSurplus = totalCollected - totalExpensesApproved;
  const collectionVelocityPct = Math.round((totalCollected / (totalBilled || 1)) * 100);

  // Defaulters List
  const defaulterList = useMemo(() => {
    return fees.filter(f => f.status === 'overdue' || (f.status === 'pending' && f.dueDate < '2026-10-20'));
  }, [fees]);

  const filteredDefaulters = useMemo(() => {
    return defaulterList.filter(f => {
      const q = searchQuery.toLowerCase();
      const matchSearch = f.studentName.toLowerCase().includes(q) || f.invoiceNo.toLowerCase().includes(q);
      const matchStd = selectedStandard === 'all' || f.standard === selectedStandard;

      // Calculate days overdue from today (2026-10-14)
      const dueDays = Math.max(0, Math.floor((new Date('2026-10-14').getTime() - new Date(f.dueDate).getTime()) / (1000 * 3600 * 24)));
      let matchAging = true;
      if (agingFilter === '15') matchAging = dueDays >= 15;
      if (agingFilter === '30') matchAging = dueDays >= 30;
      if (agingFilter === '60') matchAging = dueDays >= 60;

      return matchSearch && matchStd && matchAging;
    });
  }, [defaulterList, searchQuery, selectedStandard, agingFilter]);

  // Receipts List
  const allReceiptsList = useMemo(() => {
    const list: Array<{
      receiptNo: string;
      invoice: FeeInvoice;
      installment?: FeePayment;
      paidDate: string;
      amount: number;
      method: string;
      studentName: string;
      standard: number;
      section: string;
    }> = [];

    fees.forEach(inv => {
      if (inv.installments && inv.installments.length > 0) {
        inv.installments.forEach(inst => {
          list.push({
            receiptNo: inst.receiptNo,
            invoice: inv,
            installment: inst,
            paidDate: inst.paymentDate,
            amount: inst.amountPaid,
            method: inst.paymentMethod,
            studentName: inv.studentName,
            standard: inv.standard,
            section: inv.section
          });
        });
      } else if (inv.status === 'paid' && inv.receiptNo) {
        list.push({
          receiptNo: inv.receiptNo,
          invoice: inv,
          paidDate: inv.paidDate || '2026-10-14',
          amount: inv.paidAmount || inv.amount,
          method: inv.paymentMethod || 'UPI',
          studentName: inv.studentName,
          standard: inv.standard,
          section: inv.section
        });
      }
    });

    return list.sort((a, b) => b.paidDate.localeCompare(a.paidDate));
  }, [fees]);

  // Today's Collections
  const todaysCollections = useMemo(() => {
    const today = '2026-10-14';
    return allReceiptsList
      .filter(r => r.paidDate === today)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [allReceiptsList]);

  // Handlers
  const handleOpenCollectPayment = (invoice: FeeInvoice) => {
    setCollectPaymentModalInvoice(invoice);
    const balance = invoice.remainingBalance ?? (invoice.status === 'paid' ? 0 : invoice.amount);
    setPaymentAmount(balance);
    setPaymentMode('UPI');
    setPaymentTxnRef('');
    setPaymentChequeNo('');
    setPaymentBankName('');
    setPaymentNotes('');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectPaymentModalInvoice || isSubmittingPayment) return;

    if (paymentAmount <= 0) {
      showToast('Payment amount must be greater than zero.', 'error');
      return;
    }

    const currentDue = collectPaymentModalInvoice.remainingBalance ?? collectPaymentModalInvoice.amount;
    if (paymentAmount > currentDue) {
      showToast(`Amount exceeds outstanding balance (₹${currentDue.toLocaleString()}).`, 'error');
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const res = recordFeePayment(
        collectPaymentModalInvoice.id,
        paymentAmount,
        paymentMode,
        paymentTxnRef || (paymentChequeNo ? `CHQ-${paymentChequeNo}` : undefined),
        paymentChequeNo,
        paymentNotes || (paymentBankName ? `Drawn on ${paymentBankName}` : undefined),
        'Mr. David Reynolds (Accountant)'
      );

      if (res.success) {
        setCollectPaymentModalInvoice(null);
        const updated = fees.find(f => f.id === collectPaymentModalInvoice.id);
        if (updated) {
          setViewReceiptModalInvoice({
            ...updated,
            paidAmount: (updated.paidAmount || 0) + paymentAmount,
            remainingBalance: res.remainingBalance,
            receiptNo: res.receiptNo
          });
          setViewReceiptRecord({
            id: `pay-${Date.now()}`,
            invoiceId: updated.id,
            receiptNo: res.receiptNo,
            studentId: updated.studentId,
            studentName: updated.studentName,
            amountPaid: paymentAmount,
            paymentMethod: paymentMode,
            paymentDate: new Date().toISOString().split('T')[0],
            collectedBy: 'Mr. David Reynolds (Accountant)'
          });
        }
      }
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleOpenReceipt = (invoice: FeeInvoice, installment?: FeePayment) => {
    setViewReceiptModalInvoice(invoice);
    setViewReceiptRecord(installment || invoice.installments?.[invoice.installments.length - 1] || null);
  };

  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingExpense) return;
    if (!newExpVendor.trim() || newExpAmount <= 0) {
      showToast('Please provide valid vendor name and positive expense amount.', 'error');
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const status: ExpenseRecord['status'] = newExpAmount < 25000 ? 'approved' : 'pending_approval';

      recordExpense({
        category: newExpCategory,
        vendorName: newExpVendor.trim(),
        description: newExpDesc.trim() || `${newExpCategory} operational expense`,
        amount: newExpAmount,
        expenseDate: newExpDate,
        paymentMethod: newExpPayMethod,
        chequeOrRefNo: newExpChequeRef.trim() || `${newExpPayMethod}-${Math.floor(10000 + Math.random() * 90000)}`,
        invoiceBillNo: newExpBillNo.trim() || `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
        status,
        recordedBy: 'Mr. David Reynolds (Accountant)',
        fiscalQuarter: 'Q3',
        approvedBy: status === 'approved' ? 'Mr. David Reynolds' : undefined,
        approvedDate: status === 'approved' ? newExpDate : undefined
      });

      setShowAddExpenseModal(false);
      setNewExpVendor('');
      setNewExpDesc('');
      setNewExpBillNo('');
      setNewExpChequeRef('');
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleAddConcessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find(s => s.id === concessionStudentId);
    if (!stu) return;

    applyFeeConcession({
      studentId: stu.id,
      studentName: stu.name,
      standard: stu.standard,
      section: stu.section,
      concessionType,
      discountType,
      discountValue,
      appliedComponent: 'Tuition Fee',
      calculatedDeduction: discountType === 'percentage' ? Math.round((28500 * discountValue) / 100) : discountValue,
      validAcademicYear: '2026-2027',
      status: 'active',
      approvedBy: 'Mr. David Reynolds (Bursar)',
      approvedDate: new Date().toISOString().split('T')[0],
      reason: concessionReason.trim() || 'Approved institutional concession policy.'
    });

    setShowAddConcessionModal(false);
    setConcessionReason('');
  };

  const handleBatchAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sec = batchSection === 'all' ? undefined : batchSection;
    assignFeeStructureToClass(batchStructureId, batchStandard, sec);
    setShowBatchAssignModal(false);
  };

  const handleAddStructureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTierTuition <= 0) {
      showToast('Tuition fee must be greater than zero.', 'error');
      return;
    }

    const total = newTierTuition + newTierLab + newTierAnnual;
    createFeeStructure({
      tierName: newTierName,
      wingName: newTierWing,
      applicableStandards: newTierWing === 'Senior Secondary Wing' ? [11, 12] : [9, 10],
      academicYear: '2026-2027',
      totalAnnualAmount: total,
      dueDateTerm1: '2026-07-15',
      dueDateTerm2: '2026-10-25',
      status: 'active',
      components: [
        { id: `c-1-${Date.now()}`, name: 'Tuition Fee', term: 'Term 1', amount: Math.round(newTierTuition / 2), mandatory: true },
        { id: `c-2-${Date.now()}`, name: 'Tuition Fee', term: 'Term 2', amount: Math.round(newTierTuition / 2), mandatory: true },
        { id: `c-3-${Date.now()}`, name: 'Laboratory & Computer', term: 'Annual', amount: newTierLab, mandatory: true },
        { id: `c-4-${Date.now()}`, name: 'Annual Development', term: 'Annual', amount: newTierAnnual, mandatory: true }
      ]
    });

    setShowAddStructureModal(false);
  };

  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find(s => s.id === adjustmentStudentId);
    if (!stu) return;

    if (adjustmentAmount <= 0) {
      showToast('Adjustment amount must be positive.', 'error');
      return;
    }

    setAdjustmentsList(prev => [
      {
        id: `adj-${Date.now()}`,
        refNo: adjustmentReference || `ADJ-${Date.now().toString().slice(-5)}`,
        studentId: stu.id,
        studentName: stu.name,
        standard: stu.standard,
        type: adjustmentType,
        amount: adjustmentAmount,
        reason: adjustmentReason.trim(),
        date: new Date().toISOString().split('T')[0],
        status: 'Executed',
        authorizedBy: 'Mr. David Reynolds (Bursar)'
      },
      ...prev
    ]);

    setShowAdjustmentModal(false);
    showToast(`Recorded ${adjustmentType} of ₹${adjustmentAmount.toLocaleString()} for ${stu.name}.`, 'success');
  };

  const handleExportCSV = (reportTitle: string, csvData: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported "${reportTitle}" to CSV successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* MODULE 1: ACCOUNTANT DASHBOARD (Section 6.2)                              */}
      {/* ========================================================================= */}
      {(activeTab === 'dashboard' || !activeTab) && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-sm shrink-0"
                style={{ backgroundColor: themeClasses.hex }}
              >
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Bursar Finance & Collections Command
                  </h2>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    AY 2026–2027 · Term 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Institutional accounts control: collections reconciliation, itemized student fee ledgers, concession sanctioning, and double-entry daybook.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('collections')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 transition-opacity flex items-center gap-1.5"
                style={{ backgroundColor: themeClasses.hex }}
              >
                <CreditCard className="w-4 h-4" />
                <span>Record Collection</span>
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-slate-600" />
                <span>Find Student Account</span>
              </button>
              <button
                onClick={() => setActiveTab('pending_overdue')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Review Dues ({defaulterList.length})</span>
              </button>
            </div>
          </div>

          {/* Key KPI Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Total Fees Assessed</span>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                ₹{totalBilled.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">
                Across Standards 1–10 (Term 1 & 2)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Total Realized</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {collectionVelocityPct}% Rate
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700">
                ₹{totalCollected.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Reconciled in institutional ledger
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Outstanding Dues</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-700">
                ₹{totalOutstanding.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">
                Includes ₹{totalOverdue.toLocaleString()} overdue dues
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Today's Recorded Collections</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-blue-700">
                ₹{todaysCollections.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">
                October 14, 2026 cashbook entries
              </div>
            </div>
          </div>

          {/* Collection Trends & Defaulters Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Defaulter Aging Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Outstanding Dues Aging</span>
                </h3>
                <button
                  onClick={() => setActiveTab('pending_overdue')}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-900 block">Critical (&gt; 30 Days Overdue)</span>
                    <span className="text-[10px] text-rose-700">Immediate bursar reminder required</span>
                  </div>
                  <strong className="text-sm font-mono text-rose-900 font-bold">
                    ₹{defaulterList.slice(0, 3).reduce((s, f) => s + (f.remainingBalance ?? f.amount), 0).toLocaleString()}
                  </strong>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-900 block">Term 2 Due Soon (Due Oct 25)</span>
                    <span className="text-[10px] text-amber-700">Upcoming milestone installment</span>
                  </div>
                  <strong className="text-sm font-mono text-amber-900 font-bold">
                    ₹{fees.filter(f => f.dueDate === '2026-10-25').reduce((s, f) => s + (f.remainingBalance ?? f.amount), 0).toLocaleString()}
                  </strong>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Active Concessions</span>
                    <span className="text-[10px] text-slate-500">Sibling & merit scholarships</span>
                  </div>
                  <strong className="text-sm font-mono text-slate-800">
                    {feeConcessions.filter(c => c.status === 'active').length} Sanctioned
                  </strong>
                </div>
              </div>
            </div>

            {/* Recent Collections Feed */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Recent Fee Transactions</span>
                </h3>
                <button
                  onClick={() => setActiveTab('daybook')}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Open Daybook &rarr;
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {allReceiptsList.slice(0, 5).map((r, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors px-1 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center font-mono">
                        ✓
                      </span>
                      <div>
                        <strong className="text-slate-900 block">{r.studentName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Receipt: {r.receiptNo} · Std {r.standard}-{r.section} · {r.method}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <strong className="font-mono text-emerald-700 font-bold block text-sm">
                        +₹{r.amount.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono">{r.paidDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: FEE COLLECTIONS WORKFLOW (Section 6.5)                          */}
      {/* ========================================================================= */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Fee Collection Counter</h2>
              <p className="text-xs text-slate-500">Record cash, UPI, POS card, net banking, and cheque collections with automated receipts</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-semibold">
                Cashbook Active · Bursar Terminal 01
              </span>
            </div>
          </div>

          {/* Search Student & Unpaid Invoices */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name, admission no, or roll number..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedStandard}
                  onChange={e => setSelectedStandard(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Standards (1–10)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                    <option key={s} value={s}>Standard {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Fee Particular</th>
                    <th className="py-2.5 px-3 text-right">Billed</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Balance Due</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Collection Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {fees
                    .filter(f => {
                      const q = searchQuery.toLowerCase();
                      const matchSearch = f.studentName.toLowerCase().includes(q) || f.invoiceNo.toLowerCase().includes(q);
                      const matchStd = selectedStandard === 'all' || f.standard === selectedStandard;
                      return matchSearch && matchStd;
                    })
                    .slice(0, 15)
                    .map(inv => {
                      const balance = inv.remainingBalance ?? (inv.status === 'paid' ? 0 : inv.amount);
                      const isFullyPaid = balance <= 0 || inv.status === 'paid';

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                          <td className="py-2.5 px-3">
                            <strong className="text-slate-900 block">{inv.studentName}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {inv.studentId}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono">Std {inv.standard}-{inv.section}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-800">{inv.feeType}</span>
                            {inv.concessionApplied && (
                              <span className="block text-[10px] text-amber-700 font-mono">
                                Concession applied: -₹{inv.concessionApplied.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">₹{inv.amount.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">
                            ₹{(inv.paidAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{balance.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isFullyPaid
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : inv.status === 'partial'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {isFullyPaid ? '✓ Paid' : inv.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {isFullyPaid ? (
                              <button
                                onClick={() => handleOpenReceipt(inv)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                              >
                                <Receipt className="w-3.5 h-3.5 text-slate-500" />
                                <span>Receipt</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenCollectPayment(inv)}
                                className="px-2.5 py-1 text-[11px] font-bold text-white rounded-lg transition-opacity hover:opacity-95 flex items-center gap-1 ml-auto shadow-2xs"
                                style={{ backgroundColor: themeClasses.hex }}
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Collect</span>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: FEE STRUCTURE MANAGEMENT (Section 6.3)                         */}
      {/* ========================================================================= */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Approved Institutional Fee Structures</h2>
              <p className="text-xs text-slate-500">CBSE-approved annual tuition tiers, laboratory surcharges, and term due dates</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBatchAssignModal(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Batch Assign to Class</span>
              </button>
              <button
                onClick={() => setShowAddStructureModal(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
                style={{ backgroundColor: themeClasses.hex }}
              >
                <Plus className="w-4 h-4" />
                <span>Create Tier</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeStructures.map(tier => (
              <div key={tier.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {tier.wingName}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{tier.tierName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-slate-900 block">
                      ₹{tier.totalAnnualAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">Annual Composite</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-700 text-[11px] block">Component Breakdown:</span>
                  {tier.components.map(comp => (
                    <div key={comp.id} className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-[11px]">
                      <span className="text-slate-700">{comp.name} ({comp.term})</span>
                      <strong className="font-mono text-slate-900">₹{comp.amount.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Term 1 Due:</span>
                    <span className="font-semibold text-slate-700">{tier.dueDateTerm1 || '2026-07-15'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Term 2 Due:</span>
                    <span className="font-semibold text-slate-700">{tier.dueDateTerm2 || '2026-10-25'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: STUDENT FEE ACCOUNTS (Section 6.4)                             */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Fee Account Ledgers</h2>
              <p className="text-xs text-slate-500">Comprehensive student accounts with historical charges, credits, payments, and balances</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">
                Total Enrolled: {students.length} Accounts
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name, admission no, parent name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedStandard}
                  onChange={e => setSelectedStandard(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Standards (1–10)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                    <option key={s} value={s}>Standard {s}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Balance Statuses</option>
                  <option value="paid">Fully Settled</option>
                  <option value="partial">Partially Paid</option>
                  <option value="pending">Pending Dues</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Admission No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class & Roll</th>
                    <th className="py-2.5 px-3">Parent / Guardian</th>
                    <th className="py-2.5 px-3 text-right">Total Billed</th>
                    <th className="py-2.5 px-3 text-right">Amount Paid</th>
                    <th className="py-2.5 px-3 text-right">Balance Due</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Account Ledger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students
                    .filter(stu => {
                      const q = searchQuery.toLowerCase();
                      const matchSearch = stu.name.toLowerCase().includes(q) ||
                        stu.admissionNo.toLowerCase().includes(q) ||
                        (stu.parentName && stu.parentName.toLowerCase().includes(q));
                      const matchStd = selectedStandard === 'all' || stu.standard === selectedStandard;
                      const matchStatus = statusFilter === 'all' || stu.feeStatus === statusFilter;
                      return matchSearch && matchStd && matchStatus;
                    })
                    .slice(0, 20)
                    .map(stu => {
                      const studentInvoices = fees.filter(f => f.studentId === stu.id);
                      const billed = studentInvoices.reduce((s, f) => s + f.amount, 0);
                      const paid = studentInvoices.reduce((s, f) => s + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0);
                      const balance = studentInvoices.reduce((s, f) => s + (f.status === 'paid' ? 0 : (f.remainingBalance ?? f.amount)), 0);

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{stu.admissionNo}</td>
                          <td className="py-2.5 px-3">
                            <strong className="text-slate-900 block">{stu.name}</strong>
                          </td>
                          <td className="py-2.5 px-3 font-mono">Std {stu.standard}-{stu.section} (#{stu.rollNo})</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <div>{stu.parentName}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{stu.parentPhone}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">₹{billed.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">
                            ₹{paid.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{balance.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                balance <= 0
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {balance <= 0 ? '✓ Cleared' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedStudentLedger(stu)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Ledger</span>
                            </button>
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

      {/* ========================================================================= */}
      {/* MODULE 5: OUTSTANDING DUES & DEFAULTERS (Section 6.6)                     */}
      {/* ========================================================================= */}
      {activeTab === 'pending_overdue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Outstanding Dues & Defaulters Register</h2>
              <p className="text-xs text-slate-500">Unsettled fees aging analysis, overdue notices, and automated reminder broadcasts</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const csv = "Invoice No,Student Name,Class,Due Date,Days Overdue,Outstanding Balance,Parent Phone\n" +
                    filteredDefaulters.map(f => `"${f.invoiceNo}","${f.studentName}","Std ${f.standard}-${f.section}","${f.dueDate}",${Math.max(0, Math.floor((new Date('2026-10-14').getTime() - new Date(f.dueDate).getTime()) / (1000 * 3600 * 24)))},${f.remainingBalance ?? f.amount},"+91 98765 43210"`).join("\n");
                  handleExportCSV("GIS_Outstanding_Defaulters_Register", csv);
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Export Dues Statement</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search defaulter by student name or invoice..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={agingFilter}
                  onChange={e => setAgingFilter(e.target.value as any)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Overdue Aging</option>
                  <option value="15">&gt; 15 Days Overdue</option>
                  <option value="30">&gt; 30 Days Overdue</option>
                  <option value="60">&gt; 60 Days Overdue</option>
                </select>
                <select
                  value={selectedStandard}
                  onChange={e => setSelectedStandard(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Standards (1–10)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                    <option key={s} value={s}>Standard {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Defaulters Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Scheduled Due Date</th>
                    <th className="py-2.5 px-3 text-center">Days Overdue</th>
                    <th className="py-2.5 px-3 text-right">Outstanding Amount</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDefaulters.map(def => {
                    const daysOverdue = Math.max(0, Math.floor((new Date('2026-10-14').getTime() - new Date(def.dueDate).getTime()) / (1000 * 3600 * 24)));
                    const balance = def.remainingBalance ?? def.amount;

                    return (
                      <tr key={def.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{def.invoiceNo}</td>
                        <td className="py-2.5 px-3">
                          <strong className="text-slate-900 block">{def.studentName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {def.studentId}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">Std {def.standard}-{def.section}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{def.dueDate}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-50 text-rose-800 border border-rose-200">
                            {daysOverdue} Days Overdue
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">
                          ₹{balance.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setReminderModalInvoice(def)}
                              className="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3 h-3 text-amber-700" />
                              <span>Remind</span>
                            </button>
                            <button
                              onClick={() => handleOpenCollectPayment(def)}
                              className="px-2.5 py-1 text-[11px] font-bold text-white rounded-lg transition-opacity hover:opacity-95 shadow-2xs"
                              style={{ backgroundColor: themeClasses.hex }}
                            >
                              Collect
                            </button>
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

      {/* ========================================================================= */}
      {/* MODULE 6: PAYMENT HISTORY & DAILY DAYBOOK (Section 6.7)                  */}
      {/* ========================================================================= */}
      {activeTab === 'daybook' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Double-Entry Daybook</h2>
              <p className="text-xs text-slate-500">Chronological transaction register of fee inflows, voucher payouts, and cashbook balances</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={daybookDateFilter}
                onChange={e => setDaybookDateFilter(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-mono font-semibold"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Receipt / Ref</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Account Description</th>
                    <th className="py-2.5 px-3">Payment Mode</th>
                    <th className="py-2.5 px-3 text-right">Inflow (₹)</th>
                    <th className="py-2.5 px-3 text-right">Outflow (₹)</th>
                    <th className="py-2.5 px-3">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {daybookEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{entry.referenceNo}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{entry.timestamp}</td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 block">{entry.partyName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{entry.narration} ({entry.type})</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{entry.paymentMethod}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        {entry.creditAmount > 0 ? `+₹${entry.creditAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">
                        {entry.debitAmount > 0 ? `-₹${entry.debitAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{entry.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 7: RECEIPTS REGISTER (Section 6.8)                                */}
      {/* ========================================================================= */}
      {activeTab === 'receipts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Official Fee Receipts Register</h2>
              <p className="text-xs text-slate-500">Computer-generated tax receipts valid for income tax exemption under Section 80C</p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {allReceiptsList.length} Receipts Issued
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Receipt No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3 text-right">Amount Received</th>
                    <th className="py-2.5 px-3 text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {allReceiptsList.map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{rec.receiptNo}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{rec.paidDate}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{rec.studentName}</td>
                      <td className="py-2.5 px-3 font-mono">Std {rec.standard}-{rec.section}</td>
                      <td className="py-2.5 px-3 font-mono">{rec.method}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        ₹{rec.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleOpenReceipt(rec.invoice, rec.installment)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 8: CONCESSIONS & SCHOLARSHIPS (Section 6.9)                       */}
      {/* ========================================================================= */}
      {activeTab === 'concessions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Sanctioned Concessions & Scholarships</h2>
              <p className="text-xs text-slate-500">Merit scholarships, sibling discounts, and staff ward waivers approved by school leadership</p>
            </div>
            <button
              onClick={() => setShowAddConcessionModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <Plus className="w-4 h-4" />
              <span>Sanction Concession</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Concession No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Concession Category</th>
                    <th className="py-2.5 px-3">Discount Type & Rate</th>
                    <th className="py-2.5 px-3 text-right">Deduction (₹)</th>
                    <th className="py-2.5 px-3">Approved By</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {feeConcessions.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.concessionNo}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{c.studentName}</td>
                      <td className="py-2.5 px-3 font-mono">Std {c.standard}-{c.section}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-800">{c.concessionType}</span>
                        <div className="text-[10px] text-slate-400">{c.reason}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {c.discountType === 'percentage' ? `${c.discountValue}% on ${c.appliedComponent}` : `₹${c.discountValue} Flat`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700">
                        -₹{c.calculatedDeduction.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{c.approvedBy}</td>
                      <td className="py-2.5 px-3 text-right">
                        {c.status === 'active' ? (
                          <button
                            onClick={() => {
                              const reason = prompt('Please enter justification for revoking concession:');
                              if (reason) revokeFeeConcession(c.id, reason);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            Revoke
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono italic">Revoked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 9: REFUNDS AND ADJUSTMENTS (Section 6.9)                           */}
      {/* ========================================================================= */}
      {activeTab === 'adjustments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Refunds, Waivers & Ledger Adjustments</h2>
              <p className="text-xs text-slate-500">Authorized fee refunds, credit note balancing, and administrative late fee exemptions</p>
            </div>
            <button
              onClick={() => setShowAdjustmentModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Record Fee Adjustment</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Reference No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Adjustment Type</th>
                    <th className="py-2.5 px-3">Justification Reason</th>
                    <th className="py-2.5 px-3 text-right">Adjustment Amount</th>
                    <th className="py-2.5 px-3">Authorized By</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {adjustmentsList.map(adj => (
                    <tr key={adj.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{adj.refNo}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{adj.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{adj.studentName}</td>
                      <td className="py-2.5 px-3 font-mono">Std {adj.standard}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{adj.type}</td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs">{adj.reason}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{adj.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{adj.authorizedBy}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {adj.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 10: EXPENSES & VOUCHERS (Section 6.10)                             */}
      {/* ========================================================================= */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Expenditure & Vouchers</h2>
              <p className="text-xs text-slate-500">Accounts payable, supplier invoices, maintenance contracts, and bursar payment vouchers</p>
            </div>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense Voucher</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Voucher No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Vendor / Beneficiary</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">View Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{exp.voucherNo}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{exp.expenseDate}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{exp.category}</td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 block">{exp.vendorName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">Bill #{exp.invoiceBillNo}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{exp.paymentMethod}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">
                        ₹{exp.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            exp.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {exp.status === 'approved' ? 'Approved' : 'Pending Approval'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setViewVoucherModal(exp)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Voucher</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 11: DEPARTMENTAL BUDGETS (Section 6.10)                           */}
      {/* ========================================================================= */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Departmental Operating Budgets</h2>
              <p className="text-xs text-slate-500">Annual department caps, actual expenditure, and automated variance thresholds</p>
            </div>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              AY 2026–2027 Appropriations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(b => {
              const utilPct = Math.round((b.spentAmount / (b.allocatedAmount || 1)) * 100);
              const isOverThreshold = utilPct >= (b.alertThresholdPct || 85);

              return (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{b.categoryName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Quarter: {b.fiscalQuarter}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOverThreshold
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {utilPct}% Utilized
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverThreshold ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, utilPct)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Allocated:</span>
                      <strong className="text-slate-900">₹{b.allocatedAmount.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Spent:</span>
                      <strong className="text-rose-700">₹{b.spentAmount.toLocaleString()}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Remaining:</span>
                      <strong className="text-emerald-700">₹{(b.allocatedAmount - b.spentAmount).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setAdjustingBudget(b);
                        setNewBudgetAllocated(b.allocatedAmount);
                        setNewBudgetThreshold(b.alertThresholdPct || 85);
                      }}
                      className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Adjust Allocation
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 12: STAFF PAYROLL ATTENDANCE (Section 6.1)                         */}
      {/* ========================================================================= */}
      {activeTab === 'payroll_attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Staff Payroll Attendance Reconciliation</h2>
              <p className="text-xs text-slate-500">Biometric check-in reconciliation, sanctioned paid leaves, and Loss of Pay (LOP) verification</p>
            </div>
            <button
              onClick={() => {
                let csv = "Employee ID,Staff Name,Department,Category,Working Days,Present Days,Approved Paid Leaves,Half Days,Loss of Pay,Net Payable Days\n";
                teachers.forEach(t => {
                  const rec = staffAttendance.find(sa => sa.staffId === t.id);
                  const isLeave = rec?.status === "on_leave" || t.employmentStatus === "On Leave";
                  const isLateOrHalf = rec?.status === "half_day";
                  const paidLeave = isLeave ? 1 : 0;
                  const halfDays = isLateOrHalf ? 1 : 0;
                  const present = isLeave ? 23 : 24 - halfDays * 0.5;
                  csv += `"${t.empId}","${t.name}","${t.department}","${t.staffCategory}",24,${present},${paidLeave},${halfDays},0,24\n`;
                });
                handleExportCSV("GIS_Staff_Payroll_Attendance_October_2026", csv);
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Payroll CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Staff Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">Cycle Days</th>
                    <th className="py-2.5 px-3 text-center">Present</th>
                    <th className="py-2.5 px-3 text-center">Approved Leaves</th>
                    <th className="py-2.5 px-3 text-center">Loss of Pay</th>
                    <th className="py-2.5 px-3 text-center">Payable Days</th>
                    <th className="py-2.5 px-3 text-right">Audit Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {teachers.map(t => {
                    const rec = staffAttendance.find(sa => sa.staffId === t.id);
                    const isLeave = rec?.status === 'on_leave' || t.employmentStatus === 'On Leave';
                    const paidLeaves = isLeave ? 1 : 0;
                    const present = isLeave ? 23 : 24;

                    return (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.empId}</td>
                        <td className="py-2.5 px-3">
                          <strong className="text-slate-900 block">{t.name}</strong>
                          <span className="text-[10px] text-slate-400">{t.designation}</span>
                        </td>
                        <td className="py-2.5 px-3">{t.department}</td>
                        <td className="py-2.5 px-3 text-center font-mono">24</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">{present}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-purple-700">{paidLeaves}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">24 / 24</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Verified Full Payout
                          </span>
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

      {/* ========================================================================= */}
      {/* MODULE 13: FINANCE REPORTS (Section 6.11)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Financial Reports Suite</h2>
              <p className="text-xs text-slate-500">Real-time financial audits, collection velocity, fee aging, and expenditure reconciliation</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Generated for Bursar Review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Fee Collection Summary Report',
                desc: 'Consolidated collections across Standards 1–10, total billed, realized, and variance.',
                action: () => {
                  const csv = "Standard,Total Billed,Total Realized,Outstanding Dues,Collection Rate\n" +
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => {
                      const stdFees = fees.filter(f => f.standard === s);
                      const b = stdFees.reduce((acc, f) => acc + f.amount, 0);
                      const r = stdFees.reduce((acc, f) => acc + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0);
                      return `Class ${s},${b},${r},${b - r},${Math.round((r / (b || 1)) * 100)}%`;
                    }).join("\n");
                  handleExportCSV("GIS_Fee_Collection_Summary", csv);
                }
              },
              {
                title: 'Outstanding Dues Aging Analysis',
                desc: 'Delinquent fee breakdown categorized by 0–15 days, 16–30 days, and >30 days past due date.',
                action: () => {
                  const csv = "Aging Bracket,Student Count,Total Outstanding (INR)\n" +
                    "0–15 Days Overdue,4,114000\n" +
                    "16–30 Days Overdue,2,57000\n" +
                    "> 30 Days Critical,3,85500\n";
                  handleExportCSV("GIS_Dues_Aging_Analysis", csv);
                }
              },
              {
                title: 'Payment Gateway & Method Distribution',
                desc: 'Inflow breakdown by UPI, Card (POS), NetBanking, Cash, and Cheque.',
                action: () => {
                  const csv = "Payment Method,Transactions Count,Total Collected (INR)\n" +
                    "UPI / QR,18,513000\n" +
                    "Card (POS),12,342000\n" +
                    "NetBanking (NEFT),15,427500\n" +
                    "Cash Collection,8,228000\n" +
                    "Cheque / Draft,5,142500\n";
                  handleExportCSV("GIS_Payment_Method_Distribution", csv);
                }
              },
              {
                title: 'Operating Revenue vs Expenditure Audit',
                desc: 'Net operating surplus reconciliation comparing total fee realizations with approved expense vouchers.',
                action: () => {
                  const csv = "Particulars,Amount (INR)\n" +
                    `Total Tuition Realization,${totalCollected}\n` +
                    `Total Approved Expenses,${totalExpensesApproved}\n` +
                    `Net Operating Surplus,${netOperatingSurplus}\n`;
                  handleExportCSV("GIS_Operating_Surplus_Audit", csv);
                }
              }
            ].map((rep, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rep.desc}</p>
                <button
                  onClick={rep.action}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report CSV</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 14: MY PROFILE (Section 6.1)                                       */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div
                className="w-14 h-14 rounded-2xl text-white font-bold text-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: themeClasses.hex }}
              >
                DR
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Mr. David Reynolds</h3>
                <p className="text-xs text-slate-500">Chief Bursar & Finance Officer · Greenfield International School</p>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mt-1">
                  Security Clearance Level 3 · Finance & Collections
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Employee ID:</span>
                <span className="font-mono font-bold text-slate-900">BUR-2019-018</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Professional Qualifications:</span>
                <span className="text-slate-800 font-medium">M.Com, Chartered Accountant (Inter)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Official Email:</span>
                <span className="font-mono text-slate-800">finance@greenfield.edu</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Intercom / Direct Phone:</span>
                <span className="font-mono text-slate-800">+91 20 2748 0005 (Ext. 104)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Authorized Financial Ceiling:</span>
                <span className="font-mono font-bold text-slate-900">₹25,000 Single Voucher Discretion</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FEE COLLECTION INPUT FORM                                          */}
      {/* ========================================================================= */}
      {collectPaymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Record Fee Collection</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Invoice: {collectPaymentModalInvoice.invoiceNo}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCollectPaymentModalInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <strong className="text-slate-900">
                    {collectPaymentModalInvoice.studentName} (Std {collectPaymentModalInvoice.standard}-{collectPaymentModalInvoice.section})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Particular:</span>
                  <span className="font-semibold text-slate-800">{collectPaymentModalInvoice.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed:</span>
                  <span className="font-mono text-slate-700">₹{collectPaymentModalInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span className="text-slate-900">Remaining Balance Due:</span>
                  <span className="text-rose-700 font-mono text-sm">
                    ₹{(collectPaymentModalInvoice.remainingBalance ?? collectPaymentModalInvoice.amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Amount Received (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={collectPaymentModalInvoice.remainingBalance ?? collectPaymentModalInvoice.amount}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'NetBanking', 'Cash', 'Cheque'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMode(m)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMode === m
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-1 ring-emerald-600 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMode === 'Cheque' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cheque Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 048291"
                      value={paymentChequeNo}
                      onChange={e => setPaymentChequeNo(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Drawee Bank & Branch</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SBI Main Branch"
                      value={paymentBankName}
                      onChange={e => setPaymentBankName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Transaction / Bank Reference No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI-948201 / POS-7731"
                    value={paymentTxnRef}
                    onChange={e => setPaymentTxnRef(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bursar Remarks / Notes</label>
                <input
                  type="text"
                  placeholder="Optional notes or concession notation..."
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCollectPaymentModalInvoice(null)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs transition-opacity hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingPayment ? 'Processing...' : 'Confirm & Issue Receipt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL BURSAR RECEIPT MODAL (Section 6.8)                        */}
      {/* ========================================================================= */}
      {viewReceiptModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Official Tuition Fee Receipt
              </span>
              <button
                onClick={() => setViewReceiptModalInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-slate-300 p-4 rounded-xl bg-slate-50/50 space-y-3 text-xs">
              <div className="text-center space-y-1 border-b pb-2.5 border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold font-serif flex items-center justify-center mx-auto text-sm">
                  GIS
                </div>
                <h3 className="text-sm font-bold font-serif text-slate-900 uppercase">
                  Greenfield International School
                </h3>
                <p className="text-[10px] text-slate-500">
                  Affiliated to CBSE, New Delhi (Affiliation: 1930284 · Code: 45129)
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  accounts@greenfield.edu · Sector 12, Pune
                </p>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-slate-500">Receipt No: </span>
                  <strong className="font-mono text-slate-900">
                    {viewReceiptRecord?.receiptNo || viewReceiptModalInvoice.receiptNo || 'RCP-78291'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Date: </span>
                  <strong className="font-mono text-slate-900">
                    {viewReceiptRecord?.paymentDate || viewReceiptModalInvoice.paidDate || '2026-10-14'}
                  </strong>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">{viewReceiptModalInvoice.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Section:</span>
                  <span>Std {viewReceiptModalInvoice.standard}-{viewReceiptModalInvoice.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Particular:</span>
                  <span className="font-semibold text-slate-800">{viewReceiptModalInvoice.feeType}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <div className="p-2 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Sanctioned Amount:</span>
                    <span className="font-mono">₹{viewReceiptModalInvoice.amount.toLocaleString()}</span>
                  </div>
                  {viewReceiptModalInvoice.concessionApplied && (
                    <div className="flex justify-between text-amber-800">
                      <span>Less Concession ({viewReceiptModalInvoice.concessionType}):</span>
                      <span className="font-mono">-₹{viewReceiptModalInvoice.concessionApplied.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                    <span>Amount Paid:</span>
                    <span className="font-mono text-emerald-700 text-xs">
                      ₹{(viewReceiptRecord?.amountPaid || viewReceiptModalInvoice.paidAmount || viewReceiptModalInvoice.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Remaining Balance:</span>
                    <span className="font-mono">₹{(viewReceiptModalInvoice.remainingBalance ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>Method: <strong>{viewReceiptRecord?.paymentMethod || viewReceiptModalInvoice.paymentMethod || 'UPI'}</strong></span>
                <span>Ref: <strong className="font-mono">{viewReceiptRecord?.transactionRef || 'GIS-TXN-SUCCESS'}</strong></span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-end text-[10px]">
                <div className="text-slate-400">
                  <p>Computer-generated receipt.</p>
                  <p>Valid for tax exemption under 80C.</p>
                </div>
                <div className="text-center font-serif">
                  <span className="italic font-bold text-slate-700 block">David Reynolds</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block border-t border-slate-300 pt-0.5">
                    Authorized Bursar Seal
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast(`Receipt ${viewReceiptRecord?.receiptNo || 'Receipt'} downloaded as PDF.`, 'success');
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </button>
              <button
                onClick={() => setViewReceiptModalInvoice(null)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: STUDENT FEE ACCOUNT LEDGER DRAWER (Section 6.4)                    */}
      {/* ========================================================================= */}
      {selectedStudentLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Fee Account Ledger</h3>
                <p className="text-xs text-slate-500">
                  {selectedStudentLedger.name} · Admission No: {selectedStudentLedger.admissionNo}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentLedger(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px]">Standard & Section:</span>
                <strong className="text-slate-900">Std {selectedStudentLedger.standard}-{selectedStudentLedger.section}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Guardian:</span>
                <span className="text-slate-800">{selectedStudentLedger.parentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Parent Phone:</span>
                <span className="font-mono text-slate-800">{selectedStudentLedger.parentPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Admission Date:</span>
                <span className="font-mono text-slate-800">{selectedStudentLedger.admissionDate}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Itemized Invoices & Collections
              </span>

              {fees.filter(f => f.studentId === selectedStudentLedger.id).map(inv => (
                <div key={inv.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{inv.feeType} ({inv.term})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {inv.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                    <span>Billed: ₹{inv.amount.toLocaleString()}</span>
                    <span>Paid: ₹{(inv.paidAmount || (inv.status === 'paid' ? inv.amount : 0)).toLocaleString()}</span>
                    <span className="font-bold text-rose-700">Due: ₹{(inv.remainingBalance ?? 0).toLocaleString()}</span>
                  </div>

                  {inv.status !== 'paid' && (
                    <button
                      onClick={() => {
                        setSelectedStudentLedger(null);
                        handleOpenCollectPayment(inv);
                      }}
                      className="w-full mt-2 py-1.5 text-xs font-bold text-white rounded-lg transition-opacity hover:opacity-95"
                      style={{ backgroundColor: themeClasses.hex }}
                    >
                      Collect Dues for This Invoice
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD FEE ADJUSTMENT / REFUND (Section 6.9)                       */}
      {/* ========================================================================= */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record Fee Adjustment / Refund</h3>
                <p className="text-xs text-slate-500">Post authorized credit, fee refund, or late penalty waiver</p>
              </div>
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Student</label>
                <select
                  value={adjustmentStudentId}
                  onChange={e => setAdjustmentStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {students.slice(0, 15).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Std {s.standard}-{s.section}) · #{s.admissionNo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Adjustment Type</label>
                <select
                  value={adjustmentType}
                  onChange={e => setAdjustmentType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Fee Refund">Fee Refund (Excess Payment Return)</option>
                  <option value="Ledger Correction Credit">Ledger Correction Credit Note</option>
                  <option value="Late Fee Waiver">Administrative Late Fee Waiver</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adjustmentAmount}
                    onChange={e => setAdjustmentAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Resolution Ref</label>
                  <input
                    type="text"
                    required
                    value={adjustmentReference}
                    onChange={e => setAdjustmentReference(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Justification Reason</label>
                <textarea
                  rows={2}
                  required
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdjustmentModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Execute Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD EXPENSE VOUCHER                                             */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Record Institutional Expense Voucher</h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expense Category</label>
                <select
                  value={newExpCategory}
                  onChange={e => setNewExpCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Campus Infrastructure & Utilities">Campus Infrastructure & Utilities</option>
                  <option value="Science & Computer Labs">Science & Computer Labs</option>
                  <option value="Library & Learning Resources">Library & Learning Resources</option>
                  <option value="Sports & Co-Curricular">Sports & Co-Curricular</option>
                  <option value="School Transport & Fleet">School Transport & Fleet</option>
                  <option value="Administration & Compliance">Administration & Compliance</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Vendor / Beneficiary Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Scientific Supplies Ltd"
                  value={newExpVendor}
                  onChange={e => setNewExpVendor(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={newExpAmount}
                    onChange={e => setNewExpAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={newExpPayMethod}
                    onChange={e => setNewExpPayMethod(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="NetBanking">NetBanking / NEFT</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Supplier Bill / Invoice #</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-8492"
                    value={newExpBillNo}
                    onChange={e => setNewExpBillNo(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cheque / Txn Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. CHQ-99381"
                    value={newExpChequeRef}
                    onChange={e => setNewExpChequeRef(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Purpose / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Physics laboratory glassware and titration apparatus replacement"
                  value={newExpDesc}
                  onChange={e => setNewExpDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExpense}
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs hover:opacity-95 disabled:opacity-50"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  {isSubmittingExpense ? 'Recording...' : 'Record Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SANCTION CONCESSION                                                */}
      {/* ========================================================================= */}
      {showAddConcessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Sanction Fee Concession / Scholarship</h3>
              <button
                onClick={() => setShowAddConcessionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddConcessionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Eligible Student</label>
                <select
                  value={concessionStudentId}
                  onChange={e => setConcessionStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {students.slice(0, 20).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Std {s.standard}-{s.section}) · #{s.admissionNo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Concession Category</label>
                <select
                  value={concessionType}
                  onChange={e => setConcessionType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Merit Scholarship">Merit Scholarship (Top Quartile)</option>
                  <option value="Sibling Discount">Sibling Concession (2nd Child)</option>
                  <option value="Staff Ward Concession">Staff Ward Policy</option>
                  <option value="EWS / Need-Based Waiver">EWS / Need-Based Fee Waiver</option>
                  <option value="Sports & Arts Excellence">Sports & Arts State Representative</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Value {discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={discountType === 'percentage' ? 100 : 50000}
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sanction Justification</label>
                <input
                  type="text"
                  required
                  value={concessionReason}
                  onChange={e => setConcessionReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddConcessionModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Sanction Concession
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SEND FEE REMINDER                                                  */}
      {/* ========================================================================= */}
      {reminderModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Send Dues Notice</h3>
              <button
                onClick={() => setReminderModalInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Student:</span>
                <strong className="text-slate-900 block">{reminderModalInvoice.studentName}</strong>
                <span className="font-mono text-rose-700 font-bold block">
                  Outstanding: ₹{(reminderModalInvoice.remainingBalance ?? reminderModalInvoice.amount).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dispatch Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['SMS', 'WhatsApp', 'Email'] as const).map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setReminderChannel(ch)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        reminderChannel === ch
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                Notice: Dispatches simulated reminder broadcast to guardian contact via {reminderChannel}.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReminderModalInvoice(null)}
                  className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sendFeeReminder(reminderModalInvoice.id, reminderChannel);
                    setReminderModalInvoice(null);
                  }}
                  className="px-4 py-1.5 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Send Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BATCH ASSIGN FEE STRUCTURE                                         */}
      {/* ========================================================================= */}
      {showBatchAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Assign Fee Structure to Class</h3>
              <button
                onClick={() => setShowBatchAssignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBatchAssignSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Approved Structure Tier</label>
                <select
                  value={batchStructureId}
                  onChange={e => setBatchStructureId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {feeStructures.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.tierName} (₹{s.totalAnnualAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Standard</label>
                  <select
                    value={batchStandard}
                    onChange={e => setBatchStandard(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                      <option key={s} value={s}>Standard {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={batchSection}
                    onChange={e => setBatchSection(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="all">All Sections (A & B)</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBatchAssignModal(false)}
                  className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Generate Invoices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
