import { supabase } from "../supabaseClient";
import { ReportData, SavedReport, Reclamation, ReworkEntry } from "../types";

export const api = {
  // --- Reports ---
  async getReports(): Promise<SavedReport[]> {
    const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getReport(id: number): Promise<SavedReport> {
    const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createReport(reportNumber: string, reportData: ReportData): Promise<{ id: number }> {
    const { data, error } = await supabase.from('reports').insert([{ report_number: reportNumber, data: reportData }]).select();
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Insert failed");
    return { id: data[0].id };
  },

  async updateReport(id: number, reportData: ReportData): Promise<void> {
    const { error } = await supabase.from('reports').update({ data: reportData, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },

  async deleteReport(id: number): Promise<void> {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Reclamations ---
  async getReclamations(): Promise<Reclamation[]> {
    const { data, error } = await supabase.from('reclamations').select('*').order('id', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createReclamation(rec: Omit<Reclamation, 'id'>): Promise<Reclamation> {
    const { data, error } = await supabase.from('reclamations').insert([rec]).select().single();
    if (error) throw error;
    return data;
  },

  async updateReclamation(id: number, rec: Partial<Reclamation>): Promise<Reclamation> {
    const { data, error } = await supabase.from('reclamations').update(rec).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteReclamation(id: number): Promise<void> {
    const { error } = await supabase.from('reclamations').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Reworks ---
  async getReworks(): Promise<ReworkEntry[]> {
    const { data, error } = await supabase.from('reworks').select('*').order('id', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createRework(entry: Omit<ReworkEntry, 'id'>): Promise<ReworkEntry> {
    const { data, error } = await supabase.from('reworks').insert([entry]).select().single();
    if (error) throw error;
    return data;
  },

  async updateRework(id: number, entry: Partial<ReworkEntry>): Promise<ReworkEntry> {
    const { data, error } = await supabase.from('reworks').update(entry).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteRework(id: number): Promise<void> {
    const { error } = await supabase.from('reworks').delete().eq('id', id);
    if (error) throw error;
  }
};
