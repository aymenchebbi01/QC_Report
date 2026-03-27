export interface InspectionImage {
  id: string;
  url: string;
  caption: string;
}

export interface ArticleInspection {
  articleNumber: string;
  weightTest: 'OK' | 'NOK';
  functionalTest: 'OK' | 'NOK';
  notes: string;
}

export interface ReportData {
  // General Information
  reportNumber: string;
  articleNumber: string;
  articleDescription: string;
  reservationNumber: string;
  orderNumber: string;
  supplier: string;
  deliveryDate: string;
  productionLot: string;
  deliveryQuantity: string;
  examiner: string;
  testDate: string;

  // Packaging Inspection
  packagingVisual: 'OK' | 'NOK';
  completeness: 'OK' | 'NOK';
  assemblyInstructions: 'Yes' | 'No';
  packagingSpecifications: 'Yes' | 'No';

  // Article Inspection
  articles: ArticleInspection[];

  // Defect Reporting
  errorDescription: string;
  missingPartsDescription: string;
  inspectorComments: string;

  // AQL Inspection
  batchQuantity: string;
  sampleQuantity: string;
  aqlValue: string;
  permittedErrors: string;
  notPermittedErrors: string;
  totalErrors: string;
  aqlPassed: 'Yes' | 'No';
  aqlTesterName: string;
  aqlComments: string;

  // Final Result
  finalPassed: 'Yes' | 'No';
  finalComments: string;
  finalInspectorName: string;
  signature: string; // base64
  finalDate: string;

  // Images
  images: InspectionImage[];
}

export interface SavedReport {
  id: number;
  report_number: string;
  data: ReportData;
  created_at: string;
  updated_at: string;
}

// ─── Reclamation ────────────────────────────────────────────────
export interface Reclamation {
  id: number;
  set: string;
  reference: string;
  description: string;
  defaut: string;
  quantite: string;
  taux: string;
  remarque: string;
  setImage: string | null;
  galleryImages: (string | null)[];
  reworkId?: number; // linked rework id when completed
}

// ─── Rework ─────────────────────────────────────────────────────
export interface ReworkEntry {
  id: number;
  reclamationId?: number;
  vrRef: string;
  week: string;        // new: week number
  date: string;
  prPu: string;
  mtGr: string;
  setNumber: string;
  partNo: string;
  description: string;
  quantity: string;
  comments: string;
  percent: string;
  approved: string;
  reworkForm: string;
  decision: string;
  quantityReturned: string;
  status: string;      // new: status field
  weekTrailer: string;
  trailerNumber: string;
  deliveryNoteTN: string;
  quota: string;
  orderNumber2: string;
  quantityReceived: string;
}
