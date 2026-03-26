/**
 * Rework — list / form split view.
 * Clicking an open reclamation from the banner opens the form.
 * Saving or cancelling returns to the list.
 * Decision = free text with suggestion datalist.
 */
import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, FileDown, Link, ArrowLeft, Search, Sheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reclamation, ReworkEntry } from '../types';
import * as XLSX from 'xlsx';
import { cn } from '../utils/cn';

interface Props {
  reclamations: Reclamation[];
  setReclamations: React.Dispatch<React.SetStateAction<Reclamation[]>>;
  reworks: ReworkEntry[];
  setReworks: React.Dispatch<React.SetStateAction<ReworkEntry[]>>;
}

const EMPTY_FORM: Omit<ReworkEntry, 'id'> = {
  reclamationId: undefined,
  vrRef: '', week: '', date: '', prPu: '', mtGr: '',
  setNumber: '', partNo: '', description: '',
  quantity: '', comments: '', percent: '',
  approved: '', reworkForm: '', decision: '',
  quantityReturned: '', status: '', weekTrailer: '', trailerNumber: '',
  deliveryNoteTN: '', quota: '', orderNumber2: '',
  quantityReceived: '', colonne1: '', colonne2: '',
};

const TABS = ['Identification', 'Inspection & Decision', 'Logistics'];
const DECISION_SUGGESTIONS = ['Retouche', 'Rebut', 'Accepté', 'Retour fournisseur'];

const DECISION_BADGE: Record<string, string> = {
  'Retouche': 'bg-blue-100 text-blue-700',
  'Rebut': 'bg-red-100 text-red-700',
  'Accepté': 'bg-emerald-100 text-emerald-700',
  'Retour fournisseur': 'bg-amber-100 text-amber-700',
};

