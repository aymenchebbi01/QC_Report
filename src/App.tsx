import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import {
  ClipboardCheck,
  Plus,
  FileText,
  Download,
  Trash2,
  Edit3,
  ChevronRight,
  Search,
  LayoutDashboard,
  Settings,
  LogOut,
  Eye,
  AlertTriangle,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportData, SavedReport, ArticleInspection, Reclamation, ReworkEntry } from './types';
import { api } from './services/api';
import { ImageUpload } from './components/ImageUpload';
import { ReportPreview } from './components/ReportPreview';
import { QualityReclamation } from './components/QualityReclamation';
import { Rework } from './components/Rework';
import { generatePDF } from './utils/pdfGenerator';
import { cn } from './utils/cn';

const INITIAL_DATA: ReportData = {
  reportNumber: '',
  articleNumber: '',
  articleDescription: '',
  reservationNumber: '',
  orderNumber: '',
  supplier: '',
  deliveryDate: '',
  productionLot: '',
  deliveryQuantity: '',
  examiner: '',
  testDate: new Date().toISOString().split('T')[0],
  packagingVisual: 'OK',
  completeness: 'OK',
  assemblyInstructions: 'Yes',
  packagingSpecifications: 'Yes',
  articles: Array.from({ length: 1 }, (_, i) => ({
    articleNumber: (i + 1).toString(),
    weightTest: 'OK',
    functionalTest: 'OK',
    notes: '',
  })),
  errorDescription: '',
  missingPartsDescription: '',
  inspectorComments: '',
  batchQuantity: '',
  sampleQuantity: '',
  aqlValue: '1.5',
  permittedErrors: '',
  notPermittedErrors: '',
  totalErrors: '',
  aqlPassed: 'Yes',
  aqlTesterName: '',
  aqlComments: '',
  finalPassed: 'Yes',
  finalComments: '',
  finalInspectorName: '',
  signature: '',
  finalDate: new Date().toISOString().split('T')[0],
  images: [],
};

