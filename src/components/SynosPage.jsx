import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, UserPlus, Coins, Droplet, FlaskConical, 
  Radio, FileSignature, TrendingUp, Eye, Check, 
  Activity, ZoomIn, X, Play, Pause, RefreshCw, AlertCircle,
  Database, GitMerge, FileText, ArrowRight, ShieldAlert, Cpu, Settings,
  MessageSquare, Mail, Printer, Layers, Box, CheckCircle2, ChevronRight,
  TrendingDown, Network, Sparkles, Send, Clock, Zap
} from 'lucide-react';

// Real-life screenshots
import patientRegistrationImg from '../assets/SynOS/patient-registration.png';
import testSelectorImg from '../assets/SynOS/test-selector.png';
import phleboQueueImg from '../assets/SynOS/phlebo-queue.png';
import departmentWorkbenchImg from '../assets/SynOS/department-workbench.png';
import radiologistImg from '../assets/SynOS/radiologist.png';
import pathologistImg from '../assets/SynOS/pathologist.png';
import financeImg from '../assets/SynOS/finance.png';
import directorDashboardImg from '../assets/SynOS/director-dashboard.png';

// Phase 2 supporting screenshots
import inventoryImg from '../assets/SynOS/inventory.png';
import payrollImg from '../assets/SynOS/finance-payroll.png';
import expenseLedgerImg from '../assets/SynOS/finance-expense-ledger.png';
import mriTechnicianImg from '../assets/SynOS/mri-technician-sample-collection-screen.png';
import typistScreenImg from '../assets/SynOS/typist-screen.png';
import patientRegistration2Img from '../assets/SynOS/patient-registration-2.png';
import payroll2Img from '../assets/SynOS/finance-payroll-2.png';

// Department details mapping for interactive tree nodes
const nodeDefinitions = {
  reception: {
    title: 'Reception & Registration',
    subtitle: 'Patient check-in, demographics, and visit initiation.',
    category: 'Operations',
    colorClass: 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
    icon: UserPlus,
    screenshot: patientRegistrationImg,
    pipeline: [
      { step: 'Patient Registered', desc: 'Patient check-in details captured and Patient MRN-4829 generated.' },
      { step: 'Billing Updated', desc: 'Test selector ledger bills selected biochemistry panels & Brain MRI.' },
      { step: 'Phlebotomy Queue Created', desc: 'VisitStarted SignalR event broadcasts, immediately unlocking phlebotomy draw list.' },
      { step: 'Director Dashboard Updated', desc: 'Logs check-in timestamp and registers initial Turnaround Time (TAT) baseline.' }
    ]
  },
  billing: {
    title: 'Billing & Payments',
    subtitle: 'Test selection, billing, payments and receipts.',
    category: 'Operations',
    colorClass: 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
    icon: Coins,
    screenshot: testSelectorImg,
    pipeline: [
      { step: 'Tests Selected', desc: 'Selected biochemistry panels & Brain MRI added to visit ledger.' },
      { step: 'Invoice Generated', desc: 'Ledger posts billing details and payment receipts to finance journal.' },
      { step: 'Phlebotomy Queue Activated', desc: 'Unlocks blood draws queue upon payment verification.' }
    ]
  },
  phlebotomy: {
    title: 'Phlebotomy Screen',
    subtitle: 'Sample collection, barcode generation, and tracking.',
    category: 'Pathology',
    colorClass: 'text-pink-400 border-pink-500/20 bg-pink-500/5 hover:border-pink-500/40',
    icon: Droplet,
    screenshot: phleboQueueImg,
    pipeline: [
      { step: 'Sample Drawn', desc: 'Phlebotomist validates fasting state and draws chemistry specimens.' },
      { step: 'Barcode Generated', desc: 'Barcode labels printed at the draw station to prevent sample mix-ups.' },
      { step: 'Workbench Queue Updated', desc: 'SampleCollected event routes barcode registration straight to biochem lab workbench.' },
      { step: 'IMS Counts Decremented', desc: 'Inventory counts blood vacuum tubes and barcode labels consumed (-1).' }
    ]
  },
  workbench: {
    title: 'Lab Workbench',
    subtitle: 'Test processing, result entry and validation.',
    category: 'Pathology',
    colorClass: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/40',
    icon: FlaskConical,
    screenshot: departmentWorkbenchImg,
    pipeline: [
      { step: 'Analyzer Upload', desc: 'Specimen processed by biochemistry analyser; parameters loaded.' },
      { step: 'Results Logged', desc: 'ResultsEntered event broadcasts biochemical variables (Lipids, LFT, CBC).' },
      { step: 'Abnormalities Flagged', desc: 'Critical ranges highlighted automatically to assist doctor evaluations.' }
    ]
  },
  pathologist: {
    title: 'Pathologist Approval',
    subtitle: 'Review findings, comments and digital signature.',
    category: 'Pathology',
    colorClass: 'text-violet-400 border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40',
    icon: FileSignature,
    screenshot: pathologistImg,
    pipeline: [
      { step: 'Report Approved', desc: 'Pathologist validates clinical findings and releases validation logs.' },
      { step: 'Digital PDF Generated', desc: 'Digital validation signs off the official laboratory report.' },
      { step: 'Auto-Dispatch Triggered', desc: 'Instantly fires WhatsApp & Email dispatch vectors.' },
      { step: 'Reagent Inventory Reduced', desc: 'IMS decrements exact reagent counts based on test recipes.' }
    ]
  },
  typing: {
    title: 'Reports Typing',
    subtitle: 'Report formatting, templates and finalization.',
    category: 'Operations',
    colorClass: 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
    icon: FileText,
    screenshot: typistScreenImg,
    pipeline: [
      { step: 'Scan & Lab Outputs Received', desc: 'Raw analyzer results and PACS scan files populate data-entry board.' },
      { step: 'Report Drafted', desc: 'Typist formats findings and auto-transcribes physician audio logs.' },
      { step: 'Awaiting Validation', desc: 'Draft generated event pushed to Pathologist validation worklist.' }
    ]
  },
  radiologyConsole: {
    title: 'Radiology Console',
    subtitle: 'Modality worklist, DICOM upload, and PACS sync.',
    category: 'Radiology',
    colorClass: 'text-rose-400 border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40',
    icon: Cpu,
    screenshot: mriTechnicianImg,
    pipeline: [
      { step: 'Radiography Acquired', desc: 'Technician takes scans and uploads digital files.' },
      { step: 'DICOM Generated', desc: 'Scans formatted as high-res DICOM files associating patient MRN.' },
      { step: 'PACS Server Pushed', desc: 'ScanCompleted event routes scans directly to PACS servers.' }
    ]
  },
  radiologist: {
    title: 'Radiologist Workspace',
    subtitle: 'Image viewer, voice dictation, and reporting.',
    category: 'Radiology',
    colorClass: 'text-rose-400 border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40',
    icon: Radio,
    screenshot: radiologistImg,
    pipeline: [
      { step: 'PACS Study Loaded', desc: 'Radiologist accesses high-resolution DICOM slices.' },
      { step: 'Voice Dictation Dictated', desc: 'Transcribes diagnosis findings automatically onto template.' },
      { step: 'Draft Released', desc: 'RadiologyReportDrafted event updates pathologist sign-off dashboard.' }
    ]
  },
  delivery: {
    title: 'Delivery Desk',
    subtitle: 'Report dispatch, via Email, WhatsApp or physical collection.',
    category: 'Operations',
    colorClass: 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
    icon: Mail,
    screenshot: patientRegistration2Img,
    pipeline: [
      { step: 'Report Released', desc: 'Pathologist validation signature unlocks the delivery desk files.' },
      { step: 'WhatsApp Dispatch Queue', desc: 'Sends encrypted PDF download link directly to patient WhatsApp.' },
      { step: 'Email Dispatch Queue', desc: 'Delivers detailed clinical PDF copy to patient & referred doctor inbox.' },
      { step: 'Physical Release Logged', desc: 'Logs print timestamp at the physical front desk for counter collections.' }
    ]
  },
  ims: {
    title: 'Smart IMS',
    subtitle: 'Inventory tracking, auto deduction, and low stock alerts.',
    category: 'Smart IMS',
    colorClass: 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40',
    icon: Box,
    screenshot: inventoryImg,
    pipeline: [
      { step: 'Sample Processed', desc: 'Lab Workbench processes analyzer results.' },
      { step: 'Reagent Consumed', desc: 'Smart formula mapping subtracts reagents used.' },
      { step: 'Inventory Reduced', desc: 'Reagent shelf stock counts decrement in real-time.' },
      { step: 'Purchase Alert Generated', desc: 'Minimum stock thresholds trigger auto re-order sheets.' },
      { step: 'Finance Updated', desc: 'Accrued reagent liabilities post to general expense sheets.' }
    ]
  },
  finance: {
    title: 'Finance Dashboard',
    subtitle: 'Revenue, expenses, commissions and cash flow.',
    category: 'Finance & HR',
    colorClass: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40',
    icon: TrendingUp,
    screenshot: financeImg,
    pipeline: [
      { step: 'Revenues Reconciled', desc: 'Billing checkout transactions compiled for daily cash-drawer audits.' },
      { step: 'Referrals Audited', desc: 'Revenues matched against referring physicians for commission logs.' },
      { step: 'P&L Sync', desc: 'Accrued revenues and outstanding balances synced to general ledger.' }
    ]
  },
  expense: {
    title: 'Expenses Command Center',
    subtitle: 'Vendor payouts, overheads and cash outflows.',
    category: 'Finance & HR',
    colorClass: 'text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/40',
    icon: Layers,
    screenshot: expenseLedgerImg,
    pipeline: [
      { step: 'Invoice Received', desc: 'Billing details cashier receipts.' },
      { step: 'Commissions Credited', desc: 'B2B referral doctor commissions post dynamically.' },
      { step: 'P&L Balances Balanced', desc: 'General ledger books update cash-on-hand reports.' }
    ]
  },
  payroll: {
    title: 'Workforce & Payroll',
    subtitle: 'Attendance, payroll processing and salary disbursal.',
    category: 'Finance & HR',
    colorClass: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40',
    icon: Network,
    screenshot: payrollImg,
    pipeline: [
      { step: 'Attendance Recorded', desc: 'Biometric terminals log technician attendance.' },
      { step: 'Payroll Calculated', desc: 'Salaries dynamically compile checking late exceptions.' },
      { step: 'Overtime Reconciled', desc: 'Credits overtime checking clinical validation timestamps.' }
    ]
  },
  payrollIntel: {
    title: 'HR Payroll Intelligence',
    subtitle: 'Payslips, compliance reports and historical archive.',
    category: 'Finance & HR',
    colorClass: 'text-violet-400 border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40',
    icon: Clock,
    screenshot: payroll2Img,
    pipeline: [
      { step: 'Exceptions Flagged', desc: 'Attendance anomalies (lateness, leaves) reconciled.' },
      { step: 'Salary Released', desc: 'Bank disbursement files generated and emailed with payslips.' }
    ]
  },
  director: {
    title: 'Director Command Center',
    subtitle: 'Real-time KPIs, bottlenecks and business intelligence.',
    category: 'Director',
    colorClass: 'text-violet-400 border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40',
    icon: Activity,
    screenshot: directorDashboardImg,
    pipeline: [
      { step: 'TAT Bottlenecks Isolated', desc: 'Isolates high turnaround delay stations (e.g. typing or labs).' },
      { step: 'Real-Time P&L Audit', desc: 'Compares live revenues against accrued commissions and expenses.' },
      { step: 'Modality Statistics Logged', desc: 'Analyzes equipment utilization logs (CT, MRI) in unified control tower.' }
    ]
  }
};

