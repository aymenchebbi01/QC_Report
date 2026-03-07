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
      <div style={{
        display: 'inline-block',
        color: isOk ? '#059669' : '#dc2626',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '1',
        verticalAlign: 'middle'
      }}>
        <span style={{ marginRight: '4px' }}>{isOk ? '✓' : '✕'}</span>
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div id="report-content" className="bg-white p-8 shadow-lg max-w-[210mm] mx-auto font-sans" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <table style={{ width: '100%', borderBottom: '2px solid #0f172a', marginBottom: '30px', paddingBottom: '20px' }}>
        <tbody>
          <tr>
            <td style={{ width: '60%', verticalAlign: 'middle' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={logo}
                  alt="Thermoplastics Logo"
                  style={{ height: '60px', width: 'auto', marginRight: '20px', display: 'block' }}
                />
                <div style={{ width: '2px', height: '40px', backgroundColor: '#e2e8f0' }}></div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  lineHeight: '1',
                  color: '#0f172a',
                  marginLeft: '20px',
                  margin: 0
                }}>
                  Quality Inspection<br />Test Report
                </h1>
              </div>
            </td>
            <td style={{ width: '40%', textAlign: 'right', verticalAlign: 'top' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', margin: '0 0 2px 0', textTransform: 'uppercase' }}>Report No.</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'monospace' }}>{data.reportNumber || '---'}</p>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', margin: '0 0 2px 0', textTransform: 'uppercase' }}>Date</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{data.testDate || '---'}</p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* General Information */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '15px'
        }}>General Information</h2>

        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '25%', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Article Number</span>
              </td>
              <td style={{ width: '25%', padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.articleNumber}</td>
              <td style={{ width: '25%', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Supplier</span>
              </td>
              <td style={{ width: '25%', padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.supplier}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Description</span>
              </td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.articleDescription}</td>
              <td style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Delivery Date</span>
              </td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.deliveryDate}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Order Number</span>
              </td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.orderNumber}</td>
              <td style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Lot Number</span>
              </td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.productionLot}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Reservation No.</span>
              </td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.reservationNumber}</td>
              <td style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>Quantity</span>
              </td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>{data.deliveryQuantity}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Packaging & Article Inspection */}
      <table style={{ width: '100%', marginBottom: '30px', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', paddingRight: '20px', width: '50%' }}>
              <h2 style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '15px'
              }}>Packaging Inspection</h2>
              <table style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0' }}>Visual Inspection</td>
                    <td style={{ textAlign: 'right' }}><StatusIcon status={data.packagingVisual} /></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0' }}>Completeness</td>
                    <td style={{ textAlign: 'right' }}><StatusIcon status={data.completeness} /></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0' }}>Assembly Instructions</td>
                    <td style={{ textAlign: 'right' }}><StatusIcon status={data.assemblyInstructions} /></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0' }}>Packaging Specifications</td>
                    <td style={{ textAlign: 'right' }}><StatusIcon status={data.packagingSpecifications} /></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={{ verticalAlign: 'top', paddingLeft: '20px', width: '50%' }}>
              <h2 style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '15px'
              }}>Article Inspection (Samples)</h2>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9' }}>
                    <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'left' }}>#</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>Weight</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>Function</th>
                  </tr>
                </thead>
                <tbody>
                  {data.articles.map((art) => (
                    <tr key={art.articleNumber}>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', fontWeight: 'bold' }}>{art.articleNumber}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}><StatusIcon status={art.weightTest} /></td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}><StatusIcon status={art.functionalTest} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* AQL Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '15px'
        }}>AQL Inspection Table</h2>
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Batch (N)</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Sample (n)</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>AQL</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Permitted</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Not Permitted</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Total Errors</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center', fontWeight: '500' }}>
              <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{data.batchQuantity}</td>
              <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{data.sampleQuantity}</td>
              <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{data.aqlValue}</td>
              <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{data.permittedErrors}</td>
              <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{data.notPermittedErrors}</td>
              <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{data.totalErrors}</td>
              <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: data.aqlPassed === 'Yes' ? '#d1fae5' : '#fee2e2',
                  color: data.aqlPassed === 'Yes' ? '#047857' : '#b91c1c',
                  fontWeight: 'bold'
                }}>
                  {data.aqlPassed === 'Yes' ? 'PASSED' : 'FAILED'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Defect Reporting */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '15px'
        }}>Defect Reporting</h2>
        <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: '10px' }}>
                <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '4px', backgroundColor: '#f8fafc', minHeight: '80px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Error Description</p>
                  <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0 }}>{data.errorDescription || 'No errors reported.'}</p>
                </div>
              </td>
              <td style={{ paddingLeft: '10px' }}>
                <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '4px', backgroundColor: '#f8fafc', minHeight: '80px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Missing Parts</p>
                  <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0 }}>{data.missingPartsDescription || 'None.'}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Inspection Evidence */}
      {data.images.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakBefore: 'always' }}>
          <h2 style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '4px 12px',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>Inspection Evidence</h2>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '10px' }}>
            <tbody>
              {Array.from({ length: Math.ceil(data.images.length / 2) }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {data.images.slice(rowIndex * 2, rowIndex * 2 + 2).map((img) => (
                    <td key={img.id} style={{ width: '50%', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                      <img src={img.url} alt="Evidence" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '2px', marginBottom: '8px', display: 'block' }} />
                      {img.caption && <p style={{ fontSize: '11px', fontStyle: 'italic', color: '#64748b', margin: 0 }}>{img.caption}</p>}
                    </td>
                  ))}
                  {data.images.slice(rowIndex * 2, rowIndex * 2 + 2).length === 1 && <td style={{ width: '50%' }}></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Final Result */}
      <section style={{ borderTop: '4px solid #0f172a', paddingTop: '24px', marginTop: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'bottom' }}>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Final Decision</p>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: '900',
                    color: data.finalPassed === 'Yes' ? '#059669' : '#dc2626',
                    margin: 0
                  }}>
                    {data.finalPassed === 'Yes' ? 'APPROVED' : 'REJECTED'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Inspector Comments</p>
                  <p style={{ fontSize: '13px', maxWidth: '450px', margin: 0 }}>{data.finalComments || 'No additional comments.'}</p>
                </div>
              </td>
              <td style={{ width: '200px', textAlign: 'right', verticalAlign: 'bottom' }}>
                <div style={{ float: 'right', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #cbd5e1', marginBottom: '10px', paddingBottom: '4px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>Signature</p>
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                      {data.finalInspectorName}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0' }}>{data.finalInspectorName}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Quality Assurance Inspector</p>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{data.finalDate}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};
