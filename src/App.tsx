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
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportData, SavedReport, ArticleInspection } from './types';
import { api } from './services/api';
import { ImageUpload } from './components/ImageUpload';
import { ReportPreview } from './components/ReportPreview';
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
  articles: Array.from({ length: 5 }, (_, i) => ({
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
  const [view, setView] = useState<'dashboard' | 'form' | 'preview'>('dashboard');
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [formData, setFormData] = useState<ReportData>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

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
      setView('dashboard');
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
            onClick={() => {
              setFormData(INITIAL_DATA);
              setEditingId(null);
              setView('form');
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              view === 'form' && !editingId ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "hover:bg-slate-800 text-slate-400"
            )}
          >
            <Plus size={20} />
            <span className="font-semibold">New Report</span>
          </button>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Inspection Dashboard</h1>
                  <p className="text-slate-500 font-medium">Manage and track manufacturing quality reports</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-64 shadow-sm"
                  />
                </div>
              </header>

              <div className="grid grid-cols-1 gap-4">
                {filteredReports.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                    <FileText className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No reports found</h3>
                    <p className="text-slate-500 mb-6">Start by creating your first quality inspection report.</p>
                    <button
                      onClick={() => setView('form')}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Create Report
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Report #</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Article</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Date</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredReports.map((report) => (
                          <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-mono font-bold text-emerald-600">{report.report_number}</td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{report.data.articleDescription}</div>
                              <div className="text-xs text-slate-500">{report.data.articleNumber}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{report.data.testDate}</td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-black uppercase",
                                report.data.finalPassed === 'Yes' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              )}>
                                {report.data.finalPassed === 'Yes' ? 'Passed' : 'Failed'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setFormData(report.data);
                                    setView('preview');
                                  }}
                                  className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                                  title="Preview"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleEdit(report)}
                                  className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(report.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    onClick={() => setView('dashboard')}
                    className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
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
                        <label className="text-xs font-black uppercase text-slate-500">Article Number</label>
                        <input
                          type="text"
                          value={formData.articleNumber}
                          onChange={(e) => setFormData({ ...formData, articleNumber: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase text-slate-500">Article Description</label>
                        <input
                          type="text"
                          value={formData.articleDescription}
                          onChange={(e) => setFormData({ ...formData, articleDescription: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Order Number</label>
                        <input
                          type="text"
                          value={formData.orderNumber}
                          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">Supplier</label>
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
                            <label className="text-[10px] font-black uppercase text-slate-400">Batch Qty (N)</label>
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
        </AnimatePresence>
      </main>
    </div>
  );
}
