import { ReportData, SavedReport } from "../types";

export const api = {
  async getReports(): Promise<SavedReport[]> {
    const res = await fetch("/api/reports");
    if (!res.ok) throw new Error("Failed to fetch reports");
    return res.json();
  },

  async getReport(id: number): Promise<SavedReport> {
    const res = await fetch(`/api/reports/${id}`);
    if (!res.ok) throw new Error("Failed to fetch report");
    return res.json();
  },

  async createReport(reportNumber: string, data: ReportData): Promise<{ id: number }> {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_number: reportNumber, data }),
    });
    if (!res.ok) throw new Error("Failed to create report");
    return res.json();
  },

  async updateReport(id: number, data: ReportData): Promise<void> {
    const res = await fetch(`/api/reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error("Failed to update report");
  },

  async deleteReport(id: number): Promise<void> {
    const res = await fetch(`/api/reports/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete report");
  }
};
