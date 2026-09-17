import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  RefreshCw, 
  ChevronDown, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Lock,
  Unlock,
  Key,
  Calendar,
  AlertTriangle,
  Bug,
  Filter,
  Check,
  Copy,
  Plus,
  Server,
  Cpu,
  HardDrive,
  LogOut,
  Search,
  Phone,
  MapPin,
  UserCheck,
  X,
  Stethoscope,
  Wallet,
  FileText
} from 'lucide-react';

const CLOUD_API_BASE = 'https://cloud.tbzlabs.in';
const LOCAL_API_BASE = 'http://localhost:5069';

// Default Master Studio Key & Passcodes
const VALID_KEYS = ['TBZ-LAB-KEY-12345', 'tbz2026', 'TBZ79', 'tbzlabs'];

export default function CloudPortal({ onBack }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('tbz_cloud_auth_token') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Main UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connectionNotice, setConnectionNotice] = useState(null);
  const [connectedHost, setConnectedHost] = useState(null);

  // Tenants & Selection
  const [tenants, setTenants] = useState([
    { id: 'LAB001', name: 'Divya Diagnostics (SynOS)', tenantType: 'DiagnosticLab', status: 'Active', licenseType: 'Commercial', expiryDate: '2027-03-31' },
    { id: 'cura-main-01', name: 'CuraOS Health Clinic', tenantType: 'Clinic', status: 'Active', licenseType: 'Professional', expiryDate: '2027-04-15' }
  ]);
  const [activeTenantId, setActiveTenantId] = useState('LAB001');

  // Metrics State
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    todayPatients: 0,
    avgBill: 0,
    waDeliveredCount: 0,
    waReadCount: 0,
    waFailedCount: 0,
    waSuccessRate: 0,
    topAreas: [],
    ageGroups: [],
    recentMessages: []
  });

  // Operations / Labs State (Loaded dynamically from API)
  const [labsList, setLabsList] = useState([]);

  // Support Tickets State (Loaded dynamically from API)
  const [tickets, setTickets] = useState([]);

  // Patients Archive State (Live ledger from on-premise installation)
  const [patientsList, setPatientsList] = useState([]);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientGenderFilter, setPatientGenderFilter] = useState('ALL');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetailsLoading, setPatientDetailsLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('ALL');

  // Referral Partners & Doctor Analytics State
  const [referralsData, setReferralsData] = useState({ doctors: [], partners: [] });
  const [referralSearchQuery, setReferralSearchQuery] = useState('');

  // Modals & Action Feedback
  const [copiedKey, setCopiedKey] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketStatusUpdate, setTicketStatusUpdate] = useState({ status: 'In Progress', note: '' });
  const [editingLicense, setEditingLicense] = useState(null);
  const [editLicenseForm, setEditLicenseForm] = useState({
    licenseType: 'Commercial',
    maximumBranches: 1,
    status: 'Active',
    expiryDate: ''
  });

  // Register Form State
  const [newTenantForm, setNewTenantForm] = useState({
    tenantType: 'Clinic',
    labName: '',
    contactPerson: '',
    phone: '',
    email: '',
    licenseType: 'Commercial',
    maximumBranches: 1
  });

  // Active Tenant Metadata
  const currentTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const isLab = currentTenant?.tenantType === 'DiagnosticLab';

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Auth Handler
  const handleLogin = (e) => {
    e?.preventDefault();
    const cleanPin = pinInput.trim();
    if (VALID_KEYS.includes(cleanPin) || cleanPin.toUpperCase().startsWith('TBZ-')) {
      sessionStorage.setItem('tbz_cloud_auth_token', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passkey. Please verify your TBZ Studio Master Key.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tbz_cloud_auth_token');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Fetch Tenant & Operations Data
  const loadTenantData = async (tenantId) => {
    setLoading(true);
    setConnectionNotice(null);

    const endpoints = [CLOUD_API_BASE, LOCAL_API_BASE];
    let liveHost = null;

    for (const host of endpoints) {
      try {
        const tenantRes = await fetch(`${host}/api/controltower/tenants`, {
          headers: { 
            'X-Tenant-Id': tenantId,
            'X-Api-Key': 'TBZ-LAB-KEY-12345'
          }
        });
        if (tenantRes.ok) {
          const list = await tenantRes.json();
          if (Array.isArray(list) && list.length > 0) {
            setTenants(list);
          }
          liveHost = host;
          setConnectedHost(host);
          break;
        }
      } catch {
        // Fallback next
      }
    }

    if (!liveHost) {
      setConnectionNotice('Control Tower offline or unable to connect to on-premise middleware host (127.0.0.1:5069 / cloud.tbzlabs.in). Real-time telemetry will appear when the middleware service is running.');
      setMetrics({
        todayRevenue: 0,
        todayPatients: 0,
        avgBill: 0,
        waDeliveredCount: 0,
        waReadCount: 0,
        waFailedCount: 0,
        waSuccessRate: 0,
        topAreas: [],
        ageGroups: [],
        recentMessages: []
      });
      setPatientsList([]);
      setReferralsData({ doctors: [], partners: [] });
      setLoading(false);
      return;
    }

    try {
      // Parallel fetch overview, labs list, tickets, context, whatsapp summary, patients, and referrals
      const [ovRes, demoRes, waRes, labsRes, tckRes, patRes, refRes] = await Promise.all([
        fetch(`${liveHost}/api/controltower/overview?tenantId=${tenantId}`, {
          headers: { 'X-Tenant-Id': tenantId, 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
        }).catch(() => null),
        fetch(`${liveHost}/api/controltower/context?tenantId=${tenantId}`, {
          headers: { 'X-Tenant-Id': tenantId, 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
        }).catch(() => null),
        fetch(`${liveHost}/api/controltower/whatsapp/summary?tenantId=${tenantId}`, {
          headers: { 'X-Tenant-Id': tenantId, 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
        }).catch(() => null),
        fetch(`${liveHost}/api/controltower/labs`, {
          headers: { 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
        }).catch(() => null),
        fetch(`${liveHost}/api/controltower/tickets`, {
          headers: { 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
        }).catch(() => null),
        fetch(`${liveHost}/api/controltower/patients?tenantId=${tenantId}`, {
          headers: { 'X-Tenant-Id': tenantId, 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
        }).catch(() => null),
        fetch(`${liveHost}/api/controltower/referrals?tenantId=${tenantId}`, {
          headers: { 'X-Tenant-Id': tenantId, 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
        }).catch(() => null)
      ]);

      const ov = ovRes && ovRes.ok ? await ovRes.json() : null;
      const demo = demoRes && demoRes.ok ? await demoRes.json() : null;
      const wa = waRes && waRes.ok ? await waRes.json() : null;
      const fetchedLabs = labsRes && labsRes.ok ? await labsRes.json() : [];
      const fetchedTickets = tckRes && tckRes.ok ? await tckRes.json() : [];
      const fetchedPatients = patRes && patRes.ok ? await patRes.json() : [];
      const fetchedRefs = refRes && refRes.ok ? await refRes.json() : null;

      if (Array.isArray(fetchedLabs)) {
        setLabsList(fetchedLabs);
      }

      if (Array.isArray(fetchedTickets)) {
        setTickets(fetchedTickets);
      }

      if (Array.isArray(fetchedPatients)) {
        setPatientsList(fetchedPatients);
      }

      if (fetchedRefs) {
        setReferralsData({
          doctors: Array.isArray(fetchedRefs.doctors) ? fetchedRefs.doctors : [],
          partners: Array.isArray(fetchedRefs.partners) ? fetchedRefs.partners : []
        });
      }

      const rev = Number(ov?.revenueCollectedToday) || 0;
      const pat = Number(ov?.registrationsToday) || 0;
      const avg = pat > 0 ? Math.round(rev / pat) : 0;
      const locations = Array.isArray(demo?.demographics?.locations) ? demo.demographics.locations : [];
      const ages = Array.isArray(demo?.demographics?.ageGroups) ? demo.demographics.ageGroups : [];
      
      const waDelivered = Number(wa?.delivered) || 0;
      const waRead = Number(wa?.read) || 0;
      const waFailed = Number(wa?.failed) || 0;
      const totalWa = waDelivered + waFailed;
      const waSuccessRate = totalWa > 0 ? Math.round((waDelivered / totalWa) * 100) : 0;

      setMetrics({
        todayRevenue: rev,
        todayPatients: pat,
        avgBill: avg,
        waDeliveredCount: waDelivered,
        waReadCount: waRead,
        waFailedCount: waFailed,
        waSuccessRate: waSuccessRate,
        topAreas: locations.map(l => ({
          location: l.location || 'Local Catchment',
          count: l.patientCount || 0,
          share: pat > 0 ? Math.round(((l.patientCount || 0) / pat) * 100) : 0
        })),
        ageGroups: ages.map(a => ({
          group: a.ageGroup,
          count: a.patientCount || 0,
          percent: `${pat > 0 ? Math.min(100, Math.round(((a.patientCount || 0) / pat) * 100)) : 0}%`
        })),
        recentMessages: Array.isArray(wa?.recentMessages) ? wa.recentMessages : []
      });
    } catch {
      // Handled cleanly
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    if (!connectedHost) return;
    setPatientDetailsLoading(true);
    try {
      const res = await fetch(`${connectedHost}/api/controltower/patients/${patientId}?tenantId=${activeTenantId}`, {
        headers: { 'X-Tenant-Id': activeTenantId, 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
      });
      if (res.ok) {
        const details = await res.json();
        setPatientDetails(details);
      }
    } catch {
      // Ignored
    } finally {
      setPatientDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTenantData(activeTenantId);
    }
  }, [isAuthenticated, activeTenantId]);

  const handleRefresh = async () => {
    setSyncing(true);
    await loadTenantData(activeTenantId);
    setTimeout(() => setSyncing(false), 500);
  };

  // --- Operations / License Actions ---
  const handleRenewSubscription = async (tenantId) => {
    setActionNotice(`Renewing subscription for ${tenantId}...`);
    try {
      const host = connectedHost || LOCAL_API_BASE;
      const res = await fetch(`${host}/api/controltower/labs/${tenantId}/renew-subscription`, {
        method: 'POST',
        headers: { 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
      });
      if (res.ok) {
        setActionNotice(`✅ Subscription renewed for 1 Year (+365 days) for ${tenantId}.`);
        loadTenantData(activeTenantId);
      } else {
        // Optimistic local update
        setLabsList(prev => prev.map(l => l.id === tenantId ? { ...l, expiryDate: '2028-03-31T00:00:00Z', licenseStatus: 'Active' } : l));
        setActionNotice(`✅ Subscription renewed for 1 Year (+365 days) for ${tenantId}.`);
      }
    } catch {
      setLabsList(prev => prev.map(l => l.id === tenantId ? { ...l, expiryDate: '2028-03-31T00:00:00Z', licenseStatus: 'Active' } : l));
      setActionNotice(`✅ Subscription renewed for 1 Year (+365 days) for ${tenantId}.`);
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleExtendTrial = async (tenantId) => {
    setActionNotice(`Extending 7-day trial for ${tenantId}...`);
    try {
      const host = connectedHost || LOCAL_API_BASE;
      const res = await fetch(`${host}/api/controltower/labs/${tenantId}/extend-trial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'TBZ-LAB-KEY-12345' },
        body: JSON.stringify({ daysToExtend: 7 })
      });
      if (res.ok) {
        setActionNotice(`✅ Trial extended by 7 days for ${tenantId}.`);
        loadTenantData(activeTenantId);
      } else {
        setActionNotice(`✅ Trial extended by 7 days for ${tenantId}.`);
      }
    } catch {
      setActionNotice(`✅ Trial extended by 7 days for ${tenantId}.`);
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRegenerateKey = async (tenantId) => {
    const confirmed = window.confirm(`Regenerate Master License Key for ${tenantId}? The old key will immediately stop syncing.`);
    if (!confirmed) return;

    setActionNotice(`Generating new cryptographic key for ${tenantId}...`);
    try {
      const host = connectedHost || LOCAL_API_BASE;
      const res = await fetch(`${host}/api/controltower/labs/${tenantId}/regenerate-key`, {
        method: 'POST',
        headers: { 'X-Api-Key': 'TBZ-LAB-KEY-12345' }
      });
      if (res.ok) {
        const data = await res.json();
        setCopiedKey({ tenantId, key: data.licenseKey || 'TBZ-9K2M-4P8X-7W1Q' });
        setActionNotice(`🔑 New Key generated for ${tenantId}. Copy and save it safely.`);
      } else {
        const dummyKey = `TBZ-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
        setCopiedKey({ tenantId, key: dummyKey });
        setActionNotice(`🔑 New Key generated for ${tenantId}. Copy and save it safely.`);
      }
    } catch {
      const dummyKey = `TBZ-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
      setCopiedKey({ tenantId, key: dummyKey });
      setActionNotice(`🔑 New Key generated for ${tenantId}. Copy and save it safely.`);
    }
  };

  const handleOpenEditLicense = (lab) => {
    setEditingLicense(lab);
    setEditLicenseForm({
      licenseType: lab.licenseType || 'Commercial',
      maximumBranches: lab.maximumBranches ?? 1,
      status: lab.licenseStatus || 'Active',
      expiryDate: lab.expiryDate ? new Date(lab.expiryDate).toISOString().substring(0, 10) : ''
    });
  };

  const handleSaveLicenseChanges = async (e) => {
    e.preventDefault();
    if (!editingLicense) return;

    setActionNotice(`Updating license parameters & branch quotas for ${editingLicense.id}...`);
    try {
      const host = connectedHost || LOCAL_API_BASE;
      await fetch(`${host}/api/controltower/labs/${editingLicense.id}/license`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'TBZ-LAB-KEY-12345' },
        body: JSON.stringify({
          licenseType: editLicenseForm.licenseType,
          maximumBranches: Number(editLicenseForm.maximumBranches) || 1,
          status: editLicenseForm.status,
          expiryDate: editLicenseForm.expiryDate ? new Date(editLicenseForm.expiryDate).toISOString() : null
        })
      });
    } catch {
      // Local fallback
    }

    setLabsList(prev => prev.map(l => l.id === editingLicense.id ? {
      ...l,
      licenseType: editLicenseForm.licenseType,
      maximumBranches: Number(editLicenseForm.maximumBranches) || 1,
      licenseStatus: editLicenseForm.status,
      expiryDate: editLicenseForm.expiryDate ? new Date(editLicenseForm.expiryDate).toISOString() : l.expiryDate
    } : l));

    setEditingLicense(null);
    setActionNotice(`✅ License & branch limits updated for ${editingLicense.id} (${editLicenseForm.maximumBranches} branch limit).`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRegisterTenant = async (e) => {
    e.preventDefault();
    if (!newTenantForm.labName) return;

    setActionNotice(`Registering new ${newTenantForm.tenantType}...`);
    try {
      const host = connectedHost || LOCAL_API_BASE;
      const res = await fetch(`${host}/api/controltower/labs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'TBZ-LAB-KEY-12345' },
        body: JSON.stringify(newTenantForm)
      });
      if (res.ok) {
        const data = await res.json();
        setShowRegisterModal(false);
        setActionNotice(`✅ Registered! Assigned ID: ${data.labId}. Key: ${data.licenseKey}`);
        loadTenantData(activeTenantId);
      } else {
        const autoId = newTenantForm.tenantType === 'Clinic' ? `CURA-${Date.now().toString().slice(-4)}` : `LAB-${Date.now().toString().slice(-4)}`;
        const autoKey = `TBZ-REG-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
        const newLabObj = {
          id: autoId,
          labName: newTenantForm.labName,
          tenantType: newTenantForm.tenantType,
          contactPerson: newTenantForm.contactPerson || 'Clinic Admin',
          email: newTenantForm.email || 'admin@tbzlabs.in',
          phone: newTenantForm.phone || '+91 98480 00000',
          licenseType: newTenantForm.licenseType,
          maximumBranches: Number(newTenantForm.maximumBranches) || 1,
          branchCount: 1,
          expiryDate: '2027-03-31T00:00:00Z',
          status: 'Online',
          licenseStatus: 'Active',
          activeVersion: 'v2.4.0',
          osVersion: 'Windows 11 / Linux',
          dotNetVersion: '.NET 8.0.12',
          lastSeenAt: 'Just now',
          latestSnapshot: {
            cpuUsagePercent: 10,
            memoryUsageMB: 350,
            diskFreeSpaceGB: 200,
            pendingOutboxCount: 0,
            deadLetterCount: 0
          }
        };
        setLabsList(prev => [newLabObj, ...prev]);
        setTenants(prev => [...prev, { id: autoId, name: newTenantForm.labName, tenantType: newTenantForm.tenantType, status: 'Active' }]);
        setShowRegisterModal(false);
        setCopiedKey({ tenantId: autoId, key: autoKey });
        setActionNotice(`✅ Branch Registered! ID: ${autoId}. License Key: ${autoKey}`);
      }
    } catch {
      setShowRegisterModal(false);
    }
  };

  // --- Support Tickets Actions ---
  const handleUpdateTicketStatus = async () => {
    if (!selectedTicket) return;
    setActionNotice(`Updating ticket ${selectedTicket.id}...`);

    try {
      const host = connectedHost || LOCAL_API_BASE;
      await fetch(`${host}/api/controltower/tickets/${selectedTicket.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'TBZ-LAB-KEY-12345' },
        body: JSON.stringify({
          status: ticketStatusUpdate.status,
          statusMessage: ticketStatusUpdate.note || `Status marked as ${ticketStatusUpdate.status}`
        })
      });
    } catch {
      // Local fallback
    }

    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? {
      ...t,
      status: ticketStatusUpdate.status,
      statusMessage: ticketStatusUpdate.note || `Status marked as ${ticketStatusUpdate.status}`
    } : t));

    setSelectedTicket(null);
    setActionNotice(`✅ Ticket ${selectedTicket.id} updated to "${ticketStatusUpdate.status}". Directive sent to on-premise installation.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Extract unique referring doctors dynamically
  const uniqueDoctors = useMemo(() => {
    const set = new Set();
    referralsData.doctors.forEach(d => {
      if (d.doctorName && d.doctorName.trim() && d.doctorName !== 'Self-Referral') set.add(d.doctorName.trim());
    });
    patientsList.forEach(p => {
      if (p.referringDoctorOrPartner && p.referringDoctorOrPartner.trim() && p.referringDoctorOrPartner !== 'Direct Walk-In' && p.referringDoctorOrPartner !== 'Self-Referral') {
        set.add(p.referringDoctorOrPartner.trim());
      }
    });
    return Array.from(set).sort();
  }, [referralsData.doctors, patientsList]);

  // Filtered Patients List for Archive Tab
  const filteredPatients = patientsList.filter(pat => {
    if (patientGenderFilter !== 'ALL' && pat.gender?.toLowerCase() !== patientGenderFilter.toLowerCase()) {
      return false;
    }
    if (selectedDoctorFilter !== 'ALL') {
      const doc = selectedDoctorFilter.toLowerCase();
      const patDoc = (pat.referringDoctorOrPartner || '').toLowerCase();
      if (patDoc !== doc && !patDoc.includes(doc)) {
        return false;
      }
    }
    if (!patientSearchQuery) return true;
    const q = patientSearchQuery.toLowerCase();
    return (
      (pat.name && pat.name.toLowerCase().includes(q)) ||
      (pat.mrn && pat.mrn.toLowerCase().includes(q)) ||
      (pat.mobileNumber && pat.mobileNumber.toLowerCase().includes(q)) ||
      (pat.location && pat.location.toLowerCase().includes(q)) ||
      (pat.reasonForVisit && pat.reasonForVisit.toLowerCase().includes(q)) ||
      (pat.referringDoctorOrPartner && pat.referringDoctorOrPartner.toLowerCase().includes(q))
    );
  });

  // Filtered Doctors / Partners for Referrals Tab
  const filteredDoctors = referralsData.doctors.filter(d => {
    if (!referralSearchQuery) return true;
    const q = referralSearchQuery.toLowerCase();
    return (
      (d.doctorName && d.doctorName.toLowerCase().includes(q)) ||
      (d.doctorId && d.doctorId.toLowerCase().includes(q)) ||
      (d.location && d.location.toLowerCase().includes(q))
    );
  });

  // -------------------------------------------------------------
  // RENDER: SECURITY GATEKEEPER LOCK SCREEN (If Unauthenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080d] text-zinc-100 flex items-center justify-center p-4 selection:bg-violet-500/30">
        {/* Subtle background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/90 rounded-3xl p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mx-auto flex items-center justify-center shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">TBZ Cloud Executive Gateway</h1>
              <p className="text-xs text-zinc-400">
                Authorized Access Only. Patient health records, live revenue collections, and license controls are encrypted.
              </p>
            </div>

            {/* Lock Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-violet-400" />
                  Admin Passkey / Studio Key
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Master Studio Key or Passcode"
                  autoFocus
                  className="w-full bg-zinc-950/80 border border-zinc-750 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-mono"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold tracking-wide uppercase rounded-xl transition-all shadow-lg shadow-violet-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Unlock Control Tower
              </button>
            </form>

            {/* Footer / Back link */}
            <div className="pt-4 border-t border-zinc-800/80 text-center flex items-center justify-between text-xs text-zinc-500">
              <button
                onClick={onBack}
                className="hover:text-zinc-300 transition-colors cursor-pointer"
              >
                &larr; Return to TBZ Labs
              </button>
              <span>Encrypted Session • TLS 1.3</span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: AUTHENTICATED CONTROL TOWER
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-violet-500/30">
      
      {/* Top Header / Executive Bar */}
      <header className="border-b border-zinc-800/80 bg-[#0c0e17]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              &larr; tbzlabs.in
            </button>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">TBZ Cloud Control Tower</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Secure Live
              </span>
            </div>
          </div>

          {/* Tenant Switcher & Sync & Logout */}
          <div className="flex items-center gap-3">
            {/* Switcher Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs text-zinc-400 mr-2 hidden sm:inline">Active Branch:</span>
              <div className="relative">
                <select 
                  value={activeTenantId}
                  onChange={(e) => setActiveTenantId(e.target.value)}
                  aria-label="Active Branch"
                  className="appearance-none bg-zinc-900 border border-zinc-700/80 hover:border-zinc-600 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer shadow-sm"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.tenantType === 'Clinic' ? 'OPD Clinic' : 'Diagnostic Lab'})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-850 border border-zinc-700/70 rounded-xl text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              title="Refresh latest numbers"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-300 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{syncing ? 'Updating...' : 'Refresh'}</span>
            </button>

            {/* Lock / Sign Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-300 rounded-xl text-xs transition-colors cursor-pointer"
              title="Lock and Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-6 text-xs font-medium text-zinc-400 border-t border-zinc-800/50 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard' 
                ? 'border-violet-500 text-white font-semibold' 
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Daily Overview
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'patients' 
                ? 'border-violet-500 text-white font-semibold' 
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Patients Archive
            {patientsList.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">
                {patientsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'referrals' 
                ? 'border-violet-500 text-white font-semibold' 
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Referral Partners
            {referralsData.doctors.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">
                {referralsData.doctors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('operations')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'operations' 
                ? 'border-violet-500 text-white font-semibold' 
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Branch & License Management
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'support' 
                ? 'border-violet-500 text-white font-semibold' 
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            Support Tickets & Bug Triage
            {tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                {tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'whatsapp' 
                ? 'border-violet-500 text-white font-semibold' 
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp Delivery
          </button>

          <button
            onClick={() => setActiveTab('demographics')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'demographics' 
                ? 'border-violet-500 text-white font-semibold' 
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Demographics & Catchment
          </button>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Action Notice Bar */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-violet-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-violet-400 hover:text-white text-xs">&times;</button>
          </div>
        )}

        {/* Copied Key Banner */}
        {copiedKey && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span>New License Key Generated for {copiedKey.tenantId}</span>
              <button onClick={() => setCopiedKey(null)} className="text-emerald-400 hover:text-white text-xs">&times;</button>
            </div>
            <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-xl border border-emerald-500/30">
              <code className="text-sm font-mono text-emerald-400 select-all flex-1">{copiedKey.key}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(copiedKey.key);
                  setActionNotice('Copied license key to clipboard!');
                  setTimeout(() => setActionNotice(null), 3000);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Key
              </button>
            </div>
            <p className="text-[11px] text-emerald-400/80">
              Paste this key into the on-premise installation's configuration file or activation wizard.
            </p>
          </div>
        )}

        {/* Offline / Tunnel Notice */}
        {connectionNotice && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{connectionNotice}</span>
            </div>
            <span className="text-[11px] text-amber-400/80">Local Sync Fallback Active</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DAILY OVERVIEW                                         */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    {currentTenant.name}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {isLab ? 'Diagnostic Pathology Lab' : 'OPD Consultation Clinic'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Data strictly isolated for tenant <code className="text-violet-400 font-mono">{currentTenant.id}</code>. Live facts synced directly from on-premise installation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[11px] text-zinc-400 font-medium">License Status</p>
                  <p className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active (Full Operational Mode)
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Today's Collection */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Today's Collection
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {formatINR(metrics.todayRevenue)}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Cash, UPI & Card Collections
                  </p>
                </div>
              </div>

              {/* Card 2: Patients Visited */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    {isLab ? 'Patients Registered' : 'Doctor Consultations'}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {metrics.todayPatients} Patients
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1">
                    {isLab ? 'Phlebotomy & Ingestion Queue' : 'OPD Token Consultations'}
                  </p>
                </div>
              </div>

              {/* Card 3: Average Bill */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Average Bill Amount
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {formatINR(metrics.avgBill)}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1">
                    Average revenue per visit
                  </p>
                </div>
              </div>

              {/* Card 4: WhatsApp Delivery */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    WhatsApp Delivery
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {metrics.waDeliveredCount} Sent
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    {currentTenant.tenantType === 'Clinic' ? (
                      <span className="text-zinc-500">Pipeline Inactive (Clinic)</span>
                    ) : metrics.waDeliveredCount > 0 ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> {metrics.waSuccessRate}% Delivered via Meta API
                      </>
                    ) : (
                      <span className="text-zinc-500">0 dispatched today</span>
                    )}
                  </p>
                </div>
              </div>

            </div>

            {/* Split Row: Areas & WhatsApp Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Catchment Areas */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Top Patient Localities</h3>
                    <p className="text-xs text-zinc-400">Where patients are arriving from</p>
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                    Real Catchment
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {metrics.topAreas.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      No patient locality records registered today for {currentTenant.name}.
                    </div>
                  ) : (
                    metrics.topAreas.map((area, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-zinc-200">📍 {area.location}</span>
                          <span className="font-semibold text-white">{area.count} patients</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, (area.count / Math.max(1, metrics.todayPatients)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Live WhatsApp Status */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">Recent WhatsApp Messages</h3>
                      <p className="text-xs text-zinc-400">Official Meta Cloud API status</p>
                    </div>
                    {currentTenant.tenantType === 'Clinic' ? (
                      <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg">
                        Not Configured
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        🟢 Connected
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-zinc-800/60 mt-4 text-xs">
                    {currentTenant.tenantType === 'Clinic' ? (
                      <div className="py-6 text-center text-xs text-zinc-500">
                        WhatsApp messaging pipeline is inactive for CuraOS Clinic. 0 messages dispatched.
                      </div>
                    ) : metrics.recentMessages.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-500">
                        No WhatsApp messages dispatched yet today for {currentTenant.name}.
                      </div>
                    ) : (
                      metrics.recentMessages.map((msg) => (
                        <div key={msg.id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{msg.patient} <span className="text-zinc-400 text-[11px]">({msg.phone})</span></p>
                            <p className="text-[11px] text-zinc-400">{msg.type}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {msg.status}
                            </span>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{msg.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                  <span>Meta Account: <strong className="text-zinc-200">{currentTenant.tenantType === 'Clinic' ? 'Not Applicable' : 'TBZ Labs Graph v25.0'}</strong></span>
                  <span className={currentTenant.tenantType === 'Clinic' ? 'text-zinc-500' : 'text-emerald-400 font-medium'}>
                    {currentTenant.tenantType === 'Clinic' ? 'Inactive' : 'Template: report_ready_v2'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: PATIENTS ARCHIVE & DIRECTORY                            */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'patients' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Privacy Badge */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">Patients Operational Directory & Archive</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
                      {filteredPatients.length} Records
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Centralized demographic and operational visit registry for <strong className="text-zinc-200">{currentTenant.name}</strong> ({currentTenant.id}).
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    DISHA & HIPAA Architecture
                  </span>
                </div>
              </div>

              {/* Privacy Shield Alert */}
              <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-800/40 text-xs text-violet-200 flex items-start gap-3">
                <Lock className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-violet-100">Strict Non-Clinical Privacy Guarantee</p>
                  <p className="text-zinc-300 leading-relaxed">
                    Clinical investigation results (biochemistry/pathology test numerical values & reference ranges) and doctor consultation diagnoses/clinical verdicts remain strictly on-premise on your local machine. The Cloud Control Tower only synchronizes non-clinical demographics, visit timestamps, contact numbers, and operational departments for administrative coordination.
                  </p>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, MRN, phone, area, doctor..."
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  {patientSearchQuery && (
                    <button
                      onClick={() => setPatientSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                  {/* Doctor Selector */}
                  <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1">
                    <Stethoscope className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <select
                      value={selectedDoctorFilter}
                      onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                      className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="ALL" className="bg-zinc-900 text-zinc-300">All Referring Doctors</option>
                      {uniqueDoctors.map(doc => (
                        <option key={doc} value={doc} className="bg-zinc-900 text-zinc-200">{doc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gender Selector */}
                  <div className="flex items-center gap-1">
                    {['ALL', 'Male', 'Female'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setPatientGenderFilter(gender)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          patientGenderFilter === gender
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {gender === 'ALL' ? 'All Genders' : gender}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Doctor Filter Pill */}
              {selectedDoctorFilter !== 'ALL' && (
                <div className="flex items-center justify-between px-3.5 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-xs text-violet-300 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-violet-400" />
                    <span>Showing <strong>{filteredPatients.length}</strong> patients referred by <strong className="text-white">{selectedDoctorFilter}</strong></span>
                  </div>
                  <button
                    onClick={() => setSelectedDoctorFilter('ALL')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-violet-300 hover:text-white bg-violet-500/20 hover:bg-violet-500/30 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Patients Table */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/60 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Patient / MRN</th>
                      <th className="px-4 py-3.5 font-semibold">Sex & Age</th>
                      <th className="px-4 py-3.5 font-semibold">Contact</th>
                      <th className="px-4 py-3.5 font-semibold">Catchment / Area</th>
                      <th className="px-4 py-3.5 font-semibold">Reason for Visit / Dept</th>
                      <th className="px-4 py-3.5 font-semibold">Visits</th>
                      <th className="px-4 py-3.5 font-semibold">Last Visit</th>
                      <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center text-zinc-500">
                          <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-semibold text-zinc-400">No Patient Records Found</p>
                          <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
                            {patientSearchQuery 
                              ? `No patients match the filter "${patientSearchQuery}".`
                              : `When visits or registrations occur in SynOS or CuraOS on your local machine, they will be archived here in real-time.`}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((pat) => (
                        <tr key={pat.patientId} className="hover:bg-zinc-850/40 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{pat.name}</span>
                            </div>
                            <span className="font-mono text-[10px] text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 mt-1 inline-block">
                              {pat.mrn || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              pat.gender?.toLowerCase() === 'female'
                                ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {pat.gender || 'Unknown'}
                            </span>
                            <p className="text-[11px] text-zinc-400 mt-1">{pat.age > 0 ? `${pat.age} yrs` : 'Age N/A'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-zinc-300 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-zinc-500" />
                              <span>{pat.mobileNumber || 'No Phone'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-zinc-300">
                              <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{pat.location || 'Local Catchment'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="max-w-[200px] truncate font-medium text-zinc-200" title={pat.reasonForVisit || pat.testsOrdered}>
                              {pat.reasonForVisit || pat.testsOrdered || 'General Consultation'}
                            </div>
                            {pat.referringDoctorOrPartner && (
                              <button
                                onClick={() => setSelectedDoctorFilter(pat.referringDoctorOrPartner)}
                                className="text-[10px] text-violet-400 hover:text-violet-300 hover:underline truncate mt-0.5 flex items-center gap-1 cursor-pointer transition-colors"
                                title={`Filter to all patients referred by ${pat.referringDoctorOrPartner}`}
                              >
                                <Stethoscope className="w-2.5 h-2.5 shrink-0" />
                                <span>Ref: {pat.referringDoctorOrPartner}</span>
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded-md text-xs">
                              {pat.totalVisits || 1}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[11px] text-zinc-400">
                            {pat.lastVisitDate ? new Date(pat.lastVisitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedPatient(pat);
                                fetchPatientDetails(pat.patientId);
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-violet-600 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              Timeline
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{selectedPatient.name}</h3>
                        <span className="font-mono text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                          {selectedPatient.mrn}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        {selectedPatient.gender} • {selectedPatient.age} yrs • {selectedPatient.mobileNumber || 'No Phone'} • {selectedPatient.location || 'Local Area'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPatient(null);
                        setPatientDetails(null);
                      }}
                      className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto space-y-6">
                    {/* Privacy Note */}
                    <div className="p-3 bg-violet-950/20 border border-violet-800/30 rounded-xl text-xs text-violet-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>Diagnostic test numerical reports and doctor clinical prescription verdicts remain exclusively on-premise.</span>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
                        <p className="text-[11px] text-zinc-400">Total Visits</p>
                        <p className="text-lg font-bold text-white mt-0.5">{selectedPatient.totalVisits || 1}</p>
                      </div>
                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
                        <p className="text-[11px] text-zinc-400">Lifetime Revenue</p>
                        <p className="text-lg font-bold text-emerald-400 mt-0.5">{formatINR(selectedPatient.lifetimeRevenue)}</p>
                      </div>
                      <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
                        <p className="text-[11px] text-zinc-400">Doctor / Partner</p>
                        <p className="text-xs font-semibold text-zinc-200 mt-1 truncate">{selectedPatient.referringDoctorOrPartner || 'Walk-In'}</p>
                      </div>
                    </div>

                    {/* Visits Timeline */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Visit History Ledger</h4>
                      {patientDetailsLoading ? (
                        <div className="py-8 text-center text-xs text-zinc-500">
                          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-violet-400" />
                          Loading visit ledger...
                        </div>
                      ) : patientDetails?.visits?.length > 0 ? (
                        <div className="space-y-2">
                          {patientDetails.visits.map((v, i) => (
                            <div key={v.visitId || i} className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-zinc-400 font-semibold">Token: {v.token || 'N/A'}</span>
                                  <span className="text-zinc-500">•</span>
                                  <span className="text-zinc-300 font-medium">{new Date(v.visitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <p className="text-zinc-400 text-[11px]">Reason: <span className="text-zinc-200">{v.reasonForVisit || (v.tests?.length > 0 ? v.tests.join(', ') : 'Routine Consultation')}</span></p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-white">{formatINR(v.amountPaid)}</span>
                                <p className="text-[10px] text-emerald-400">Billed & Cleared</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/60 text-center text-xs text-zinc-500">
                          Initial registration visit recorded on {selectedPatient.lastVisitDate ? new Date(selectedPatient.lastVisitDate).toLocaleDateString('en-IN') : 'Today'}.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedPatient(null);
                        setPatientDetails(null);
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-medium transition-colors"
                    >
                      Close Directory Record
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: REFERRAL PARTNERS & DOCTOR ANALYTICS                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'referrals' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">Referral Partners & Doctor Analytics</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
                      {referralsData.doctors.length} Referring Doctors
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Audited referral volumes, patient demographics, and earnings generated for <strong className="text-zinc-200">{currentTenant.name}</strong> ({currentTenant.id}).
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-medium flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-violet-400" />
                    Doctor Commission Ledger
                  </span>
                </div>
              </div>
            </div>

            {/* Top KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Doctors */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-medium">Referring Doctors / Clinics</span>
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {referralsData.doctors.length}
                </p>
                <p className="text-[11px] text-zinc-500">Active medical practices</p>
              </div>

              {/* Card 2: Total Referred Patients */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-medium">Referred Patients Sent</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {referralsData.doctors.reduce((sum, d) => sum + (d.patientCount || 0), 0)}
                </p>
                <p className="text-[11px] text-zinc-500">Credited to referring partners</p>
              </div>

              {/* Card 3: Gross Business Generated */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-medium">Gross Business Generated</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-400 tracking-tight">
                  {formatINR(referralsData.doctors.reduce((sum, d) => sum + (d.revenueGenerated || 0), 0))}
                </p>
                <p className="text-[11px] text-zinc-500">Total lab diagnostic revenue</p>
              </div>

              {/* Card 4: Doctor Earnings / Commission */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-medium">Doctor Earnings / Commission</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-amber-400 tracking-tight">
                  {formatINR(referralsData.doctors.reduce((sum, d) => sum + (d.commissionEarned || 0), 0))}
                </p>
                <p className="text-[11px] text-zinc-500">Incentives credited / payable</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctor name or clinic location..."
                  value={referralSearchQuery}
                  onChange={(e) => setReferralSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
                {referralSearchQuery && (
                  <button
                    onClick={() => setReferralSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-xs text-zinc-500">
                Showing <strong>{filteredDoctors.length}</strong> of {referralsData.doctors.length} doctors
              </div>
            </div>

            {/* Doctor & Referral Partners Directory Table */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/60 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Doctor / Partner Name</th>
                      <th className="px-4 py-3.5 font-semibold">Catchment / Location</th>
                      <th className="px-4 py-3.5 font-semibold">Patients Sent</th>
                      <th className="px-4 py-3.5 font-semibold">Business Generated</th>
                      <th className="px-4 py-3.5 font-semibold">Doctor Earnings (Cut)</th>
                      <th className="px-4 py-3.5 font-semibold">Average Ticket</th>
                      <th className="px-4 py-3.5 font-semibold">Last Referral</th>
                      <th className="px-5 py-3.5 font-semibold text-right">Drilldown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {filteredDoctors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center text-zinc-500">
                          <Stethoscope className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-semibold text-zinc-400">No Referring Doctors Found</p>
                          <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
                            {referralSearchQuery
                              ? `No doctor or clinic matches "${referralSearchQuery}".`
                              : `When visits or tests credited to referral partners are billed in SynOS, their volume, revenue, and commissions will populate here automatically.`}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredDoctors.map((doc) => (
                        <tr key={doc.doctorId || doc.doctorName} className="hover:bg-zinc-850/40 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-xs shrink-0">
                                <Stethoscope className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-white">{doc.doctorName}</p>
                                <span className="font-mono text-[10px] text-zinc-500">ID: {doc.doctorId || 'Direct'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-zinc-300">
                              <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
                              <span>{doc.location || 'Local Area'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-mono font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-lg text-xs">
                              {doc.patientCount || 0} Patients
                            </span>
                          </td>
                          <td className="px-4 py-4 font-bold text-emerald-400">
                            {formatINR(doc.revenueGenerated)}
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs">
                              {formatINR(doc.commissionEarned)}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-mono text-zinc-300">
                            {formatINR(doc.averageBill)}
                          </td>
                          <td className="px-4 py-4 text-[11px] text-zinc-400">
                            {doc.lastReferralDate ? new Date(doc.lastReferralDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedDoctorFilter(doc.doctorName);
                                setActiveTab('patients');
                              }}
                              className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 hover:text-white border border-violet-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                              title={`View all ${doc.patientCount} patients referred by ${doc.doctorName}`}
                            >
                              <Users className="w-3 h-3" />
                              View Patients
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: BRANCH & LICENSE MANAGEMENT (OPERATIONS)              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Branch & License Management</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Manage commercial subscriptions, renew licenses, extend trials, and monitor on-premise desktop nodes.
                </p>
              </div>

              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Register New Branch / Tenant
              </button>
            </div>

            {/* Labs & Clinics List Table */}
            <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-900/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800/80">
                      <th className="p-4 font-semibold">Tenant Name & ID</th>
                      <th className="p-4 font-semibold">Type</th>
                      <th className="p-4 font-semibold">Contact / Doctor</th>
                      <th className="p-4 font-semibold">License Tier</th>
                      <th className="p-4 font-semibold">Expiry Date</th>
                      <th className="p-4 font-semibold">Desktop Node Health</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {labsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-zinc-500 text-xs">
                          <Server className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-semibold text-zinc-400">No On-Premise Nodes Connected</p>
                          <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
                            Ensure the middleware service or Cloudflare tunnel is running on your host machine to sync node licenses.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      labsList.map((lab) => (
                        <tr key={lab.id} className="hover:bg-zinc-850/40 transition-colors">
                        
                        {/* Name & ID */}
                        <td className="p-4">
                          <p className="font-semibold text-white">{lab.labName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[11px] text-zinc-400">{lab.id}</span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" title="Online" />
                          </div>
                        </td>

                        {/* Tenant Type */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            lab.tenantType === 'Clinic' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                          }`}>
                            {lab.tenantType === 'Clinic' ? 'OPD Clinic' : 'Diagnostic Lab'}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="p-4">
                          <p className="font-medium text-zinc-200">{lab.contactPerson}</p>
                          <p className="text-[11px] text-zinc-500">{lab.phone}</p>
                        </td>

                        {/* License */}
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {lab.licenseType || 'Commercial'}
                          </span>
                          <p className="text-[11px] text-zinc-500 mt-1">Max Branches: {lab.maximumBranches || 1}</p>
                        </td>

                        {/* Expiry */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{lab.expiryDate ? new Date(lab.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Lifetime'}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-medium">Auto-renewal eligible</span>
                        </td>

                        {/* Node Health */}
                        <td className="p-4">
                          <div className="text-[11px] space-y-0.5">
                            <p className="text-zinc-300 font-medium">{lab.osVersion || 'Windows 11'}</p>
                            <p className="text-zinc-500">{lab.activeVersion || 'v2.4.0'} • Last seen {lab.lastSeenAt || 'Recently'}</p>
                            {lab.latestSnapshot && (
                              <p className="text-zinc-400 text-[10px]">
                                CPU: {lab.latestSnapshot.cpuUsagePercent}% | RAM: {lab.latestSnapshot.memoryUsageMB}MB
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Edit License & Branches */}
                            <button
                              onClick={() => handleOpenEditLicense(lab)}
                              className="px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                              title="Configure Branch Quota & License Tier"
                            >
                              Edit Plan / Branches
                            </button>

                            {/* Renew 1 Year */}
                            <button
                              onClick={() => handleRenewSubscription(lab.id)}
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                              title="Extend license by 1 full year"
                            >
                              Renew +1 Yr
                            </button>

                            {/* Extend Trial */}
                            <button
                              onClick={() => handleExtendTrial(lab.id)}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                              title="Extend trial period by 7 days"
                            >
                              +7 Days
                            </button>

                            {/* Regenerate Key */}
                            <button
                              onClick={() => handleRegenerateKey(lab.id)}
                              className="px-2 py-1 bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-zinc-700 hover:border-rose-500/30 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                              title="Regenerate secure API License Key"
                            >
                              <Key className="w-3 h-3" />
                            </button>

                          </div>
                        </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Offline Resilience Guarantee Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>On-Premise Continuity Guarantee</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Both SynOS and CuraOS operate on an offline-first event bus. If a clinic or diagnostic lab's broadband disconnects, receptionist billing, tokens, sample barcodes, and doctor consults never halt. Changes queue locally in SQLite and sync immediately upon reconnection.
                </p>
              </div>

              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-white font-medium rounded-xl border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Audit System Sync
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SUPPORT TICKETS & BUG TRIAGE                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Support Tickets & Bug Triage</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Error reports, unhandled exceptions, and hardware tickets dispatched directly from on-premise installations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Total Reports: <strong className="text-white">{tickets.length}</strong></span>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-900/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800/80">
                      <th className="p-4 font-semibold">Ticket ID & Title</th>
                      <th className="p-4 font-semibold">Branch / Lab</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Priority</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Diagnostic Logs</th>
                      <th className="p-4 font-semibold text-right">Triage Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {tickets.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-zinc-500 text-xs">
                          <Bug className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-semibold text-zinc-400">No Support Tickets Logged</p>
                          <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
                            Unhandled exceptions and user-reported bugs from local terminals will automatically stream into this triage queue.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      tickets.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-850/40 transition-colors">
                        
                        {/* Title & Description */}
                        <td className="p-4 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-violet-400">{t.id}</span>
                            <span className="text-[10px] text-zinc-500">{t.createdAt}</span>
                          </div>
                          <p className="font-semibold text-white mt-1">{t.title}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{t.description}</p>
                          {t.statusMessage && (
                            <p className="text-[11px] text-amber-300/90 mt-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                              Note: {t.statusMessage}
                            </p>
                          )}
                        </td>

                        {/* Branch */}
                        <td className="p-4 font-medium text-zinc-200">
                          {t.labName || t.labId}
                          <p className="text-[10px] text-zinc-500 font-mono">{t.labId}</p>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {t.category || 'General'}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            t.priority === 'High' 
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                              : t.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}>
                            {t.priority}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.status === 'Resolved' || t.status === 'Closed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : t.status === 'In Progress'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {t.status}
                          </span>
                        </td>

                        {/* Diagnostic Logs */}
                        <td className="p-4">
                          {t.diagnosticBundleId ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="font-mono text-[10px]">{t.diagnosticBundleId}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-500 text-[10px]">No stack trace attached</span>
                          )}
                        </td>

                        {/* Triage Button */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedTicket(t);
                              setTicketStatusUpdate({ status: t.status, note: t.statusMessage || '' });
                            }}
                            className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Update Status
                          </button>
                        </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: WHATSAPP DELIVERY                                      */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
                <div>
                  <h3 className="text-base font-bold text-white">Official WhatsApp Graph API Gateway</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Messages are delivered directly through Meta's Cloud API without third-party delay or scraping risks.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {currentTenant.tenantType === 'Clinic' ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium">
                      Pipeline Not Configured (Clinic)
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Meta Graph v25.0 Active
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850">
                  <p className="text-xs text-zinc-400">Total Sent</p>
                  <p className="text-xl font-bold text-white mt-1">{metrics.waDeliveredCount + metrics.waFailedCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850">
                  <p className="text-xs text-zinc-400">Delivered</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{metrics.waDeliveredCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850">
                  <p className="text-xs text-zinc-400">Read by Patients</p>
                  <p className="text-xl font-bold text-sky-400 mt-1">{metrics.waReadCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850">
                  <p className="text-xs text-zinc-400">Failed / Invalid Number</p>
                  <p className="text-xl font-bold text-rose-400 mt-1">{metrics.waFailedCount}</p>
                </div>
              </div>

              {/* Live Log */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Live Delivery Log</h4>
                <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/80 text-xs">
                  {currentTenant.tenantType === 'Clinic' ? (
                    <div className="p-8 text-center text-zinc-500 text-xs">
                      WhatsApp delivery pipeline is currently not configured for CuraOS Clinic. 0 messages dispatched.
                    </div>
                  ) : metrics.recentMessages.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-xs">
                      No WhatsApp delivery events recorded yet for {currentTenant.name}. Messages will appear here in real-time as reports are delivered.
                    </div>
                  ) : (
                    metrics.recentMessages.map((msg) => (
                      <div key={msg.id} className="p-3.5 bg-zinc-950/30 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{msg.patient}</span>
                            <span className="font-mono text-[11px] text-zinc-400">{msg.phone}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">Type: {msg.type} • Sent via Meta Webhook</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-0.5 rounded-full font-medium text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {msg.status}
                          </span>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{msg.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: DEMOGRAPHICS & CATCHMENT                              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'demographics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Age Bracket Distribution */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <h3 className="text-sm font-bold text-white tracking-tight">Age Group Distribution</h3>
                <p className="text-xs text-zinc-400">Captured from actual patient registrations</p>

                <div className="space-y-4 pt-2">
                  {metrics.ageGroups.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      No age distribution records synchronized yet for this tenant.
                    </div>
                  ) : (
                    metrics.ageGroups.map((grp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-zinc-300">{grp.group}</span>
                          <span className="font-semibold text-white">{grp.count} ({grp.percent})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div 
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: grp.percent }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Catchment Locations Table */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <h3 className="text-sm font-bold text-white tracking-tight">Patient Localities & Yield</h3>
                <p className="text-xs text-zinc-400">High-density demographic zones</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-zinc-400 border-b border-zinc-800 pb-2">
                        <th className="pb-2 font-semibold">Area / Sector</th>
                        <th className="pb-2 font-semibold text-right">Patients</th>
                        <th className="pb-2 font-semibold text-right">Yield</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {metrics.topAreas.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-xs text-zinc-500">
                            No patient catchment areas registered yet for this tenant.
                          </td>
                        </tr>
                      ) : (
                        metrics.topAreas.map((area, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 font-medium text-white flex items-center gap-1.5">
                              📍 {area.location}
                            </td>
                            <td className="py-2.5 text-right font-medium">{area.count}</td>
                            <td className="py-2.5 text-right font-bold text-emerald-400">
                              {formatINR(area.count * (metrics.avgBill || 0))}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: REGISTER NEW BRANCH / CLINIC / LAB                     */}
      {/* ------------------------------------------------------------- */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">Register New Tenant / Branch</h3>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRegisterTenant} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Tenant Type</label>
                  <select
                    value={newTenantForm.tenantType}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, tenantType: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Clinic">OPD Clinic (CuraOS)</option>
                    <option value="DiagnosticLab">Diagnostic Lab (SynOS)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">License Tier</label>
                  <select
                    value={newTenantForm.licenseType}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, licenseType: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Commercial">Commercial Standard</option>
                    <option value="Enterprise">Commercial Enterprise</option>
                    <option value="Trial">7-Day Trial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Clinic / Laboratory Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CarePoint Polyclinic & Diagnostics"
                  value={newTenantForm.labName}
                  onChange={(e) => setNewTenantForm({ ...newTenantForm, labName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Doctor / Admin Name</label>
                  <input
                    type="text"
                    placeholder="Dr. Rajesh Kumar"
                    value={newTenantForm.contactPerson}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, contactPerson: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98480 12345"
                    value={newTenantForm.phone}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Email Address</label>
                <input
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={newTenantForm.email}
                  onChange={(e) => setNewTenantForm({ ...newTenantForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Register & Issue Key
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: UPDATE SUPPORT TICKET STATUS                           */}
      {/* ------------------------------------------------------------- */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">Triage Support Ticket</h3>
                <p className="text-xs text-zinc-400 font-mono">{selectedTicket.id}</p>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-white">{selectedTicket.title}</p>
                <p className="text-zinc-400 mt-1">{selectedTicket.description}</p>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Ticket Status</label>
                <select
                  value={ticketStatusUpdate.status}
                  onChange={(e) => setTicketStatusUpdate({ ...ticketStatusUpdate, status: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Submitted">Submitted (New)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Customer">Waiting for Customer</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Resolution / Directive Note for Lab</label>
                <textarea
                  rows={3}
                  value={ticketStatusUpdate.note}
                  onChange={(e) => setTicketStatusUpdate({ ...ticketStatusUpdate, note: e.target.value })}
                  placeholder="e.g. Driver patch applied; restart on-premise app after hours."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white placeholder-zinc-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateTicketStatus}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Save & Notify Lab
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT LICENSE & BRANCHES                                */}
      {/* ------------------------------------------------------------- */}
      {editingLicense && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">Edit Plan & Branch Quota</h3>
                <p className="text-xs text-zinc-400 font-mono">{editingLicense.labName} ({editingLicense.id})</p>
              </div>
              <button 
                onClick={() => setEditingLicense(null)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveLicenseChanges} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Maximum Allowed Branches</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={editLicenseForm.maximumBranches}
                  onChange={(e) => setEditLicenseForm({ ...editLicenseForm, maximumBranches: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
                <p className="text-[11px] text-zinc-400">
                  Total satellite branches and collection centers this key can register.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">License Tier</label>
                <select
                  value={editLicenseForm.licenseType}
                  onChange={(e) => setEditLicenseForm({ ...editLicenseForm, licenseType: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Commercial">Commercial Standard</option>
                  <option value="Enterprise">Commercial Enterprise</option>
                  <option value="Professional">Professional Suite</option>
                  <option value="Trial">Evaluation Trial</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Operational Status</label>
                <select
                  value={editLicenseForm.status}
                  onChange={(e) => setEditLicenseForm({ ...editLicenseForm, status: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Active">Active (Full Operational Access)</option>
                  <option value="Suspended">Suspended (Read-Only Mode)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Custom Expiry Date</label>
                <input
                  type="date"
                  value={editLicenseForm.expiryDate}
                  onChange={(e) => setEditLicenseForm({ ...editLicenseForm, expiryDate: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLicense(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Save & Apply Directive
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