export function Rework({ reclamations, setReclamations, reworks, setReworks }: Props) {
  const [innerView, setInnerView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ReworkEntry, 'id'>>(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [search, setSearch] = useState('');

  /** Generate the next VR REF in sequence: TN-VR-001, TN-VR-002, … */
  const nextVrRef = (): string => {
    if (reworks.length === 0) return 'TN-VR-001';
    const nums = reworks
      .map(r => {
        const m = r.vrRef.match(/TN-VR-(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter(n => n > 0);
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return `TN-VR-${String(max + 1).padStart(3, '0')}`;
  };

  const openReclamations = reclamations.filter(r => !r.reworkId);

  const openNewForm = () => {
    setFormData({ ...EMPTY_FORM, vrRef: nextVrRef() });
    setEditingId(null);
    setActiveTab(0);
    setInnerView('form');
  };

  /** Open form pre-filled from a reclamation */
  const openFromReclamation = (rec: Reclamation) => {
    setFormData({
      ...EMPTY_FORM,
      vrRef: nextVrRef(),
      reclamationId: rec.id,
      setNumber: rec.set,
      partNo: rec.reference,
      description: rec.description,
      quantity: rec.quantite,
      percent: rec.taux,   // pre-fill defect % from reclamation rate
    });
    setEditingId(null);
    setActiveTab(0);
    setInnerView('form');
  };

  const openEditForm = (entry: ReworkEntry) => {
    const { id, ...rest } = entry;
    setFormData(rest);
    setEditingId(id);
    setActiveTab(0);
    setInnerView('form');
  };

  const resetToList = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setActiveTab(0);
    setInnerView('list');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveEntry = () => {
    if (!formData.vrRef && !formData.setNumber) {
      alert('Please fill in at least VR REF or Set Number.');
      return;
    }
    const newId = editingId ?? Date.now();
    if (editingId !== null) {
      setReworks(prev => prev.map(r => r.id === editingId ? { ...formData, id: editingId } : r));
      setReclamations(prev => prev.map(r => {
        if (r.reworkId === editingId && r.id !== formData.reclamationId) return { ...r, reworkId: undefined };
        if (r.id === formData.reclamationId) return { ...r, reworkId: editingId };
        return r;
      }));
    } else {
      setReworks(prev => [{ ...formData, id: newId }, ...prev]);
      if (formData.reclamationId) {
        setReclamations(prev => prev.map(r => r.id === formData.reclamationId ? { ...r, reworkId: newId } : r));
      }
    }
    resetToList();
  };

  const deleteEntry = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const entry = reworks.find(r => r.id === id);
    setReworks(prev => prev.filter(r => r.id !== id));
    if (entry?.reclamationId) {
      setReclamations(prev => prev.map(r => r.id === entry.reclamationId ? { ...r, reworkId: undefined } : r));
    }
  };

  /** Export a single rework entry to Excel (column order per spec) */
  const handleExportExcel = (entry: ReworkEntry) => {
    const linkedRec = reclamations.find(r => r.id === entry.reclamationId);
    const headers = [
      'VR REF', 'Week', 'Date', 'PR/PU', 'MT/GR', 'Set Number', 'Part No',
      'Description', 'Quantity', 'Comments', 'Defect', 'Approved', 'Rework Form',
      'Decision', 'Quantity Returned', 'Status', 'Week Trailer', 'Trailer Number',
      'Delivery Note', 'Quota', 'Order Number', 'Quantity Received',
      'Column 1', 'Column 2', 'Linked Reclamation',
    ];
    const row = [
      entry.vrRef, entry.week, entry.date, entry.prPu, entry.mtGr,
      entry.setNumber, entry.partNo, entry.description, entry.quantity,
      entry.comments, entry.percent, entry.approved, entry.reworkForm,
      entry.decision, entry.quantityReturned, entry.status,
      entry.weekTrailer, entry.trailerNumber, entry.deliveryNoteTN,
      entry.quota, entry.orderNumber2, entry.quantityReceived,
      entry.colonne1, entry.colonne2,
      linkedRec ? `${linkedRec.set} — ${linkedRec.reference}` : '',
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, row]);
    ws['!cols'] = headers.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rework');
    XLSX.writeFile(wb, `Rework_${entry.vrRef || entry.setNumber}.xlsx`);
  };

  /** Export ALL reworks to a single Excel file (column order per spec) */
  const handleExportAll = () => {
    const headers = [
      'VR REF', 'Week', 'Date', 'PR/PU', 'MT/GR', 'Set Number', 'Part No',
      'Description', 'Quantity', 'Comments', 'Defect', 'Approved', 'Rework Form',
      'Decision', 'Quantity Returned', 'Status', 'Week Trailer', 'Trailer Number',
      'Delivery Note', 'Quota', 'Order Number', 'Quantity Received',
      'Column 1', 'Column 2', 'Linked Reclamation',
    ];
    const dataRows = reworks.map(entry => {
      const linkedRec = reclamations.find(r => r.id === entry.reclamationId);
      return [
        entry.vrRef, entry.week, entry.date, entry.prPu, entry.mtGr,
        entry.setNumber, entry.partNo, entry.description, entry.quantity,
        entry.comments, entry.percent, entry.approved, entry.reworkForm,
        entry.decision, entry.quantityReturned, entry.status,
        entry.weekTrailer, entry.trailerNumber, entry.deliveryNoteTN,
        entry.quota, entry.orderNumber2, entry.quantityReceived,
        entry.colonne1, entry.colonne2,
        linkedRec ? `${linkedRec.set} — ${linkedRec.reference}` : '',
      ];
    });
    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
    ws['!cols'] = headers.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Reworks');
    XLSX.writeFile(wb, `All_Reworks_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const filtered = reworks.filter(r =>
    r.vrRef.toLowerCase().includes(search.toLowerCase()) ||
    r.setNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.partNo.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.decision.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Rework</h1>
        </div>
        {innerView === 'list' && (
          <div className="flex gap-3">
            {reworks.length > 0 && (
              <button onClick={handleExportAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all">
                <FileDown size={18} /> Export Excel
              </button>
            )}
            <button onClick={openNewForm}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">
              <Plus size={18} /> New Rework
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {/* ── LIST VIEW ── */}
        {innerView === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            {/* Open reclamations banner */}
            {openReclamations.length > 0 && (
              <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">
                  Reclamations pending rework ({openReclamations.length}) — click to complete
                </p>
                <div className="flex flex-wrap gap-2">
                  {openReclamations.map(rec => (
                    <button key={rec.id} onClick={() => openFromReclamation(rec)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-sm">
                      <Link size={12} />
                      {rec.set} — {rec.reference}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input type="text" placeholder="Search by VR REF, set, part no, description, decision…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
            </div>

            {/* Table */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      {['VR REF', 'Date', 'Set No.', 'Part No', 'Description', 'Quantity', '% Taux', 'Decision', 'Approved', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0
                      ? <tr><td colSpan={10} className="px-6 py-12 text-center text-slate-400 italic">
                        {search ? 'No results for this search.' : 'No reworks recorded…'}
                      </td></tr>
                      : filtered.map(entry => (
                        <tr key={entry.id} onClick={() => openEditForm(entry)}
                          className="text-sm hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="px-4 py-3 font-mono font-bold text-blue-600 whitespace-nowrap">{entry.vrRef}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{entry.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{entry.setNumber}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{entry.partNo}</td>
                          <td className="px-4 py-3 truncate max-w-[140px]">{entry.description}</td>
                          <td className="px-4 py-3">{entry.quantity}</td>
                          <td className="px-4 py-3">{entry.percent}</td>
                          <td className="px-4 py-3">
                            {entry.decision
                              ? <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black uppercase', DECISION_BADGE[entry.decision] ?? 'bg-slate-100 text-slate-600')}>{entry.decision}</span>
                              : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-3">{entry.approved}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 items-center">
                              <button onClick={e => { e.stopPropagation(); handleExportExcel(entry); }}
                                title="Export Excel"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"><FileDown size={14} /></button>
                              <button onClick={e => deleteEntry(e, entry.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                              <Edit size={14} className="text-slate-300" />
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        )}

        {/* ── FORM VIEW ── */}
        {innerView === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button onClick={resetToList} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> Back to list
            </button>

            {/* Linked reclamation banner */}
            {formData.reclamationId && (() => {
              const linked = reclamations.find(r => r.id === formData.reclamationId);
              return linked ? (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <Link size={16} className="text-blue-500 shrink-0" />
                  <span className="text-sm font-semibold text-blue-700">
                    Linked reclamation: <strong>{linked.set}</strong> — {linked.reference}
                    {linked.description && ` · ${linked.description}`}
                  </span>
                  <button onClick={() => setFormData(prev => ({ ...prev, reclamationId: undefined }))}
                    className="ml-auto text-blue-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                </div>
              ) : null;
            })()}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50">
                {TABS.map((tab, idx) => (
                  <button key={tab} onClick={() => setActiveTab(idx)}
                    className={cn(
                      'px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                      activeTab === idx ? 'bg-white text-blue-600 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-600'
                    )}>
                    {tab}
                  </button>
                ))}
                {editingId && (
                  <span className="ml-auto flex items-center px-6 text-[10px] font-black uppercase tracking-widest text-blue-500">Editing</span>
                )}
              </div>

              <div className="p-8">
                {/* Tab 1 — Identification */}
                {activeTab === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'VR REF', name: 'vrRef', placeholder: '' },
                      { label: 'Week', name: 'week', placeholder: '' },
                      { label: 'Date', name: 'date', type: 'date' },
                      { label: 'MT/GR', name: 'mtGr' },
                      { label: 'Set Number', name: 'setNumber', placeholder: '' },
                      { label: 'Part No', name: 'partNo', placeholder: '' },
                    ].map(f => (
                      <div key={f.name} className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">{f.label}</label>
                        <input name={f.name} value={(formData as any)[f.name]} onChange={handleInput}
                          type={f.type ?? 'text'} placeholder={f.placeholder}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    ))}
                    {/* PR/PU dropdown */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">PR/PU</label>
                      <select name="prPu" value={formData.prPu} onChange={handleInput}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">— Select —</option>
                        <option value="Purchased Item">Purchased Item</option>
                        <option value="Production Item">Production Item</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase text-slate-500">Description</label>
                      <input name="description" value={formData.description} onChange={handleInput}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                )}

                {/* Tab 2 — Inspection & Décision */}
                {activeTab === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Quantity', name: 'quantity' },
                      { label: '% Taux', name: 'percent' },
                      { label: 'Rework Form', name: 'reworkForm' },
                      { label: 'Returned Quantity', name: 'quantityReturned' },
                      { label: 'Status', name: 'status' },
                    ].map(f => (
                      <div key={f.name} className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">{f.label}</label>
                        <input name={f.name} value={(formData as any)[f.name]} onChange={handleInput}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    ))}
                    {/* Approved — Yes / No */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">Approved</label>
                      <select name="approved" value={formData.approved} onChange={handleInput}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">— Select —</option>
                        <option value="Oui">Yes</option>
                        <option value="Non">No</option>
                      </select>
                    </div>
                    {/* Decision — free text with datalist suggestions */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">Decision</label>
                      <input
                        name="decision"
                        list="decision-suggestions"
                        value={formData.decision}
                        onChange={handleInput}
                        placeholder="Type or choose…"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <datalist id="decision-suggestions">
                        {DECISION_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                      </datalist>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase text-slate-500">Comments</label>
                      <textarea name="comments" value={formData.comments} onChange={handleInput} rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                    </div>
                  </div>
                )}

                {/* Tab 3 — Logistique */}
                {activeTab === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'WEEK Trailer', name: 'weekTrailer' },
                      { label: 'Trailer Number', name: 'trailerNumber' },
                      { label: 'Delivery Note TN', name: 'deliveryNoteTN' },
                      { label: 'Quota', name: 'quota' },
                      { label: 'Order Number 2', name: 'orderNumber2' },
                      { label: 'Received Quantity', name: 'quantityReceived' },
                      {/*{ label: 'Column 1', name: 'colonne1' },
                      { label: 'Column 2', name: 'colonne2' },*/}
                    ].map(f => (
                      <div key={f.name} className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">{f.label}</label>
                        <input name={f.name} value={(formData as any)[f.name]} onChange={handleInput}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 pb-6 bg-slate-50 border-t border-slate-100 flex justify-between pt-4">
                <button onClick={() => setActiveTab(p => Math.max(0, p - 1))} disabled={activeTab === 0}
                  className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30">
                  Previous
                </button>
                <div className="flex gap-3">
                  {activeTab < TABS.length - 1
                    ? <button onClick={() => setActiveTab(p => p + 1)} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                      Next
                    </button>
                    : <button onClick={saveEntry} className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                      {editingId ? <Save size={16} /> : <Plus size={16} />}
                      {editingId ? 'Update' : 'Save'}
                    </button>
                  }
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