// Simulation Steps for the "Run A Patient" City Simulation
const simSteps = [
  { step: 0, node: 'reception', label: 'Reception', action: 'Patient check-in & billing verified.', log: '[Event: VisitStarted] MRN-4829 checked in. Brain MRI & Biochemistry tests billed.', stats: { rev: '+180.00', tat: '1 min', stock: 'Stable' } },
  { step: 1, node: 'phlebotomy', label: 'Phlebotomy', action: 'Blood samples drawn & barcoded.', log: '[Event: SampleCollected] Chemistry tubes barcoded and routed to lab workbench.', stats: { rev: '+180.00', tat: '8 min', stock: 'Tubes: -2' } },
  { step: 2, node: 'radiologyConsole', label: 'Radiology Console', action: 'Technician acquires MRI scan DICOMs.', log: '[Event: ScanCompleted] MRI Head DICOM study uploaded to PACS repository.', stats: { rev: '+180.00', tat: '28 min', stock: 'Tubes: -2' } },
  { step: 3, node: 'workbench', label: 'Lab Workbench', action: 'Specimen processed by biochem analyser.', log: '[Event: ResultsEntered] Analyzer parameters logged for biochemical panels.', stats: { rev: '+180.00', tat: '36 min', stock: 'Reagents: -5ml' } },
  { step: 4, node: 'radiologist', label: 'Radiologist', action: 'PACS findings dictated via voice.', log: '[Event: RadiologyReportDrafted] MRI findings transcribed into report draft.', stats: { rev: '+180.00', tat: '44 min', stock: 'Reagents: -5ml' } },
  { step: 5, node: 'typing', label: 'Typist Desk', action: 'Draft compiled into clinical report.', log: '[Event: DraftReportGenerated] Consolidated PDF report drafted.', stats: { rev: '+180.00', tat: '49 min', stock: 'Reagents: -5ml' } },
  { step: 6, node: 'pathologist', label: 'Pathologist', action: 'Digitally validated and reports signed.', log: '[Event: ReportSignedOff] Pathologist digitally signed results.', stats: { rev: '+180.00', tat: '55 min', stock: 'Reagents & Tubes: Reconciled' } },
  { step: 7, node: 'ims', label: 'Smart IMS', action: 'Reagents decrement registered.', log: '[Event: InventoryDecremented] Stock counts updated. Automated order alert sent.', stats: { rev: '+180.00', tat: '55 min', stock: 'Smart Alert: Reagents Low' } },
  { step: 8, node: 'expense', label: 'Expense Feed', action: 'Doctor commission posted to ledger.', log: '[Event: ExpenseLedgerPosted] Referred Dr. Ravi: +5.00 credit posted.', stats: { rev: '+180.00', tat: '56 min', stock: 'Ledgers Sync' } },
  { step: 9, node: 'payroll', label: 'HR Payroll', action: 'Technician attendance overtime credited.', log: '[Event: PayrollReconciled] Biometric attendance verified. Processing overtime.', stats: { rev: '+180.00', tat: '56 min', stock: 'Overtime Reconciled' } },
  { step: 10, node: 'delivery', label: 'Delivery Desk', action: 'Automated dispatches sent.', log: '[Event: ReportDispatched] PDF delivered via WhatsApp (+91-982..) & Email.', stats: { rev: '+180.00', tat: '57 min', stock: 'Delivered' } }
];

