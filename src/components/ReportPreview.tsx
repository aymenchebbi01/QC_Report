import React from 'react';
import logo from '../assets/logo.png';
import { ReportData } from '../types';
import { Check, X } from 'lucide-react';

interface ReportPreviewProps {
  data: ReportData;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data }) => {
  const StatusIcon = ({ status }: { status: 'OK' | 'NOK' | 'Yes' | 'No' }) => {
    const isOk = status === 'OK' || status === 'Yes';
    return (
      <div className={`flex items-center gap-1 font-bold`} style={{ color: isOk ? '#059669' : '#dc2626' }}>
        {isOk ? <Check size={16} /> : <X size={16} />}
        {status}
      </div>
    );
  };

  return (
    <div id="report-content" className="bg-white p-8 shadow-lg max-w-[210mm] mx-auto font-sans border border-slate-200" style={{ color: '#1e293b' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 pb-6 mb-8" style={{ borderColor: '#0f172a' }}>
        <div className="flex items-center">
          <div className="mr-6">
            <img
              src={logo}
              alt="Thermoplastics Logo"
              className="h-16 w-auto block flex-shrink-0"
              style={{ display: 'block', height: '64px', width: 'auto', flexShrink: 0 }}
            />
          </div>
          <div className="h-12 w-[2px] bg-slate-200" style={{ backgroundColor: '#e2e8f0' }}></div>
          <div className="ml-6 flex-1">
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight" style={{ color: '#0f172a', margin: 0 }}>
              Quality Inspection Test Report
            </h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase" style={{ color: '#64748b', margin: 0 }}>Report No.</p>
          <p className="text-xl font-mono font-bold" style={{ color: '#0f172a', margin: 0 }}>{data.reportNumber || '---'}</p>
          <p className="text-sm mt-2 font-bold uppercase" style={{ color: '#64748b', margin: 0 }}>Date</p>
          <p className="font-bold" style={{ color: '#0f172a', margin: 0 }}>{data.testDate || '---'}</p>
        </div>
      </div>

      {/* General Information */}
      <section className="mb-8">
        <h2 className="px-3 py-1 text-sm font-bold uppercase mb-4" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>General Information</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Article Number</span>
            <span className="font-medium">{data.articleNumber}</span>
          </div>
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Supplier</span>
            <span className="font-medium">{data.supplier}</span>
          </div>
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Description</span>
            <span className="font-medium">{data.articleDescription}</span>
          </div>
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Delivery Date</span>
            <span className="font-medium">{data.deliveryDate}</span>
          </div>
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Order Number</span>
            <span className="font-medium">{data.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Lot Number</span>
            <span className="font-medium">{data.productionLot}</span>
          </div>
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Reservation No.</span>
            <span className="font-medium">{data.reservationNumber}</span>
          </div>
          <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f1f5f9' }}>
            <span className="font-bold uppercase text-[10px]" style={{ color: '#64748b' }}>Quantity</span>
            <span className="font-medium">{data.deliveryQuantity}</span>
          </div>
        </div>
      </section>

      {/* Packaging & Article Inspection */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <section>
          <h2 className="px-3 py-1 text-sm font-bold uppercase mb-4" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Packaging Inspection</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>Visual Inspection</span>
              <StatusIcon status={data.packagingVisual} />
            </div>
            <div className="flex justify-between items-center">
              <span>Completeness</span>
              <StatusIcon status={data.completeness} />
            </div>
            <div className="flex justify-between items-center">
              <span>Assembly Instructions</span>
              <StatusIcon status={data.assemblyInstructions} />
            </div>
            <div className="flex justify-between items-center">
              <span>Packaging Specifications</span>
              <StatusIcon status={data.packagingSpecifications} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="px-3 py-1 text-sm font-bold uppercase mb-4" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Article Inspection (Samples)</h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th className="border p-1 text-left">#</th>
                <th className="border p-1 text-left">Weight</th>
                <th className="border p-1 text-left">Function</th>
              </tr>
            </thead>
            <tbody>
              {data.articles.map((art) => (
                <tr key={art.articleNumber}>
                  <td className="border p-1 font-bold">{art.articleNumber}</td>
                  <td className="border p-1"><StatusIcon status={art.weightTest} /></td>
                  <td className="border p-1"><StatusIcon status={art.functionalTest} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* AQL Section */}
      <section className="mb-8">
        <h2 className="px-3 py-1 text-sm font-bold uppercase mb-4" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>AQL Inspection Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead style={{ backgroundColor: '#f1f5f9' }}>
              <tr>
                <th className="border p-2">Batch (N)</th>
                <th className="border p-2">Sample (n)</th>
                <th className="border p-2">AQL</th>
                <th className="border p-2">Permitted</th>
                <th className="border p-2">Not Permitted</th>
                <th className="border p-2">Total Errors</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center font-medium">
                <td className="border p-2">{data.batchQuantity}</td>
                <td className="border p-2">{data.sampleQuantity}</td>
                <td className="border p-2">{data.aqlValue}</td>
                <td className="border p-2">{data.permittedErrors}</td>
                <td className="border p-2">{data.notPermittedErrors}</td>
                <td className="border p-2">{data.totalErrors}</td>
                <td className="border p-2">
                  <span className={`px-2 py-0.5 rounded`} style={{
                    backgroundColor: data.aqlPassed === 'Yes' ? '#d1fae5' : '#fee2e2',
                    color: data.aqlPassed === 'Yes' ? '#047857' : '#b91c1c'
                  }}>
                    {data.aqlPassed === 'Yes' ? 'PASSED' : 'FAILED'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Defect Reporting */}
      <section className="mb-8">
        <h2 className="px-3 py-1 text-sm font-bold uppercase mb-4" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Defect Reporting</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="border p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: '#64748b' }}>Error Description</p>
            <p className="italic">{data.errorDescription || 'No errors reported.'}</p>
          </div>
          <div className="border p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: '#64748b' }}>Missing Parts</p>
            <p className="italic">{data.missingPartsDescription || 'None.'}</p>
          </div>
        </div>
      </section>

      {/* Inspection Evidence */}
      {data.images.length > 0 && (
        <section className="mb-8 break-before-page">
          <h2 className="px-3 py-1 text-sm font-bold uppercase mb-4" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Inspection Evidence</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.images.map((img) => (
              <div key={img.id} className="border p-2 rounded">
                <img src={img.url} alt="Evidence" className="w-full h-48 object-cover rounded mb-2" referrerPolicy="no-referrer" />
                {img.caption && <p className="text-xs text-center italic" style={{ color: '#64748b' }}>{img.caption}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final Result */}
      <section className="border-t-4 pt-6 mt-12" style={{ borderColor: '#0f172a' }}>
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase" style={{ color: '#64748b' }}>Final Decision</p>
              <p className={`text-3xl font-black`} style={{ color: data.finalPassed === 'Yes' ? '#059669' : '#dc2626' }}>
                {data.finalPassed === 'Yes' ? 'APPROVED' : 'REJECTED'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase" style={{ color: '#64748b' }}>Inspector Comments</p>
              <p className="text-sm max-w-md">{data.finalComments || 'No additional comments.'}</p>
            </div>
          </div>
          <div className="text-right space-y-6">
            <div className="border-b pb-1 w-48 ml-auto" style={{ borderColor: '#cbd5e1' }}>
              <p className="text-[10px] font-bold uppercase text-center" style={{ color: '#64748b' }}>Signature</p>
              <div className="h-12 flex items-center justify-center italic" style={{ color: '#94a3b8' }}>
                {data.finalInspectorName}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">{data.finalInspectorName}</p>
              <p className="text-xs uppercase" style={{ color: '#64748b' }}>Quality Assurance Inspector</p>
              <p className="text-xs" style={{ color: '#64748b' }}>{data.finalDate}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
