/**
 * Quality Reclamation — list / form split view + search
 */
import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, X, Upload, Save, FileDown, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reclamation } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import logo from '../assets/logo.png';
import { cn } from '../utils/cn';

interface Props {
  reclamations: Reclamation[];
  setReclamations: React.Dispatch<React.SetStateAction<Reclamation[]>>;
}

const EMPTY_FORM = {
  set: '', reference: '', description: '',
  defaut: '', quantite: '', taux: '', remarque: '',
};

const TABS = ['Identification', 'Defects & Quantities', 'Photos'];

export function QualityReclamation({ reclamations, setReclamations }: Props) {
  const [innerView, setInnerView] = useState<'list' | 'form'>('list');
  const [setImage, setSetImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<(string | null)[]>([null, null, null]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [search, setSearch] = useState('');

  const setFileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const openNewForm = () => {
    setFormData(EMPTY_FORM);
    setSetImage(null);
    setGalleryImages([null, null, null]);
    setEditingId(null);
    setActiveTab(0);
    setInnerView('form');
  };

  const openEditForm = (rec: Reclamation) => {
    setFormData({ set: rec.set, reference: rec.reference, description: rec.description, defaut: rec.defaut, quantite: rec.quantite, taux: rec.taux, remarque: rec.remarque });
    setSetImage(rec.setImage);
    setGalleryImages([...rec.galleryImages]);
    setEditingId(rec.id);
    setActiveTab(0);
    setInnerView('form');
  };

  const resetToList = () => {
    setFormData(EMPTY_FORM);
    setSetImage(null);
    setGalleryImages([null, null, null]);
    setEditingId(null);
    setActiveTab(0);
    setInnerView('list');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (index !== undefined) {
        setGalleryImages(prev => { const n = [...prev]; n[index] = result; return n; });
      } else {
        setSetImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveEntry = () => {
    if (!formData.set || !formData.reference) {
      alert('Please fill in at least SET and Reference.');
      return;
    }
    if (editingId !== null) {
      setReclamations(prev => prev.map(r => r.id === editingId
        ? { ...formData, id: editingId, setImage, galleryImages: [...galleryImages], reworkId: r.reworkId }
        : r
      ));
    } else {
      setReclamations(prev => [{ ...formData, id: Date.now(), setImage, galleryImages: [...galleryImages] }, ...prev]);
    }
    resetToList();
  };

  const deleteEntry = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setReclamations(prev => prev.filter(r => r.id !== id));
  };

  const handleExportPDF = async (rec: Reclamation) => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 200));
    try {
      await generatePDF(`reclamation-print-${rec.id}`, `Reclamation_${rec.set}_${rec.reference}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const filtered = reclamations.filter(r =>
    r.set.toLowerCase().includes(search.toLowerCase()) ||
    r.reference.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.defaut.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Quality Reclamation</h1>
          <p className="text-slate-500 font-medium">Record and track quality reclamations</p>
        </div>
        {innerView === 'list' && (
          <button onClick={openNewForm}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all">
            <Plus size={18} /> New Reclamation
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {/* ── LIST VIEW ── */}
        {innerView === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                placeholder="Search by SET, reference, description, defect…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              />
            </div>

            {/* Table */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      {['SET', 'Reference', 'Description', 'Defect', 'Quantity', 'Rate', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0
                      ? <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">
                        {search ? 'No results for this search.' : 'No reclamations recorded…'}
                      </td></tr>
                      : filtered.map(rec => (
                        <tr key={rec.id} onClick={() => openEditForm(rec)}
                          className="text-sm hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="px-4 py-3 font-mono font-bold text-orange-600 whitespace-nowrap">{rec.set}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{rec.reference}</td>
                          <td className="px-4 py-3 truncate max-w-[150px]">{rec.description}</td>
                          <td className="px-4 py-3 truncate max-w-[120px]">{rec.defaut}</td>
                          <td className="px-4 py-3">{rec.quantite}</td>
                          <td className="px-4 py-3">{rec.taux}</td>
                          <td className="px-4 py-3">
                            {rec.reworkId
                              ? <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase">Completed</span>
                              : <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase">Pending</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 items-center">
                              <button onClick={e => { e.stopPropagation(); handleExportPDF(rec); }}
                                title="Exporter PDF" disabled={isGenerating}
                                className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors"><FileDown size={14} /></button>
                              <button onClick={e => deleteEntry(e, rec.id)}
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50">
                {TABS.map((tab, idx) => (
                  <button key={tab} onClick={() => setActiveTab(idx)}
                    className={cn(
                      'px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                      activeTab === idx ? 'bg-white text-orange-600 border-b-2 border-orange-500' : 'text-slate-400 hover:text-slate-600'
                    )}>
                    {tab}
                  </button>
                ))}
                {editingId && (
                  <span className="ml-auto flex items-center px-6 text-[10px] font-black uppercase tracking-widest text-orange-500">
                    Modification en cours
                  </span>
                )}
              </div>

              <div className="p-8">
                {/* Tab 1 */}
                {activeTab === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[{ label: 'SET', name: 'set', placeholder: 'Ex: SET-001' }, { label: 'Référence', name: 'reference', placeholder: 'Ex: REF-XYZ' }].map(f => (
                      <div key={f.name} className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500">{f.label}</label>
                        <input name={f.name} value={formData[f.name as keyof typeof formData]} onChange={handleInputChange}
                          type="text" placeholder={f.placeholder}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" />
                      </div>
                    ))}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase text-slate-500">Description</label>
                      <input name="description" value={formData.description} onChange={handleInputChange}
                        type="text" placeholder="Description de la pièce ou du problème"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                  </div>
                )}

                {/* Tab 2 */}
                {activeTab === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">Defect</label>
                      <input name="defaut" value={formData.defaut} onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">Total Quantity</label>
                      <input name="quantite" value={formData.quantite} onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">Rate (%)</label>
                      <input name="taux" value={formData.taux} onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-black uppercase text-slate-500">Remarks</label>
                      <textarea name="remarque" value={formData.remarque} onChange={handleInputChange} rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none" />
                    </div>
                  </div>
                )}

                {/* Tab 3 — Photos */}
                {activeTab === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">Main image (SET)</label>
                      <input type="file" ref={setFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e)} />
                      <div onClick={() => setFileInputRef.current?.click()}
                        className="h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden group cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all">
                        {setImage
                          ? <><motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={setImage} alt="SET" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white text-xs font-bold uppercase">Changer</p></div></>
                          : <><Upload className="w-8 h-8 text-slate-300 group-hover:text-orange-400 transition-colors" /><p className="mt-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Click to upload</p></>
                        }
                      </div>
                      {setImage && <button onClick={() => setSetImage(null)} className="text-xs text-red-500 font-bold flex items-center gap-1"><X size={12} /> Clear</button>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500">Additional photos</label>
                      <div className="grid grid-cols-3 gap-3">
                        {galleryImages.map((img, i) => (
                          <div key={i} className="space-y-1">
                            <input type="file" ref={galleryInputRefs[i]} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, i)} />
                            <div onClick={() => galleryInputRefs[i].current?.click()}
                              className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 group cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all relative overflow-hidden">
                              {img
                                ? <><motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white text-[10px] font-bold uppercase">Changer</p></div></>
                                : <Upload className="w-5 h-5 text-slate-300 group-hover:text-orange-400 transition-colors" />
                              }
                            </div>
                            {img && <button onClick={() => { const n = [...galleryImages]; n[i] = null; setGalleryImages(n); }} className="text-[10px] text-red-400 font-bold">Clear</button>}
                          </div>
                        ))}
                      </div>
                    </div>
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
                    : <button onClick={saveEntry} className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
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

      {/* Hidden PDF views */}
      <div className="fixed -left-[9999px] top-0 w-[794px]">
        {reclamations.map(rec => (
          <div key={rec.id} id={`reclamation-print-${rec.id}`} className="bg-white font-sans">
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '3px solid #f97316', padding: '24px 32px', gap: 16 }}>
              <img src={logo} alt="Logo" style={{ height: 48, width: 'auto' }} />
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#0f172a' }}>Réclamation Qualité</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Date : {new Date(rec.id).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[{ label: 'SET', value: rec.set }, { label: 'Référence', value: rec.reference }, { label: 'Description', value: rec.description }, { label: 'Défaut', value: rec.defaut }, { label: 'Quantité', value: rec.quantite }, { label: 'Taux (%)', value: rec.taux }].map(({ label, value }) => (
                <div key={label} style={{ borderLeft: '3px solid #f97316', paddingLeft: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{value || '—'}</div>
                </div>
              ))}
              {rec.remarque && (
                <div style={{ gridColumn: '1 / -1', borderLeft: '3px solid #f97316', paddingLeft: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1 }}>Remarque</div>
                  <div style={{ fontSize: 14, color: '#0f172a', marginTop: 4 }}>{rec.remarque}</div>
                </div>
              )}
              {[rec.setImage, ...rec.galleryImages].filter(Boolean).length > 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1, marginBottom: 16, borderLeft: '3px solid #f97316', paddingLeft: 12 }}>Photos</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[rec.setImage, ...rec.galleryImages].filter(Boolean).map((img, i) => (
                      <div key={i} style={{ width: '100%' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#cbd5e1', letterSpacing: 1, marginBottom: 6 }}>Photo {i + 1}</div>
                        <img src={img!} alt="" style={{ width: '100%', height: 'auto', maxHeight: 480, objectFit: 'contain', borderRadius: 8, border: '1px solid #e2e8f0', display: 'block' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
              <span>QC Report — Réclamation Qualité</span>
              <span>{rec.set} / {rec.reference}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