export default function SynosPage({ onBack, onContactClick }) {
  const [activeNode, setActiveNode] = useState('reception');
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [awakenedNodes, setAwakenedNodes] = useState([]);
  
  // Simulation states
  const [simStep, setSimStep] = useState(null);
  const [simPlaying, setSimPlaying] = useState(false);
  const [simLog, setSimLog] = useState([
    'Simulation Engine initialized.',
    'Click START VISIT to observe the Event Loop...'
  ]);
  const [simStats, setSimStats] = useState({
    revenue: '0.00',
    tat: '0 min',
    inventory: '100% capacity'
  });

  // Pathology experience states
  const [pathologyStep, setPathologyStep] = useState(0);

  // Radiology PACS Dictation triggers
  const [selectedScan, setSelectedScan] = useState(null);
  const [dicomTransferring, setDicomTransferring] = useState(false);
  const [radiologistDictation, setRadiologistDictation] = useState('');
  const [radiologyStage, setRadiologyStage] = useState('idle');

  // Business Ops states
  const [testSliderCount, setTestSliderCount] = useState(1500);

  // WhatsApp / Email delivery popup trigger
  const [showDispatchToast, setShowDispatchToast] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState(null);

  // Director dashboard view filter
  const [directorFilter, setDirectorFilter] = useState('all');
  const [isSnapping, setIsSnapping] = useState(true);

  // Cause & Effect drawer state
  const [pipelineOpen, setPipelineOpen] = useState(false);

  // Helper mappings for the screen grid buttons to match the ChatGPT design
  const getButtonText = (nodeId) => {
    const textMapping = {
      director: 'Open Dashboard',
      radiologist: 'Open Workspace',
      reception: 'Open Reception',
      phlebotomy: 'Open Phlebotomy',
      workbench: 'Open Workbench',
      typing: 'Open Typing',
      pathologist: 'Open Approval',
      delivery: 'Open Delivery',
      ims: 'Open IMS',
      finance: 'Open Finance',
      expense: 'Open Expenses',
      payroll: 'Open Payroll',
      payrollIntel: 'View Payslips',
      radiologyConsole: 'Open Console',
      billing: 'Open Billing'
    };
    return textMapping[nodeId] || 'Inspect';
  };

  // Dynamic color glows for cards on hover
  const getGlowColor = (nodeId) => {
    const colorMapping = {
      director: 'rgba(139, 92, 246, 0.12)',     // violet
      radiologist: 'rgba(244, 63, 94, 0.12)',    // rose
      reception: 'rgba(59, 130, 246, 0.12)',     // blue
      billing: 'rgba(59, 130, 246, 0.12)',
      phlebotomy: 'rgba(244, 63, 94, 0.12)',     // pink/rose
      workbench: 'rgba(6, 182, 212, 0.12)',      // cyan
      typing: 'rgba(59, 130, 246, 0.12)',
      radiologyConsole: 'rgba(244, 63, 94, 0.12)',
      pathologist: 'rgba(139, 92, 246, 0.12)',
      delivery: 'rgba(59, 130, 246, 0.12)',
      ims: 'rgba(245, 158, 11, 0.12)',          // amber
      finance: 'rgba(16, 185, 129, 0.12)',      // emerald
      expense: 'rgba(239, 68, 68, 0.12)',        // red
      payroll: 'rgba(99, 102, 241, 0.12)',       // indigo
      payrollIntel: 'rgba(139, 92, 246, 0.12)'
    };
    return colorMapping[nodeId] || 'rgba(45, 212, 191, 0.12)';
  };

  // Dynamic grid card builder matching flagship highlights and standard screens
  const renderGridCard = (nodeId, colSpanClass = '', isHighlight = false) => {
    const node = nodeDefinitions[nodeId];
    if (!node) return null;
    const Icon = node.icon;
    const isActive = activeNode === nodeId;
    const glowColor = getGlowColor(nodeId);

    const handleClick = (e) => {
      e.stopPropagation();
      setActiveNode(nodeId);
      setPipelineOpen(true);
    };

    if (isHighlight) {
      return (
        <motion.div
          whileHover={{ 
            y: -8, 
            scale: 1.015,
            boxShadow: `0 20px 30px -10px rgba(0,0,0,0.7), 0 0 25px 2px ${glowColor}`,
            borderColor: 'rgba(255,255,255,0.15)'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={handleClick}
          className={`col-span-1 ${colSpanClass} p-1 rounded-2xl md:rounded-3xl border transition-all duration-500 cursor-pointer bg-[#05050a]/80 backdrop-blur-md relative overflow-hidden group select-none flex flex-col lg:flex-row items-stretch justify-between ${
            isActive 
              ? 'border-teal-500/80 shadow-[0_0_20px_rgba(45,212,191,0.15)] ring-1 ring-teal-500/20' 
              : 'border-zinc-900/90 hover:border-zinc-800'
          }`}
        >
          {/* Left Description Side */}
          <div className="w-full lg:w-[42%] p-4 sm:p-5 lg:p-8 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
                <div className={`p-1 sm:p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center ${node.colorClass.split(' ')[0]}`}>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[10px] sm:text-xs font-sans font-bold text-zinc-400 uppercase tracking-widest">{node.category}</span>
              </div>
              <h3 className="text-sm sm:text-base lg:text-2xl font-extrabold text-white tracking-tight leading-tight group-hover:text-teal-400 transition-colors mt-1 sm:mt-2">
                {node.title}
              </h3>
              <p className="text-xs lg:text-sm text-zinc-400 mt-1 sm:mt-2 font-light leading-relaxed">
                {node.subtitle}
              </p>
            </div>
            <button
              onClick={handleClick}
              className="w-fit py-1 px-2.5 sm:py-2 sm:px-4 rounded-full bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 hover:border-teal-500/40 text-[10px] sm:text-xs font-sans font-semibold text-teal-400 flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-6 transition-all duration-300 border-none cursor-pointer"
            >
              <span>{getButtonText(nodeId)}</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right Visual Side */}
          <div className="w-full lg:w-[58%] p-2 sm:p-4 bg-zinc-950/40 border-t lg:border-t-0 lg:border-l border-zinc-900/90 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-3.5 sm:h-5 bg-zinc-950 border-b border-zinc-900/80 px-2 sm:px-3 flex items-center gap-1 sm:gap-1.5 z-10">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-zinc-800" />
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-zinc-800" />
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-zinc-800" />
            </div>
            <div className="w-full h-full min-h-[120px] sm:min-h-[160px] lg:min-h-[240px] rounded-xl overflow-hidden bg-[#0c0c0f] border border-zinc-850 relative group/screenshot mt-2 sm:mt-3 flex flex-col justify-end">
              <img 
                src={node.screenshot} 
                alt={node.title} 
                className="w-full h-full object-cover object-top brightness-[0.75] group-hover:brightness-95 transition-all duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <span className="px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-teal-600/90 text-white font-sans text-[10px] sm:text-xs font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-lg">
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" /> Enlarge Screen
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            boxShadow: `0 20px 30px -10px rgba(0,0,0,0.7), 0 0 25px 2px ${glowColor}`,
            borderColor: 'rgba(255,255,255,0.12)'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={handleClick}
          className={`col-span-1 p-1 rounded-2xl md:rounded-3xl border transition-all duration-500 cursor-pointer bg-[#05050a]/80 backdrop-blur-md relative overflow-hidden group select-none flex flex-col justify-between min-h-[180px] sm:min-h-[240px] lg:min-h-[340px] ${
            isActive 
              ? 'border-teal-500/80 shadow-[0_0_20px_rgba(45,212,191,0.15)] ring-1 ring-teal-500/20' 
              : 'border-zinc-900/90 hover:border-zinc-800'
          }`}
        >
          {/* Top Description Part */}
          <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <div className={`p-1 sm:p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center ${node.colorClass.split(' ')[0]}`}>
                  <Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="text-[10px] sm:text-xs font-sans font-bold text-zinc-500 uppercase tracking-widest">{node.category}</span>
              </div>
              <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white tracking-tight leading-tight group-hover:text-teal-400 transition-colors mt-1 sm:mt-2">
                {node.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1.5 font-light leading-relaxed line-clamp-2">
                {node.subtitle}
              </p>
            </div>
            <button
              onClick={handleClick}
              className="w-fit py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 hover:border-teal-500/40 text-[10px] font-sans font-semibold text-teal-400 flex items-center gap-1 mt-1.5 sm:mt-4 transition-all duration-300 border-none cursor-pointer"
            >
              <span>{getButtonText(nodeId)}</span>
              <ArrowRight className="w-2 h-2 sm:w-3 sm:h-3" />
            </button>
          </div>

          {/* Bottom Screen Thumbnail */}
          <div className="px-1.5 pb-1.5 sm:px-4 sm:pb-4 w-full">
            <div className="w-full h-20 sm:h-28 lg:h-40 rounded-lg sm:rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850/80 relative flex flex-col justify-end">
              <div className="absolute top-0 left-0 right-0 h-3 sm:h-4 bg-zinc-950 border-b border-zinc-900/80 px-2 flex items-center gap-1 z-10">
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-zinc-800" />
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-zinc-800" />
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-zinc-800" />
              </div>
              <div className="w-full h-[calc(100%-8px)] sm:h-[calc(100%-12px)] overflow-hidden bg-[#0c0c0f]">
                <img 
                  src={node.screenshot} 
                  alt={node.title} 
                  className="w-full h-full object-cover object-top brightness-[0.7] group-hover:brightness-95 transition-all duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <span className="px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded bg-teal-600/90 text-white font-sans text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-md">
                  <ZoomIn className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" /> Inspect Screen
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  // Scroll Parallax Hooks for high-end aesthetics
  const pageContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: pageContainerRef,
    offset: ["start start", "end end"]
  });

  const scrollYBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.05]);

  const sectionRefs = {
    hero: useRef(null),
    topology: useRef(null),
    why: useRef(null),
    journey: useRef(null),
    pathology: useRef(null),
    radiology: useRef(null),
    business: useRef(null),
    director: useRef(null)
  };

  const [activeSection, setActiveSection] = useState('hero');

  // Trigger Awakening Animation sequentially
  useEffect(() => {
    const sequence = ['reception', 'laboratory', 'radiology', 'finance', 'director'];
    sequence.forEach((nodeId, idx) => {
      setTimeout(() => {
        setAwakenedNodes(prev => [...prev, nodeId]);
      }, 300 + idx * 400);
    });
  }, []);

  // Simulation loop trigger
  useEffect(() => {
    let timer;
    if (simPlaying && simStep !== null) {
      timer = setTimeout(() => {
        handleNextSimStep();
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [simPlaying, simStep]);

  // Scroll section listener on container scroll
  const handleScroll = (e) => {
    const container = e.currentTarget;
    const scrollPos = container.scrollTop + 350;
    const keys = Object.keys(sectionRefs);
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      if (sectionRefs[key].current && scrollPos >= sectionRefs[key].current.offsetTop) {
        setActiveSection(key);
        break;
      }
    }
  };

  const scrollToSection = (sec) => {
    setIsSnapping(false);
    sectionRefs[sec].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      setIsSnapping(true);
    }, 1000);
  };

  // Simulation handlers
  const startSimulation = () => {
    setSimStep(0);
    setSimPlaying(true);
    const stepData = simSteps[0];
    setActiveNode(stepData.node);
    setSimLog([stepData.log, 'Propagating live check-in flow...']);
    setSimStats({
      revenue: stepData.stats.rev,
      tat: stepData.stats.tat,
      inventory: stepData.stats.stock
    });
  };

  const stopSimulation = () => {
    setSimPlaying(false);
  };

  const resetSimulation = () => {
    setSimStep(null);
    setSimPlaying(false);
    setActiveNode('reception');
    setSimLog(['Simulation reset. Ready to launch.']);
    setSimStats({ revenue: '0.00', tat: '0 min', inventory: '100% capacity' });
  };

  const handleNextSimStep = () => {
    if (simStep === null) {
      startSimulation();
      return;
    }
    const nextStep = (simStep + 1) % simSteps.length;
    setSimStep(nextStep);
    const stepData = simSteps[nextStep];
    setActiveNode(stepData.node);
    setSimLog(prev => [stepData.log, ...prev].slice(0, 6));
    setSimStats({
      revenue: stepData.stats.rev,
      tat: stepData.stats.tat,
      inventory: stepData.stats.stock
    });

    // Handle automated dispatch feedback
    if (stepData.node === 'delivery') {
      setDispatchInfo({
        patient: 'MRN-4829 (Test Patient)',
        methods: ['WhatsApp: +91 98233 41029', 'Email: arun.kumar@gmail.com', 'Physical counter collection ready']
      });
      setShowDispatchToast(true);
      setTimeout(() => setShowDispatchToast(false), 6500);
    }

    if (nextStep === simSteps.length - 1 && simPlaying) {
      setTimeout(() => {
        setSimPlaying(false);
        setSimLog(prev => ['✔ Auto dispatch complete. WhatsApp API & Mailgun vectors resolved.', ...prev]);
      }, 4000);
    }
  };

  // Radiology PACS dictation
  const triggerDicomPACSScan = (scan) => {
    setSelectedScan(scan);
    setRadiologyStage('transferring');
    setDicomTransferring(true);
    setRadiologistDictation('');
    
    setTimeout(() => {
      setDicomTransferring(false);
      setRadiologyStage('pacs');
      
      setTimeout(() => {
        setRadiologistDictation(scan.findings);
        setRadiologyStage('dictated');
      }, 1500);
    }, 2000);
  };

  return (
    <div 
      ref={pageContainerRef}
      onScroll={handleScroll}
      className={`relative h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-teal-500/20 selection:text-white overflow-y-auto overflow-x-hidden ${isSnapping ? 'snap-y snap-proximity' : ''} scroll-smooth scrollbar-none`}
    >
      {/* Scroll parallax background shape elements */}
      <motion.div 
        style={{ y: scrollYBg, opacity: glowOpacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-teal-500/5 via-transparent to-transparent rounded-full blur-[140px] pointer-events-none z-0" 
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />

      {/* Floating Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#030303]/80 backdrop-blur-md border-b border-zinc-900 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-zinc-400 hover:text-white transition-colors group cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Studio
          </button>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <span className="text-2xl font-display font-extrabold text-white tracking-wider">
            Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">OS</span>
          </span>
        </div>

        {/* Section Links */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6">
          <button onClick={() => scrollToSection('hero')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'hero' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>Overview</button>
          <button onClick={() => scrollToSection('topology')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'topology' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>At a Glance</button>
          <button onClick={() => scrollToSection('why')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'why' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>Why SynOS</button>
          <button onClick={() => scrollToSection('journey')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'journey' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>Patient Flow</button>
          <button onClick={() => scrollToSection('pathology')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'pathology' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>Pathology</button>
          <button onClick={() => scrollToSection('radiology')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'radiology' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>Radiology</button>
          <button onClick={() => scrollToSection('business')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'business' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>Business & IMS</button>
          <button onClick={() => scrollToSection('director')} className={`text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap ${activeSection === 'director' ? 'text-teal-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}>Command Center</button>
        </div>

        <button 
          onClick={onContactClick}
          className="text-xs font-sans font-medium uppercase tracking-wider px-4 py-2 rounded-full border border-teal-500/20 text-teal-400 hover:bg-teal-500/10 transition-all cursor-pointer bg-transparent"
        >
          Book SynOS Demo
        </button>
      </nav>

      {/* Floating dot progression sidebar */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 hidden md:flex">
        {['hero', 'topology', 'why', 'journey', 'pathology', 'radiology', 'business', 'director'].map((sec) => (
          <button
            key={sec}
            onClick={() => scrollToSection(sec)}
            className="group flex items-center justify-end gap-3 text-right cursor-pointer border-none bg-transparent"
          >
            <span className="text-xs font-sans font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">
              {sec === 'topology' ? 'At a Glance' : sec === 'why' ? 'Why SynOS' : sec === 'journey' ? 'Patient Flow' : sec === 'business' ? 'Business & IMS' : sec === 'director' ? 'Command Center' : sec === 'hero' ? 'Overview' : sec}
            </span>
            <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSection === sec ? 'bg-teal-400 scale-125 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-zinc-800 scale-100 group-hover:bg-zinc-650'
            }`} />
          </button>
        ))}
      </div>

      {/* CONTENT SECTIONS */}
      {/* CHAPTER 0: CINEMATIC HERO */}
      <section 
        ref={sectionRefs.hero}
        className="snap-start md:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center items-center py-10 md:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto"
      >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-650/5 rounded-full blur-[120px] pointer-events-none" />
                   <div className="text-center max-w-5xl relative z-10 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-sm text-teal-400 font-mono uppercase tracking-[0.2em] mb-4 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full w-fit mx-auto animate-pulse"
            >
              Diagnostics Lab Operating System
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-display font-extrabold text-7xl sm:text-9xl text-white tracking-tight leading-none mb-6"
            >
              Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">OS</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl sm:text-3xl text-zinc-300 font-display font-medium tracking-tight mb-4"
            >
              Designed around how diagnostics actually operate.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.45 }}
              className="text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed text-base sm:text-lg"
            >
              One connected system coordinating Operations, Pathology, Radiology, Finance, and Inventory integrated with PACS, DICOM viewer in real time.
            </motion.p>
          </div>

          {/* Awakening Visual Grid */}
          <div className="w-full max-w-full px-4 relative z-10">
            <div className="text-center mb-8">
              <span className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
                Awakening Sequence: Operational Topology Connecting
              </span>
            </div>
            
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
              {[
                { id: 'reception', name: 'Operations', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)] border-blue-500/30 text-blue-400', desc: 'Reception & Typing' },
                { id: 'laboratory', name: 'Pathology', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/30 text-cyan-400', desc: 'Workbench & Validation' },
                { id: 'radiology', name: 'Radiology', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)] border-rose-500/30 text-rose-455 text-rose-400', desc: 'MRI / CT Scanners' },
                { id: 'finance', name: 'Smart IMS & HR', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-500/30 text-amber-400', desc: 'Auto-decrement Reagents' },
                { id: 'director', name: 'Director Screen', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.15)] border-indigo-500/30 text-indigo-400', desc: 'Consolidated overview' }
              ].map((item) => {
                const isAwakened = awakenedNodes.includes(item.id);
                return (
                  <div 
                     key={item.id}
                     className={`p-2.5 sm:p-6 rounded-2xl border transition-all duration-1000 flex flex-col justify-between h-24 sm:h-36 bg-zinc-950/40 backdrop-blur-sm relative overflow-hidden group select-none ${
                      isAwakened 
                        ? `${item.glow} bg-zinc-950/80` 
                        : 'border-zinc-900 text-zinc-650 opacity-40'
                    }`}
                  >
                    {isAwakened && (
                      <div className="absolute -inset-px bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-50" />
                    )}

                    <div className="flex justify-between items-start">
                      <span className="text-[10px] sm:text-xs font-mono tracking-wider opacity-70">DEPT 0{awakenedNodes.indexOf(item.id) + 1 || '?'}</span>
                      {isAwakened ? (
                        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-current animate-pulse shadow-glow" />
                      ) : (
                        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-zinc-800" />
                      )}
                    </div>

                    <div className="text-left mt-1 sm:mt-6">
                      <div className="text-xs sm:text-sm lg:text-base font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors leading-none">
                        {item.name}
                      </div>
                      <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5 sm:mt-1 truncate sm:whitespace-normal">
                        {isAwakened ? item.desc : 'Sync pending...'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* EXPERIENCE 1: THE SYNOS NETWORK TOPOLOGY */}
        <section 
          ref={sectionRefs.topology}
          className="snap-start md:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center py-10 md:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto"
        >
          {/* Experience Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
            <div className="max-w-3xl text-left">
              <span className="text-xs text-teal-400 font-sans font-bold uppercase tracking-[0.25em] bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
                Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">OS</span> at a Glance
              </span>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-none mb-4">
                One System. Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Operation.</span>
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-base sm:text-lg">
                Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">OS</span> unifies every department, workflow, and decision in your diagnostics center. Real-time. Integrated. Intelligent.
              </p>
            </div>

            {/* Header Stats Panel */}
            <div className="flex flex-wrap gap-4 lg:self-start">
              {[
                { icon: UserPlus, value: '13+', label: 'Departments Connected' },
                { icon: Radio, value: '24+', label: 'Live Screens In Action' },
                { icon: Zap, value: '1000+', label: 'Events / Sec Synced' }
              ].map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="p-4 px-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm flex items-center gap-4 min-w-[220px] flex-1 lg:flex-initial text-left select-none">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      <StatIcon className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-2xl font-sans font-bold text-white leading-none">{stat.value}</div>
                      <div className="text-xs text-zinc-400 mt-1 font-sans font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Asymmetric Flagship Grid Overhaul (ChatGPT Layout style) */}
          <div className="flex flex-col gap-4 md:gap-6 w-full text-left">
            
            {/* Row 1: Flagship Highlights (2 columns - Director & Radiologist) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
              {/* Card 1: Director Command Center */}
              {renderGridCard('director', 'col-span-1 lg:col-span-7', true)}

              {/* Card 2: Radiologist Workspace */}
              {renderGridCard('radiologist', 'col-span-1 lg:col-span-5', true)}
            </div>

            {/* Row 2: Core Operations & Testing (3 columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
              {renderGridCard('reception', '', false)}
              {renderGridCard('phlebotomy', '', false)}
              {renderGridCard('workbench', '', false)}
            </div>

            {/* Row 3: Diagnostics & Sign-off (4 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
              {renderGridCard('typing', '', false)}
              {renderGridCard('pathologist', '', false)}
              {renderGridCard('delivery', '', false)}
              {renderGridCard('ims', '', false)}
            </div>

            {/* Row 4: Administrative Operations (5 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
              {renderGridCard('finance', '', false)}
              {renderGridCard('expense', '', false)}
              {renderGridCard('payroll', '', false)}
              {renderGridCard('payrollIntel', '', false)}

              {/* Decorative Network Card */}
              <div className="col-span-1 lg:col-span-1 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-900/90 bg-gradient-to-br from-teal-950/20 via-[#05050a] to-blue-950/10 flex flex-col justify-between min-h-[180px] sm:min-h-[240px] lg:min-h-[340px] relative overflow-hidden group select-none">
                <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
                
                {/* Glowing animation particles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-teal-500/5 rounded-full blur-2xl animate-pulse pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-sans font-bold text-teal-400 uppercase tracking-widest">Network Orchestrator</span>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white tracking-tight leading-tight mt-1 sm:mt-2">
                    Every Screen. Connected.
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 sm:mt-2 font-light leading-relaxed">
                    A websocket event loop syncing all diagnostic modules.
                  </p>
                </div>
                
                {/* Micro animation block */}
                <div className="h-8 sm:h-10 w-full flex items-center justify-around mt-3 sm:mt-4 bg-zinc-900/40 border border-zinc-850 rounded-lg sm:rounded-xl px-2 sm:px-3 relative overflow-hidden">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Sync Active</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Value Propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-16 pt-4 sm:pt-8 border-t border-zinc-900/60">
            {[
              { title: 'Real-time Event Engine', desc: 'Every action updates all connected systems instantly', icon: Network, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
              { title: 'Zero Manual Handoffs', desc: 'Automated queues, validations and notifications', icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
              { title: 'End-to-End Visibility', desc: 'From first visit to final report & financial impact', icon: Eye, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { title: 'Secure & Compliant', desc: 'Role-based access with full audit trail', icon: ShieldAlert, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
            ].map((prop, idx) => {
              const PropIcon = prop.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-950/15 border border-zinc-900 text-left">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${prop.color}`}>
                    <PropIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm md:text-base font-bold text-white font-display leading-tight">{prop.title}</h4>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-400 mt-1 font-light leading-relaxed">{prop.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section 
          ref={sectionRefs.why}
          className="snap-start md:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center py-10 md:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            <div className="col-span-12 lg:col-span-5 text-left">
              <span className="text-xs sm:text-base text-violet-400 font-mono uppercase tracking-[0.2em]">Why Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">OS</span></span>
              <h2 className="font-display font-bold text-lg sm:text-3xl md:text-5xl text-white tracking-tight mt-1 sm:mt-2 mb-2 sm:mb-6 leading-none">
                Operational Silence
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-xs sm:text-base lg:text-lg mb-2 sm:mb-6 max-w-xl">
                Legacy software keeps departments locked in static databases. Reception has no visibility into lab backlogs. Technicians process scans without payment validation. Management finds leakages weeks too late.
              </p>
              <p className="text-zinc-300 font-light leading-relaxed text-xs sm:text-base lg:text-lg max-w-xl">
                Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">OS</span> connects the clinic into a single reactive city. A transaction in one room immediately updates queues and balances across the entire organization.
              </p>
            </div>

            {/* Split Comparison Diagram - Cause and Effect instead of paragraphs */}
            <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              
              {/* SILENCE */}
              <div className="rounded-2xl md:rounded-3xl border border-red-950/20 bg-red-950/5 p-4 sm:p-6 relative flex flex-col justify-between min-h-[200px] sm:min-h-[260px] lg:min-h-[380px]">
                <div className="text-xs sm:text-sm font-mono text-red-400 tracking-wider select-none uppercase mb-2 sm:mb-4">
                  Legacy Silos ❌
                </div>

                <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col justify-center">
                  {[
                    { node: 'Reception', err: 'Cannot check lab workbench backlogs.' },
                    { node: 'Pathology', err: 'Processes samples with no billing validation checks.' },
                    { node: 'Radiology', err: 'Scans studies without updating PACS report signatures.' }
                  ].map((s, idx) => (
                    <div key={idx} className="p-2 sm:p-2.5 md:p-3.5 rounded bg-zinc-950/45 border border-red-900/15 flex items-start gap-2 sm:gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      <div className="text-left leading-none">
                        <div className="text-xs sm:text-sm font-bold text-red-200">{s.node}</div>
                        <div className="text-[10px] sm:text-xs text-zinc-455 mt-0.5 sm:mt-1 truncate max-w-[120px] sm:max-w-none">{s.err}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] sm:text-xs text-zinc-400 font-mono text-center border-t border-zinc-900 pt-2 sm:pt-3">
                  Average 8% referral payouts leakage
                </div>
              </div>

              {/* SYNOS LOOP */}
              <div className="rounded-2xl md:rounded-3xl border border-violet-950/20 bg-violet-950/5 p-4 sm:p-6 relative flex flex-col justify-between min-h-[200px] sm:min-h-[260px] lg:min-h-[380px]">
                <div className="text-xs sm:text-sm font-mono text-violet-400 tracking-wider select-none uppercase mb-2 sm:mb-4">
                  Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">OS</span> Loop ✔
                </div>

                <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col justify-center">
                  {[
                    { step: 'Patient Registered', action: 'Reception MRN generated' },
                    { step: 'Billing Verification', action: 'Unlocks Phlebotomy draw list' },
                    { step: 'Reagent IMS Auto-Deduct', action: 'Calculates shelf stocks' }
                  ].map((s, idx) => (
                    <div key={idx} className="p-2 sm:p-2.5 md:p-3.5 rounded bg-zinc-950/80 border border-violet-900/25 flex items-start gap-2 sm:gap-3 relative overflow-hidden">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5 animate-pulse" />
                      <div className="text-left leading-none">
                        <div className="text-xs sm:text-sm font-bold text-white">{s.step}</div>
                        <div className="text-[10px] sm:text-xs text-violet-400 mt-0.5 sm:mt-1 truncate max-w-[120px] sm:max-w-none">{s.action}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-violet-500/40 absolute right-2 sm:right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  ))}
                </div>

                <div className="text-[10px] sm:text-xs text-violet-400 font-mono text-center border-t border-zinc-900 pt-2 sm:pt-3 flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> SignalR active
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* EXPERIENCE 2: RUN A PATIENT (MINIATURE CITY SIMULATION) */}
        <section 
          ref={sectionRefs.journey}
          className="snap-start md:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center py-10 md:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto text-left"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-8 sm:mb-16">
            <div className="col-span-12 lg:col-span-8">
              <span className="text-xs sm:text-sm text-violet-400 font-mono uppercase tracking-[0.2em]">Experience 02</span>
              <h2 className="font-display font-bold text-lg sm:text-3xl md:text-5xl text-white tracking-tight mt-1 sm:mt-2 mb-1 sm:mb-4 leading-none">
                Patient Flow Simulator
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-xs sm:text-base lg:text-lg mt-1">
                Click **START VISIT** or **STEP** to watch a patient token flow across the organization in real-time.
              </p>
            </div>
            
            {/* Simulation Controller Console */}
            <div className="col-span-12 lg:col-span-4 p-4 rounded-2xl border border-zinc-900 bg-zinc-950/80 flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 animate-pulse" />
                  PROPAGATION CONTROLLER
                </span>
                {simStep !== null && (
                  <span className="text-xs font-mono text-zinc-400">
                    Step {simStep + 1} of {simSteps.length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {simPlaying ? (
                  <button 
                    onClick={stopSimulation}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-900 border border-zinc-855 text-[10px] sm:text-xs font-mono font-bold text-zinc-300 hover:bg-zinc-800 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer border-none"
                  >
                    <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> PAUSE
                  </button>
                ) : (
                  <button 
                    onClick={simStep === null ? startSimulation : () => setSimPlaying(true)}
                    className="flex-1 py-1.5 rounded-lg bg-violet-650 hover:bg-violet-600 text-[10px] sm:text-xs font-mono font-bold text-white flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-lg shadow-violet-500/10 border-none"
                  >
                    <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {simStep === null ? 'START' : 'RESUME'}
                  </button>
                )}

                <button 
                  onClick={handleNextSimStep}
                  className="py-1.5 px-2.5 sm:px-3 rounded-lg bg-zinc-900 border border-zinc-855 text-[10px] sm:text-xs font-mono font-bold text-zinc-300 hover:bg-zinc-800 flex items-center justify-center gap-1 cursor-pointer border-none"
                >
                  STEP <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>

                <button 
                  onClick={resetSimulation}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-855 text-zinc-400 hover:text-white cursor-pointer border-none flex items-center justify-center"
                  title="Reset"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* City simulation metrics & layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left: Simulation progress steps */}
            <div className="col-span-12 lg:col-span-8 space-y-3">
              <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/65 font-mono text-xs relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
                <div className="text-xs text-zinc-450 uppercase tracking-widest mb-3 flex items-center justify-between z-10 relative">
                  <span>REAL-TIME SIGNALR BROADCAST CHANNEL</span>
                  <span className="text-violet-400 animate-pulse">● Live Stream</span>
                </div>
                
                <div className="space-y-1.5 max-h-36 overflow-y-auto flex flex-col text-left z-10 relative">
                  {simLog.map((log, idx) => (
                    <div key={idx} className={`p-1 px-2 rounded ${idx === 0 ? 'bg-violet-950/20 text-violet-300 font-semibold' : 'text-zinc-655 text-zinc-500'}`}>
                      ➔ {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress step bar cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { step: 0, node: 'reception', label: '01. Reception', desc: 'Registers patient visit & select billed tests.' },
                  { step: 3, node: 'workbench', label: '02. Laboratory', desc: 'Analyzer outputs parameter logs automatically.' },
                  { step: 6, node: 'pathologist', label: '03. Pathologist', desc: 'Clinically validates results, releases reports.' },
                  { step: 10, node: 'delivery', label: '04. Dispatch Desk', desc: 'WhatsApp API delivers PDF reports instantly.' }
                ].map((s) => {
                  const isActive = simStep !== null && simSteps[simStep].node === s.node;
                  const isPassed = simStep !== null && simStep >= s.step;
                  return (
                    <button
                      key={s.step}
                      onClick={() => {
                        setSimStep(s.step);
                        setActiveNode(s.node);
                        setSimLog(prev => [`[Manual Override] Inspected ${s.label} console.`, ...prev]);
                      }}
                      className={`p-3 lg:p-4 rounded-xl bg-zinc-950/25 border text-left transition-all duration-300 cursor-pointer border-none flex flex-col justify-between ${
                        isActive 
                          ? 'border-violet-500 bg-violet-950/10 text-white font-semibold' 
                          : isPassed 
                            ? 'border-zinc-800 bg-zinc-900/10 text-zinc-300' 
                            : 'border-zinc-900 bg-zinc-950/20 text-zinc-550'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between w-full">
                        <span>{s.label.split(' ')[1]}</span>
                        {isPassed && <Check className="w-3 h-3 text-violet-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] sm:text-xs text-zinc-500 font-light leading-relaxed mt-1.5 sm:mt-2">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Simulation dashboard overview */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-4">
                  SIMULATION TELEMETRY
                </span>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-2 sm:p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                    <span className="text-[10px] sm:text-xs text-zinc-450 block font-mono">GROSS SALES:</span>
                    <span className="text-sm sm:text-xl font-mono font-bold text-white">{simStats.revenue}</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                    <span className="text-[10px] sm:text-xs text-zinc-450 block font-mono">VISIT TAT:</span>
                    <span className="text-sm sm:text-xl font-mono font-bold text-violet-400">{simStats.tat}</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                    <span className="text-[10px] sm:text-xs text-zinc-450 block font-mono">REAGENT IMS:</span>
                    <span className="text-sm sm:text-xl font-mono font-bold text-emerald-400">{simStats.inventory}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section 
          ref={sectionRefs.pathology}
          className="snap-start lg:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center py-10 lg:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto text-left"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-8">
              <span className="text-sm text-violet-400 font-mono uppercase tracking-[0.2em]">Experience 03</span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mt-2 mb-4">
                Pathology Lab Engine
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-base sm:text-lg">
                Witness a patient's sample moving from collection tube to digital signature validation inside the laboratory.
              </p>
            </div>

            {/* Pathology Tab selector */}
            <div className="lg:col-span-4 p-2 bg-zinc-900/60 border border-zinc-850 rounded-xl flex items-center justify-between">
              {['Phlebotomy', 'Workbench', 'Pathologist'].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setPathologyStep(idx)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer border-none ${
                    pathologyStep === idx 
                      ? 'bg-violet-650 text-white shadow-md' 
                      : 'text-zinc-555 hover:text-zinc-200 bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Visual laboratory stage details (Left) */}
            <div className="lg:col-span-4 p-6 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between">
              {pathologyStep === 0 && (
                <div>
                  <span className="text-xs font-mono text-zinc-450 uppercase tracking-widest block mb-2">STAGE 01 // SAMPLE DRAW</span>
                  <h3 className="text-lg font-bold text-white mb-4">Phlebotomy Station</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    The Phlebotomist validates patient fasting status. Billing state is checked, printing customized barcodes to track vacuum tubes.
                  </p>
                  
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs space-y-1.5 mt-6">
                    <div className="flex justify-between text-zinc-500"><span>MRN-4829 DRAW STAT:</span><span className="text-pink-400 font-bold">DRAW COMPLETED</span></div>
                    <div className="flex justify-between text-zinc-500"><span>BARCODE ASSIGNED:</span><span className="text-white">BAR-782109</span></div>
                  </div>
                </div>
              )}
              {pathologyStep === 1 && (
                <div>
                  <span className="text-xs font-mono text-zinc-450 uppercase tracking-widest block mb-2">STAGE 02 // LAB WORKBENCH</span>
                  <h3 className="text-lg font-bold text-white mb-4">Department Workbench</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    Samples are scanned into biochemical analysers. Analyzer uploads parameters directly, auto-flagging critical abnormal ranges.
                  </p>

                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs space-y-1.5 mt-6">
                    <div className="flex justify-between text-zinc-500"><span>ANALYZER SYNC:</span><span className="text-cyan-400 font-bold">Chemistry Analyzer Connected</span></div>
                    <div className="flex justify-between text-zinc-500"><span>GLUCOSE LEVEL:</span><span className="text-red-400 font-bold">142 mg/dL [High Alert]</span></div>
                  </div>
                </div>
              )}
              {pathologyStep === 2 && (
                <div>
                  <span className="text-xs font-mono text-zinc-450 uppercase tracking-widest block mb-2">STAGE 03 // CLINICAL SIGN-OFF</span>
                  <h3 className="text-lg font-bold text-white mb-4">Pathologist Validation</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    Pathologist reviews abnormal flags electronically. Digitally signing off validation triggers Smart IMS reagent deductions and releases dispatches.
                  </p>

                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs space-y-1.5 mt-6">
                    <div className="flex justify-between text-zinc-500"><span>VALIDATOR AUTHORITY:</span><span className="text-violet-400 font-bold">Dr. Sarah Cole [Validated]</span></div>
                    <div className="flex justify-between text-zinc-500"><span>PDF REPORT RELEASE:</span><span className="text-white font-bold">Signed PDF Generated</span></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const nodeMapping = ['phlebotomy', 'workbench', 'pathologist'];
                  setSelectedScreenshot(nodeDefinitions[nodeMapping[pathologyStep]].screenshot);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono font-bold text-white mt-8 border-none cursor-pointer"
              >
                Inspect Screen Screenshot
              </button>
            </div>

            {/* Visual active screen mockup view (Right) */}
            <div className="lg:col-span-8 p-4 rounded-3xl border border-zinc-900 bg-zinc-950/60 flex flex-col justify-center relative group overflow-hidden">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Active Console Monitor</span>
                <span className="text-xs bg-zinc-900 border border-zinc-880 px-1.5 py-0.5 rounded text-zinc-455 font-sans">
                  Real Screenshot
                </span>
              </div>

              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850">
                <img 
                  src={
                    pathologyStep === 0 ? phleboQueueImg : 
                    pathologyStep === 1 ? departmentWorkbenchImg : pathologistImg
                  } 
                  alt="Pathology screen view" 
                  className="w-full h-full object-cover object-top brightness-85 group-hover:brightness-95 transition-all duration-300"
                />
                
                {/* Overlay Expand Trigger */}
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    onClick={() => {
                      const nodeMapping = ['phlebotomy', 'workbench', 'pathologist'];
                      setSelectedScreenshot(nodeDefinitions[nodeMapping[pathologyStep]].screenshot);
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-200 transition-all cursor-pointer border-none"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    Enlarge Screenshot
                  </button>
                </div>
            </div>
          </div>
        </div>
      </section>

        {/* EXPERIENCE 4: RADIOLOGY SUITE */}
        <section 
          ref={sectionRefs.radiology}
          className="snap-start lg:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center py-10 lg:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto text-left"
        >
          <div className="w-full mb-8 lg:mb-16">
            <span className="text-sm text-violet-400 font-mono uppercase tracking-[0.2em]">Experience 04</span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mt-2 mb-4">
              Radiology Suite
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed text-base sm:text-lg">
              Synchronizes RAW scanner scans with doctor reporting consoles. Select a scan queue below to transmit DICOM files to PACS repositories and check voice auto-dictations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Scan Worklist (Left) */}
            <div className="col-span-1 p-5 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
                  <span className="text-xs font-mono text-zinc-450 uppercase tracking-wider">Modality Scan Queue</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 font-bold uppercase">Scanner online</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: 'SCN-10', scan: 'Brain MRI (T1/T2)', patient: 'Arun Kumar', status: 'ready', findings: 'L4-L5 left paracentral protrusion noted with compression on S1 nerve roots.' },
                    { id: 'SCN-11', scan: 'Cervical Spine CT', patient: 'Lata M.', status: 'ready', findings: 'C5-C6 degenerative osteophyte formations creating moderate foraminal stenosis.' },
                    { id: 'SCN-12', scan: 'Chest X-Ray (AP)', patient: 'David Ross', status: 'ready', findings: 'Lungs are clear bilaterally. No pleural effusion or cardiomegaly detected.' }
                  ].map((scan) => (
                    <button
                      key={scan.id}
                      onClick={() => triggerDicomPACSScan(scan)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        selectedScan?.id === scan.id 
                          ? 'border-rose-500 bg-rose-950/10 shadow-lg' 
                          : 'border-zinc-850 bg-zinc-900/30 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono text-zinc-500">{scan.id}</span>
                        <span className="text-xs font-mono text-rose-455 text-rose-400 font-semibold uppercase">Trigger Scan</span>
                      </div>
                      <div className="text-sm font-bold text-white">{scan.scan}</div>
                      <div className="text-xs text-zinc-400 mt-1 font-light">Patient: {scan.patient}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-xs font-mono text-zinc-500 leading-relaxed">
                * Click "Trigger Scan" to simulate DICOM slice uploads to PACS database.
              </div>
            </div>

            {/* PACS Server Pipeline Animation (Center) */}
            <div className="col-span-1 p-5 rounded-3xl border border-zinc-900 bg-zinc-950/60 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
              
              <div>
                <div className="text-xs font-mono text-zinc-455 uppercase tracking-widest mb-4">PACS Server Repository Node</div>
                
                <div className="h-44 border border-zinc-850 rounded-xl bg-zinc-950 flex flex-col items-center justify-center relative">
                  
                  {/* Pipeline Animation */}
                  {dicomTransferring ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
                      <div className="text-xs font-mono text-pink-455 text-pink-450 text-pink-400 animate-pulse uppercase tracking-widest">
                        UPLOADING DICOM SLICES...
                      </div>
                      <div className="text-xs font-mono text-zinc-500">256 slices/sec</div>
                    </div>
                  ) : radiologyStage === 'pacs' || radiologyStage === 'dictated' ? (
                    <div className="flex flex-col items-center gap-2">
                      <Database className="w-8 h-8 text-pink-455 text-pink-450 text-pink-400 animate-bounce" />
                      <div className="text-xs font-mono text-emerald-455 text-emerald-400 font-bold">
                        STUDY SYNCED [PACS]
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">UID: 1.2.840.11361.2291</span>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <span className="text-xs font-mono text-zinc-650 block">
                        Awaiting Modality Scan Transmission
                      </span>
                    </div>
                  )}

                </div>
              </div>

              {/* Typist screen supporting evidence */}
              <div className="mt-6 border-t border-zinc-900 pt-4 relative group">
                <span className="text-xs text-zinc-450 uppercase font-mono block mb-2">TYPIST WORKFLOW SCREENSHOT</span>
                <div className="relative aspect-[16/8] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850">
                  <img 
                    src={typistScreenImg} 
                    alt="Radiology Dictation Console"
                    className="w-full h-full object-cover object-top brightness-75 group-hover:brightness-90 transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40">
                    <button 
                      onClick={() => setSelectedScreenshot(typistScreenImg)}
                      className="px-2.5 py-1 rounded bg-white text-zinc-950 text-xs font-bold border-none cursor-pointer"
                    >
                      Enlarge Screenshot
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Radiologist Workspace & Dictation Output (Right) */}
            <div className="col-span-1 p-5 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
                  <span className="text-xs font-mono text-zinc-450 uppercase tracking-wider">Radiologist Workspace</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">Viewer active</span>
                </div>

                <div className="space-y-3 font-mono">
                  <div>
                    <span className="text-zinc-450 text-xs block mb-1">DIAGNOSIS ASSIGNMENT:</span>
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-300 text-xs">
                      {selectedScan ? (
                        <div>
                          <div className="font-bold text-white">{selectedScan.scan}</div>
                          <div className="text-zinc-500 text-xs mt-0.5">PATIENT: {selectedScan.patient}</div>
                        </div>
                      ) : (
                        <span className="text-zinc-650 font-light">No patient study loaded.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-450 text-xs block mb-1">AUTO VOICE-DICTATION OUTPUT:</span>
                    <div className="p-3 rounded bg-zinc-950 border border-zinc-900 min-h-[90px] text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans text-left">
                      {radiologyStage === 'transferring' ? (
                        <span className="text-pink-400 font-mono text-xs animate-pulse">Awaiting PACS synchronization...</span>
                      ) : radiologistDictation ? (
                        <motion.span 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                          className="text-zinc-300 font-light"
                        >
                          {radiologistDictation}
                        </motion.span>
                      ) : (
                        <span className="text-zinc-650 italic">Transcribing voice template...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Radiologist workspace supporting evidence */}
              <div className="mt-6 border-t border-zinc-900 pt-4 relative group">
                <span className="text-xs text-zinc-450 uppercase font-mono block mb-2">RADIOLOGIST INTERACTIVE VIEW</span>
                <div className="relative aspect-[16/8] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850">
                  <img 
                    src={radiologistImg} 
                    alt="Radiology PACS viewport console"
                    className="w-full h-full object-cover object-top brightness-75 group-hover:brightness-90 transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40">
                    <button 
                      onClick={() => setSelectedScreenshot(radiologistImg)}
                      className="px-2.5 py-1 rounded bg-white text-zinc-950 text-xs font-bold border-none cursor-pointer"
                    >
                      Enlarge Screenshot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* EXPERIENCE 5: BUSINESS OPERATIONS & SMART IMS ENGINE */}
        <section 
          ref={sectionRefs.business}
          className="snap-start lg:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center py-10 lg:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto text-left"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-8 lg:mb-16">
            <div className="lg:col-span-8">
              <span className="text-sm text-violet-400 font-mono uppercase tracking-[0.2em]">Experience 05</span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mt-2 mb-4">
                Smart IMS & Exception Payroll
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-base sm:text-lg">
                Synchronizes material and human resource operations. Adjust test volume counts below to calculate reagent auto-decrement levels and verify biometric payroll exceptions.
              </p>
            </div>
            
            {/* Slider */}
            <div className="lg:col-span-4 p-4 rounded-2xl border border-zinc-900 bg-zinc-950/80 flex flex-col gap-2 shadow-xl w-full">
              <span className="text-xs font-mono text-zinc-450 uppercase tracking-widest">
                processed tests volume simulator
              </span>
              <div className="flex items-center justify-between text-xs font-bold text-white font-mono mb-1">
                <span>SIMULATED VOLUMES:</span>
                <span className="text-violet-400 font-extrabold">{testSliderCount.toLocaleString()} tests</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="10000" 
                step="100" 
                value={testSliderCount} 
                onChange={(e) => setTestSliderCount(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-violet-500 border-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Smart IMS Reagent stock decrements (Card 1) */}
            <div className="p-4 sm:p-6 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase block">Smart IMS Core</span>
                  <Box className="w-4 h-4 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Reagent Auto-Deduct Loop</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mb-4">
                  Calculates reagent shelf-life and volume decrements automatically.
                </p>

                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-550">REAGENT VOLUME REMAINING:</span>
                    <span className="text-emerald-450 text-emerald-400 font-bold">{Math.max(0, 100 - (testSliderCount * 0.0085)).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">AUTO-ORDER TRIGGER THRESHOLD:</span>
                    <span className={testSliderCount > 6000 ? 'text-red-400 font-bold animate-pulse' : 'text-zinc-650'}>
                      {testSliderCount > 6000 ? '⚠️ LOW SHELF STOCK order sent' : '✔ normal capacity'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-900 pt-4 relative">
                <span className="text-xs text-zinc-450 uppercase font-mono block mb-2">INVENTORY STOCK STATUS REPORT</span>
                <div className="relative aspect-[16/8] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850">
                  <img 
                    src={inventoryImg} 
                    alt="Inventory stock reports"
                    className="w-full h-full object-cover object-top brightness-75 group-hover:brightness-90 transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40">
                    <button 
                      onClick={() => setSelectedScreenshot(inventoryImg)}
                      className="px-2.5 py-1.5 rounded bg-white text-zinc-950 text-xs font-bold border-none cursor-pointer"
                    >
                      Enlarge Screenshot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Feed ledger credit logs (Card 2) */}
            <div className="p-4 sm:p-6 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase block">FINANCIAL LEDGER</span>
                  <TrendingUp className="w-4 h-4 text-emerald-455 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Expense Feed ledger</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mb-4">
                  Accrues doctor commissions and vendor reagent bills in real-time.
                </p>

                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-550">GROSS REVENUES:</span>
                    <span className="text-white font-bold">{(testSliderCount * 45).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">B2B DOCTOR COMMISSIONS:</span>
                    <span className="text-red-400 font-bold">-{(testSliderCount * 5).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-900 pt-4 relative">
                <span className="text-xs text-zinc-450 uppercase font-mono block mb-2">GENERAL LEDGER EXCEL EXPORT</span>
                <div className="relative aspect-[16/8] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850">
                  <img 
                    src={expenseLedgerImg} 
                    alt="Finance Ledgers"
                    className="w-full h-full object-cover object-top brightness-75 group-hover:brightness-90 transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40">
                    <button 
                      onClick={() => setSelectedScreenshot(expenseLedgerImg)}
                      className="px-2.5 py-1.5 rounded bg-white text-zinc-950 text-xs font-bold border-none cursor-pointer"
                    >
                      Enlarge Screenshot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* HR Exception payroll releases (Card 3) */}
            <div className="p-4 sm:p-6 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase block">HR EXCEPTIONS</span>
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">HR Payroll exceptions</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mb-4">
                  Reconciles bank salary releases checking lateness exceptions automatically.
                </p>

                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-550">SHIFT EXCEPTIONS FLAGGED:</span>
                    <span className="text-amber-400 font-bold">2 late check-ins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">PAYROLL COMPILATION:</span>
                    <span className="text-emerald-455 text-emerald-400 font-bold">✔ compiled without errors</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-900 pt-4 relative">
                <span className="text-xs text-zinc-450 uppercase font-mono block mb-2">EXPLICIT HR SALARY COMPILATION</span>
                <div className="relative aspect-[16/8] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850">
                  <img 
                    src={payrollImg} 
                    alt="HR Payroll exception list"
                    className="w-full h-full object-cover object-top brightness-75 group-hover:brightness-90 transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40">
                    <button 
                      onClick={() => setSelectedScreenshot(payrollImg)}
                      className="px-2.5 py-1.5 rounded bg-white text-zinc-950 text-xs font-bold border-none cursor-pointer"
                    >
                      Enlarge Screenshot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE 6: DIRECTOR COMMAND CENTER (THE GRAND FINALE) */}
        <section 
          ref={sectionRefs.director}
          className="snap-start lg:min-h-screen min-h-0 relative z-10 scroll-mt-16 w-full flex flex-col justify-center py-10 lg:py-20 px-4 md:px-16 lg:px-24 xl:px-32 border-b border-zinc-900 max-w-full mx-auto text-left"
        >
          <div className="w-full text-center mb-8 lg:mb-16">
            <span className="text-xs sm:text-sm text-violet-400 font-mono uppercase tracking-[0.25em] bg-violet-950/20 border border-violet-900/40 px-4 py-1.5 rounded-full mb-2 sm:mb-4 inline-block">
              Experience 06 // The Grand Finale
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-6xl text-white tracking-tight leading-none">
              Director Command Center
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto mt-2 lg:mt-4 text-sm sm:text-base lg:text-lg">
              The operational nerve center where Operations, Pathology, Radiology, Smart IMS, and Payroll converge in a consolidated dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* Left controls */}
            <div className="lg:col-span-4 p-4 sm:p-6 rounded-3xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-455 uppercase tracking-widest block mb-4">
                  Dashboard Audits filter
                </span>
                
                <div className="space-y-3 font-mono">
                  {[
                    { id: 'all', label: 'All Operations Metrics' },
                    { id: 'delay', label: '⚠️ High Turnaround Delays' },
                    { id: 'b2b', label: '📊 B2B Referral Volumes' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setDirectorFilter(filter.id)}
                      className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-between border-none ${
                        directorFilter === filter.id 
                          ? 'border-violet-500 bg-violet-950/15 text-white font-semibold shadow-md' 
                          : 'border-zinc-850 bg-zinc-900/10 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span>{filter.label}</span>
                      {directorFilter === filter.id && <Check className="w-3.5 h-3.5 text-violet-400 animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-violet-900/10 bg-violet-950/5 mt-4 lg:mt-8 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-400 leading-relaxed font-light font-sans">
                  The dashboard displays clinic delays and revenues dynamically, preventing administration leaks without needing manager phone calls.
                </p>
              </div>
            </div>

            {/* Right: Massive consolidated dashboard mock */}
            <div className="lg:col-span-8 p-4 sm:p-6 rounded-3xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between min-h-0 lg:min-h-[460px]">
              
              <div>
                <div className="flex justify-between items-center pb-3 lg:pb-4 border-b border-zinc-900 mb-4 lg:mb-6">
                  <span className="text-xs font-mono text-zinc-455 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    DIRECTOR LIVE AUDIT FEED
                  </span>
                  <span className="text-xs font-mono text-zinc-500">FILTER: {directorFilter.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Gauge Card 1 */}
                  <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950 text-left">
                    <span className="text-xs font-mono text-zinc-455 block mb-1">CLINIC TURNAROUND TIME (TAT):</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-2xl font-mono font-extrabold ${directorFilter === 'delay' ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                        {directorFilter === 'delay' ? '56.2 min' : '42.0 min'}
                      </span>
                      <span className={`text-xs font-mono ${directorFilter === 'delay' ? 'text-red-400' : 'text-emerald-455 text-emerald-400'}`}>
                        {directorFilter === 'delay' ? '↑ 36% delay alert' : '★ target met'}
                      </span>
                    </div>
                    
                    {directorFilter === 'delay' && (
                      <div className="mt-3 p-2.5 bg-red-950/15 border border-red-900/30 rounded text-xs text-red-300 font-mono">
                        ⚠️ Report typing queue is currently backing up. Average data entry delay is +14 mins.
                      </div>
                    )}
                  </div>

                  {/* Gauge Card 2 */}
                  <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950 text-left">
                    <span className="text-xs font-mono text-zinc-455 block mb-1">COMMISSION ALLOCATIONS:</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-mono font-extrabold text-white">
                        {directorFilter === 'b2b' ? '3,490.00' : '1,720.00'}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">reconciled B2B</span>
                    </div>
                    
                    {directorFilter === 'b2b' && (
                      <div className="mt-3 p-2.5 bg-violet-950/15 border border-violet-900/30 rounded text-xs text-zinc-450 font-mono">
                        📊 Top referred: Dr. Ravi S. (850 cash credit, 120 biochemical panels).
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* director screen supporting evidence */}
              <div className="mt-4 lg:mt-8 border-t border-zinc-900 pt-4 relative group">
                <span className="text-xs text-zinc-455 uppercase font-mono block mb-2 text-left">PRODUCTION CONSOLIDATED EXECUTIVE KPI PANEL</span>
                <div className="relative aspect-[16/7] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850">
                  <img 
                    src={directorDashboardImg} 
                    alt="Director Dashboard KPIs"
                    className="w-full h-full object-cover object-top brightness-80 group-hover:brightness-95 transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40">
                    <button 
                      onClick={() => setSelectedScreenshot(directorDashboardImg)}
                      className="px-3 py-1.5 rounded bg-white text-zinc-950 text-xs font-bold border-none cursor-pointer"
                    >
                      Enlarge Screenshot
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* FOOTER ACCENT */}
          <footer className="mt-12 lg:mt-28 border-t border-zinc-900 py-12 text-center text-xs text-zinc-550 font-mono w-full">
            <p className="mb-2">Syn<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">OS</span> is developed and engineered by TBZ Labs.</p>
            <p>© 2026 TBZ Labs. All rights reserved.</p>
          </footer>
        </section>

        {/* FLOATING WHATSAPP / EMAIL DISPATCH NOTIFICATION POPUP */}
        <AnimatePresence>
        {showDispatchToast && dispatchInfo && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] max-w-sm text-left flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-widest">
                AUTOMATED DISPATCH TRIGGERED
              </h4>
              <p className="text-xs text-zinc-300 font-bold mt-1">
                Patient: {dispatchInfo.patient}
              </p>
              
              <ul className="mt-2 space-y-1 text-xs text-zinc-450 font-mono">
                {dispatchInfo.methods.map((met, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-350 text-zinc-300">{met}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => setShowDispatchToast(false)}
              className="text-zinc-555 hover:text-white cursor-pointer border-none bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CAUSE & EFFECT PIPELINE DRAWER / MODAL */}
      <AnimatePresence>
        {pipelineOpen && activeNode && nodeDefinitions[activeNode] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-md"
            onClick={() => setPipelineOpen(false)}
          >
            {/* Sliding Drawer Container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-md h-full bg-zinc-950 border-l border-zinc-900 p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
                  <div>
                    <span className="text-xs font-mono text-zinc-450 uppercase tracking-widest">{nodeDefinitions[activeNode].category}</span>
                    <h3 className="font-display font-extrabold text-xl text-white mt-1">
                      {nodeDefinitions[activeNode].title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setPipelineOpen(false)}
                    className="p-1.5 rounded-lg border border-zinc-855 text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Info Text */}
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {nodeDefinitions[activeNode].subtitle} Observes live workflow events triggered by this screen:
                </p>

                {/* Pipeline Steps */}
                <div className="space-y-6 relative pl-5 border-l border-zinc-900">
                  {nodeDefinitions[activeNode].pipeline.map((p, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <span className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-violet-600 flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                      <div className="text-sm font-bold text-white font-mono uppercase tracking-wider">{p.step}</div>
                      <div className="text-xs text-zinc-450 mt-1 leading-relaxed font-light">{p.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 border-t border-zinc-900 pt-6 space-y-4">
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850 group">
                  <img 
                    src={nodeDefinitions[activeNode].screenshot} 
                    alt="Inspected Screen Preview" 
                    className="w-full h-full object-cover object-top brightness-75 group-hover:brightness-95 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => {
                        setSelectedScreenshot(nodeDefinitions[activeNode].screenshot);
                      }}
                      className="px-3 py-1.5 rounded bg-white text-zinc-950 font-bold text-xs uppercase flex items-center gap-1 shadow border-none cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" /> Fullscreen inspect
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-zinc-450 pt-2">
                  <span>SignalR Broadcaster active</span>
                  <span>Event ID: {activeNode.toUpperCase()}_042</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX SCREENSHOT DIALOG MODAL */}
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/95 backdrop-blur-md"
            onClick={() => setSelectedScreenshot(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900/40 hover:bg-zinc-900 transition-all cursor-pointer border-none"
              onClick={() => setSelectedScreenshot(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-6xl w-full max-h-[85vh] aspect-[16/10] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedScreenshot} 
                alt="Enlarged screenshot preview" 
                className="w-full h-full object-contain bg-zinc-950"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-zinc-950/80 border border-zinc-900 rounded-xl text-center text-sm text-zinc-400 font-mono backdrop-blur-sm">
                Press anywhere on the backdrop or the close button above to exit inspection
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