export default function App() {
  const [view, setView] = useState<'dashboard' | 'reports' | 'form' | 'preview' | 'reclamation' | 'rework'>('dashboard');
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [formData, setFormData] = useState<ReportData>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [reworks, setReworks] = useState<ReworkEntry[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [reps, recs, rews] = await Promise.all([
        api.getReports(),
        api.getReclamations(),
        api.getReworks()
      ]);
      setReports(reps);
      setReclamations(recs);
      setReworks(rews);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadReports = async () => {
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.updateReport(editingId, formData);
      } else {
        await api.createReport(formData.reportNumber || `REP-${Date.now()}`, formData);
      }
      loadReports();
      setView('reports');
      setFormData(INITIAL_DATA);
      setEditingId(null);
    } catch (error) {
      alert("Error saving report. Ensure report number is unique.");
    }
  };

  const handleEdit = (report: SavedReport) => {
    setFormData(report.data);
    setEditingId(report.id);
    setView('form');
  };

  const handleGenerateReportFromRework = (rework: ReworkEntry) => {
    setFormData({
      ...INITIAL_DATA,
      reportNumber: `REP-${rework.vrRef || Date.now()}`,
      testDate: new Date().toISOString().split('T')[0],
      articleNumber: rework.partNo,
      articleDescription: rework.description,
      batchQuantity: parseInt(rework.quantity) || 0,
      supplier: rework.prPu,
    });
    setEditingId(null);
    setView('form');
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this report?")) {
      await api.deleteReport(id);
      loadReports();
    }
  };

  const filteredReports = reports.filter(r =>
    r.report_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.data.articleDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    "General Info",
    "Packaging",
    "Articles",
    "Defects & AQL",
    "Images",
    "Final Result"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 flex items-center justify-center border-b border-slate-800">
          <img src={logo} alt="Thermoplastics Tunisia" className="h-12 w-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              view === 'dashboard' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "hover:bg-slate-800 text-slate-400"
            )}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </button>
          <button
            onClick={() => setView('reports')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              view === 'reports' || view === 'form' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "hover:bg-slate-800 text-slate-400"
            )}
          >
            <FileText size={20} />
            <span className="font-semibold">Reports</span>
          </button>
          <button
            onClick={() => setView('reclamation')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              view === 'reclamation' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "hover:bg-slate-800 text-slate-400"
            )}
          >
            <AlertTriangle size={20} />
            <span className="font-semibold">Réclamation</span>
          </button>
          <button
            onClick={() => setView('rework')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              view === 'rework' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 text-slate-400"
            )}
          >
            <Wrench size={20} />
            <span className="font-semibold">Rework</span>
          </button>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (() => {
            const totalRec = reclamations.length;
            const completedRec = reclamations.filter(r => r.reworkId).length;
            const openRec = totalRec - completedRec;
            const totalRework = reworks.length;
            const approvedCount = reworks.filter(r => r.approved === 'Yes').length;
            const notApprovedCount = reworks.filter(r => r.approved === 'No').length;
            const decisionCounts = reworks.reduce<Record<string, number>>((acc, r) => {
              const d = r.decision || 'Non défini'; acc[d] = (acc[d] || 0) + 1; return acc;
            }, {});
            const DCOLORS: Record<string, string> = { Retouche: '#3b82f6', Rebut: '#ef4444', 'Accepté': '#10b981', 'Retour fournisseur': '#f59e0b', 'Non défini': '#cbd5e1' };
            const DTEXTCLS: Record<string, string> = { Retouche: 'text-blue-600', Rebut: 'text-red-600', 'Accepté': 'text-emerald-600', 'Retour fournisseur': 'text-amber-600', 'Non défini': 'text-slate-400' };
            const DBGCLS: Record<string, string> = { Retouche: 'bg-blue-500', Rebut: 'bg-red-500', 'Accepté': 'bg-emerald-500', 'Retour fournisseur': 'bg-amber-500', 'Non défini': 'bg-slate-300' };
            // Donut chart segments
            const donutR = 54; const donutC = 2 * Math.PI * donutR;
            const decisionEntries = (Object.entries(decisionCounts) as [string, number][]);
            let strokeOffset = donutC * 0.25; // start at top
            const donutSegments = decisionEntries.map(([d, cnt]) => {
              const frac = cnt / Math.max(totalRework, 1);
              const dash = frac * donutC;
              const seg = { d, cnt, dash, offset: strokeOffset, color: DCOLORS[d] ?? '#94a3b8' };
              strokeOffset -= dash; return seg;
            });
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <header>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Dashboard</h1>
                  <p className="text-slate-500 font-medium">Overview — Reclamations &amp; Rework</p>
                </header>

                {/* KPI cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Reclamations', value: totalRec, sub: 'Total recorded', color: 'border-orange-400', textColor: 'text-orange-500', onClick: () => setView('reclamation') },
                    { label: 'Pending', value: openRec, sub: 'Without rework', color: 'border-amber-400', textColor: 'text-amber-500', onClick: () => setView('reclamation') },
                    { label: 'Completed', value: completedRec, sub: 'With rework', color: 'border-emerald-400', textColor: 'text-emerald-500', onClick: () => setView('reclamation') },
                    { label: 'Reworks', value: totalRework, sub: 'Total recorded', color: 'border-blue-400', textColor: 'text-blue-500', onClick: () => setView('rework') },
                  ].map(card => (
                    <button key={card.label} onClick={card.onClick}
                      className={`bg-white rounded-2xl border-l-4 ${card.color} border border-slate-200 shadow-sm p-5 text-left hover:shadow-md transition-all`}>
                      <div className={`text-4xl font-black ${card.textColor}`}>{card.value}</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{card.label}</div>
                      <div className="text-xs text-slate-400">{card.sub}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Donut chart – decisions */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Decisions</h2>
                    {totalRework === 0 ? (
                      <div className="h-40 flex items-center justify-center text-slate-300 text-sm italic">No data</div>
                    ) : (
                      <div className="flex items-center gap-6">
                        <svg width="130" height="130" viewBox="0 0 130 130">
                          <circle cx="65" cy="65" r={donutR} fill="none" stroke="#f1f5f9" strokeWidth="16" />
                          {donutSegments.map(seg => (
                            <circle key={seg.d} cx="65" cy="65" r={donutR} fill="none"
                              stroke={seg.color} strokeWidth="16"
                              strokeDasharray={`${seg.dash} ${donutC - seg.dash}`}
                              strokeDashoffset={seg.offset}
                              style={{ transition: 'all 0.6s ease' }} />
                          ))}
                          <text x="65" y="60" textAnchor="middle" className="text-xs" fontSize="22" fontWeight="900" fill="#0f172a">{totalRework}</text>
                          <text x="65" y="76" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>reworks</text>
                        </svg>
                        <div className="space-y-2 flex-1">
                          {decisionEntries.map(([d, cnt]) => (
                            <div key={d} className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DCOLORS[d] ?? '#94a3b8' }} />
                              <span className="text-xs font-bold text-slate-600 flex-1">{d}</span>
                              <span className="text-xs font-black text-slate-400">{cnt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bar chart – reclamation completion + approval rate */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Tracking</h2>
                    <div className="space-y-5">
                      {/* Reclamation completion */}
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Completion rate</span>
                          <span>{totalRec ? Math.round((completedRec / totalRec) * 100) : 0}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${totalRec ? (completedRec / totalRec) * 100 : 0}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{completedRec} / {totalRec} reclamations with rework</div>
                      </div>
                      {/* Approved rate */}
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Taux approuvé</span>
                          <span>{totalRework ? Math.round((approvedCount / totalRework) * 100) : 0}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${totalRework ? (approvedCount / totalRework) * 100 : 0}%` }} />
                        </div>
                        <div className="flex gap-4 text-[10px] text-slate-400 mt-1">
                          <span className="text-emerald-600 font-bold">✓ Yes: {approvedCount}</span>
                          <span className="text-red-500 font-bold">✗ No: {notApprovedCount}</span>
                          <span>Not set: {totalRework - approvedCount - notApprovedCount}</span>
                        </div>
                      </div>
                      {/* Decision breakdown bars */}
                      {decisionEntries.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">By decision</p>
                          {decisionEntries.map(([d, cnt]) => (
                            <div key={d} className="flex items-center gap-2">
                              <span className={`w-32 text-[11px] font-bold shrink-0 ${DTEXTCLS[d] ?? 'text-slate-500'}`}>{d}</span>
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${DBGCLS[d] ?? 'bg-slate-400'}`} style={{ width: `${(cnt / totalRework) * 100}%` }} />
                              </div>
                              <span className="text-[11px] font-black text-slate-400 w-5 text-right">{cnt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent reworks table */}
                {reworks.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent reworks</h2>
                      <button onClick={() => setView('rework')} className="text-xs font-bold text-blue-500 hover:underline">View all →</button>
                    </div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {['VR REF', 'Set No.', 'Description', 'Decision', 'Approved'].map(h => (
                            <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reworks.slice(0, 5).map(r => (
                          <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-blue-600">{r.vrRef}</td>
                            <td className="px-4 py-3">{r.setNumber}</td>
                            <td className="px-4 py-3 truncate max-w-[160px]">{r.description}</td>
                            <td className="px-4 py-3">
                              {r.decision
                                ? <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black uppercase', DBGCLS[r.decision] ? DBGCLS[r.decision].replace('bg-', 'bg-').replace('500', '100') + ' ' + DTEXTCLS[r.decision] : 'bg-slate-100 text-slate-600')}>{r.decision}</span>
                                : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              {r.approved === 'Oui'
                                ? <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">Oui</span>
                                : r.approved === 'Non'
                                  ? <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700">Non</span>
                                  : <span className="text-slate-300">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* ── Reports list view ── */}
          {view === 'reports' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <header className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Inspection Reports</h1>
                  <p className="text-slate-500 font-medium">Manage and review quality reports</p>
                </div>
                <button onClick={() => { setFormData(INITIAL_DATA); setEditingId(null); setView('form'); }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all">
                  <Plus size={18} /> New Report
                </button>
              </header>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input type="text" placeholder="Search by number, article, date…" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredReports.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="mx-auto h-14 w-14 text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No reports found</h3>
                    <p className="text-slate-500 mb-6 text-sm">{searchQuery ? 'Try a different search.' : 'Create your first report.'}</p>
                    {!searchQuery && (
                      <button onClick={() => { setFormData(INITIAL_DATA); setEditingId(null); setView('form'); }}
                        className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors inline-flex items-center gap-2">
                        <Plus size={18} /> Create report
                      </button>
                    )}
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        {['Report #', 'Article', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-3 text-[10px] font-black uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredReports.map(report => (
                        <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 font-mono font-bold text-emerald-600">{report.report_number}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{report.data.articleDescription}</div>
                            <div className="text-xs text-slate-500">{report.data.articleNumber}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{report.data.testDate}</td>
                          <td className="px-6 py-4">
                            <span className={cn('px-3 py-1 rounded-full text-xs font-black uppercase',
                              report.data.finalPassed === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                              {report.data.finalPassed === 'Yes' ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setFormData(report.data); setView('preview'); }} title="Aperçu"
                                className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Eye size={17} /></button>
                              <button onClick={() => handleEdit(report)} title="Modifier"
                                className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit3 size={17} /></button>
                              <button onClick={() => handleDelete(report.id)} title="Supprimer"
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-w-5xl mx-auto"
            >
              <header className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                    {editingId ? 'Edit Inspection Report' : 'New Inspection Report'}
                  </h1>
                  <p className="text-slate-500 font-medium">Complete all sections to generate the final report</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    Save Report
                  </button>
                </div>
              </header>

              {/* Form Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
                  {tabs.map((tab, idx) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(idx)}
                      className={cn(
                        "px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                        activeTab === idx ? "bg-white text-emerald-600 border-b-2 border-emerald-500" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  {activeTab === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Report Number</label>
                        <input
                          type="text"
                          value={formData.reportNumber}
                          onChange={(e) => setFormData({ ...formData, reportNumber: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                          placeholder="QC-2026-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Set Number</label>
                        <input
                          type="text"
                          value={formData.articleNumber}
                          onChange={(e) => setFormData({ ...formData, articleNumber: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase text-slate-500">Set Description</label>
                        <input
                          type="text"
                          value={formData.articleDescription}
                          onChange={(e) => setFormData({ ...formData, articleDescription: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Source</label>
                        <input
                          type="text"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Test Date</label>
                        <input
                          type="date"
                          value={formData.testDate}
                          onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Examiner</label>
                        <input
                          type="text"
                          value={formData.examiner}
                          onChange={(e) => setFormData({ ...formData, examiner: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { label: "Visual inspection of packaging", key: "packagingVisual" },
                          { label: "Checking completeness of article", key: "completeness" },
                        ].map((item) => (
                          <div key={item.key} className="space-y-3">
                            <p className="font-bold text-slate-700">{item.label}</p>
                            <div className="flex gap-4">
                              {['OK', 'NOK'].map((val) => (
                                <label key={val} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={item.key}
                                    checked={formData[item.key as keyof ReportData] === val}
                                    onChange={() => setFormData({ ...formData, [item.key]: val })}
                                    className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                                  />
                                  <span className="font-semibold">{val}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        {[
                          { label: "Assembly instructions correspond to specs", key: "assemblyInstructions" },
                          { label: "Packaging complies with specifications", key: "packagingSpecifications" },
                        ].map((item) => (
                          <div key={item.key} className="space-y-3">
                            <p className="font-bold text-slate-700">{item.label}</p>
                            <div className="flex gap-4">
                              {['Yes', 'No'].map((val) => (
                                <label key={val} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={item.key}
                                    checked={formData[item.key as keyof ReportData] === val}
                                    onChange={() => setFormData({ ...formData, [item.key]: val })}
                                    className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                                  />
                                  <span className="font-semibold">{val}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-black uppercase text-sm tracking-widest text-slate-900">Article Inspection List</h3>
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              articles: [
                                ...formData.articles,
                                { articleNumber: (formData.articles.length + 1).toString(), weightTest: 'OK', functionalTest: 'OK', notes: '' }
                              ]
                            });
                          }}
                          className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Add Article
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="border p-3 text-left text-xs font-black uppercase text-slate-500">Art. Code</th>
                              <th className="border p-3 text-left text-xs font-black uppercase text-slate-500">Weight Test</th>
                              <th className="border p-3 text-left text-xs font-black uppercase text-slate-500">Functional Test</th>
                              <th className="border p-3 text-left text-xs font-black uppercase text-slate-500">Notes</th>
                              <th className="border p-3 text-center text-xs font-black uppercase text-slate-500 w-16">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.articles.map((art, idx) => (
                              <tr key={idx}>
                                <td className="border p-3">
                                  <input
                                    type="text"
                                    value={art.articleNumber}
                                    onChange={(e) => {
                                      const newArts = [...formData.articles];
                                      newArts[idx].articleNumber = e.target.value;
                                      setFormData({ ...formData, articles: newArts });
                                    }}
                                    className="w-full p-1 rounded border border-slate-200 outline-none font-bold text-sm"
                                  />
                                </td>
                                <td className="border p-3">
                                  <select
                                    value={art.weightTest}
                                    onChange={(e) => {
                                      const newArts = [...formData.articles];
                                      newArts[idx].weightTest = e.target.value as 'OK' | 'NOK';
                                      setFormData({ ...formData, articles: newArts });
                                    }}
                                    className="w-full p-1 rounded border border-slate-200 outline-none text-sm"
                                  >
                                    <option value="OK">OK</option>
                                    <option value="NOK">NOK</option>
                                  </select>
                                </td>
                                <td className="border p-3">
                                  <select
                                    value={art.functionalTest}
                                    onChange={(e) => {
                                      const newArts = [...formData.articles];
                                      newArts[idx].functionalTest = e.target.value as 'OK' | 'NOK';
                                      setFormData({ ...formData, articles: newArts });
                                    }}
                                    className="w-full p-1 rounded border border-slate-200 outline-none text-sm"
                                  >
                                    <option value="OK">OK</option>
                                    <option value="NOK">NOK</option>
                                  </select>
                                </td>
                                <td className="border p-3">
                                  <input
                                    type="text"
                                    value={art.notes}
                                    onChange={(e) => {
                                      const newArts = [...formData.articles];
                                      newArts[idx].notes = e.target.value;
                                      setFormData({ ...formData, articles: newArts });
                                    }}
                                    className="w-full p-1 rounded border border-slate-200 outline-none text-sm"
                                    placeholder="Add notes..."
                                  />
                                </td>
                                <td className="border p-3 text-center">
                                  <button
                                    onClick={() => {
                                      const newArts = formData.articles.filter((_, i) => i !== idx);
                                      setFormData({ ...formData, articles: newArts });
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove row"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500">Error Description</label>
                          <textarea
                            value={formData.errorDescription}
                            onChange={(e) => setFormData({ ...formData, errorDescription: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500">Missing Parts Description</label>
                          <textarea
                            value={formData.missingPartsDescription}
                            onChange={(e) => setFormData({ ...formData, missingPartsDescription: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-black uppercase text-sm tracking-widest text-slate-900 border-b pb-2">AQL Inspection</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Total Qty (N)</label>
                            <input type="text" value={formData.batchQuantity} onChange={(e) => setFormData({ ...formData, batchQuantity: e.target.value })} className="w-full px-3 py-1.5 border rounded" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Sample Qty (n)</label>
                            <input type="text" value={formData.sampleQuantity} onChange={(e) => setFormData({ ...formData, sampleQuantity: e.target.value })} className="w-full px-3 py-1.5 border rounded" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">AQL Value</label>
                            <input type="text" value={formData.aqlValue} onChange={(e) => setFormData({ ...formData, aqlValue: e.target.value })} className="w-full px-3 py-1.5 border rounded" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Total Errors</label>
                            <input type="text" value={formData.totalErrors} onChange={(e) => setFormData({ ...formData, totalErrors: e.target.value })} className="w-full px-3 py-1.5 border rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          <p className="font-bold text-slate-700">AQL Passed?</p>
                          <div className="flex gap-4">
                            {['Yes', 'No'].map((val) => (
                              <label key={val} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={formData.aqlPassed === val}
                                  onChange={() => setFormData({ ...formData, aqlPassed: val as 'Yes' | 'No' })}
                                  className="w-4 h-4 text-emerald-500"
                                />
                                <span className="font-semibold">{val}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 4 && (
                    <ImageUpload
                      images={formData.images}
                      onChange={(images) => setFormData({ ...formData, images })}
                    />
                  )}

                  {activeTab === 5 && (
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-6 mb-6">
                          <p className="text-xl font-black uppercase tracking-tighter text-slate-900">Final Inspection Result:</p>
                          <div className="flex gap-4">
                            {['Yes', 'No'].map((val) => (
                              <label key={val} className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl border-2 cursor-pointer transition-all",
                                formData.finalPassed === val
                                  ? (val === 'Yes' ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20")
                                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                              )}>
                                <input
                                  type="radio"
                                  className="hidden"
                                  checked={formData.finalPassed === val}
                                  onChange={() => setFormData({ ...formData, finalPassed: val as 'Yes' | 'No' })}
                                />
                                <span className="font-black uppercase tracking-widest">{val === 'Yes' ? 'PASSED' : 'FAILED'}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500">Final Comments</label>
                            <textarea
                              value={formData.finalComments}
                              onChange={(e) => setFormData({ ...formData, finalComments: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                              placeholder="Add final inspection notes..."
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase text-slate-500">Inspector Name</label>
                              <input
                                type="text"
                                value={formData.finalInspectorName}
                                onChange={(e) => setFormData({ ...formData, finalInspectorName: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase text-slate-500">Date</label>
                              <input
                                type="date"
                                value={formData.finalDate}
                                onChange={(e) => setFormData({ ...formData, finalDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
                    disabled={activeTab === 0}
                    className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                  >
                    Previous Step
                  </button>
                  {activeTab < tabs.length - 1 ? (
                    <button
                      onClick={() => setActiveTab(prev => Math.min(tabs.length - 1, prev + 1))}
                      className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setView('preview');
                      }}
                      className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                    >
                      <Eye size={18} />
                      Preview Report
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'preview' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <header className="flex justify-between items-center max-w-[210mm] mx-auto">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Report Preview</h1>
                  <p className="text-slate-500 font-medium">Review the generated document before export</p>
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={isGenerating}
                    onClick={async () => {
                      setIsGenerating(true);
                      try {
                        await generatePDF('report-content', formData.reportNumber || 'Report');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Download size={18} className={isGenerating ? "animate-bounce" : ""} />
                    {isGenerating ? "Generating..." : "Download PDF"}
                  </button>
                </div>
              </header>

              <ReportPreview data={formData} />
            </motion.div>
          )}
          {view === 'reclamation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <QualityReclamation
                reclamations={reclamations}
                setReclamations={setReclamations}
              />
            </motion.div>
          )}
          {view === 'rework' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Rework
                reclamations={reclamations}
                setReclamations={setReclamations}
                reworks={reworks}
                setReworks={setReworks}
                onGenerateReport={handleGenerateReportFromRework}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
