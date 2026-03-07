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
      <span style={{
        color: isOk ? '#059669' : '#dc2626',
        fontWeight: 'bold',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        display: 'inline-block'
      }}>
        {isOk ? '✓ OK' : '✕ NOK'}
      </span>
    );
  };

  return (
    <div id="report-content" className="bg-white p-10 mx-auto" style={{
      width: '794px',
      minHeight: '1123px',
      color: '#1e293b',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <table style={{ width: '100%', marginBottom: '40px', borderBottom: '2px solid #0f172a', paddingBottom: '20px' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'middle' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td>
                      <img src={logo} alt="Logo" style={{ height: '55px', width: 'auto', display: 'block' }} />
                    </td>
                    <td style={{ padding: '0 25px' }}>
                      <div style={{ width: '2px', height: '45px', backgroundColor: '#e2e8f0' }}></div>
                    </td>
                    <td>
                      <h1 style={{
                        fontSize: '26px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        lineHeight: '1.1',
                        color: '#0f172a',
                        margin: 0,
                        letterSpacing: '-0.02em'
                      }}>
                        Quality Inspection<br />Test Report
                      </h1>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={{ textAlign: 'right', verticalAlign: 'top', width: '180px' }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', margin: 0, textTransform: 'uppercase' }}>Report No.</p>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0, fontFamily: 'monospace' }}>{data.reportNumber || '---'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', margin: 0, textTransform: 'uppercase' }}>Date</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{data.testDate || '---'}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* General Information */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '6px 15px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '20px',
          letterSpacing: '0.05em'
        }}>General Information</h2>

        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              { l1: 'Article Number', v1: data.articleNumber, l2: 'Supplier', v2: data.supplier },
              { l1: 'Description', v1: data.articleDescription, l2: 'Delivery Date', v2: data.deliveryDate },
              { l1: 'Order Number', v1: data.orderNumber, l2: 'Lot Number', v2: data.productionLot },
              { l1: 'Reservation No.', v1: data.reservationNumber, l2: 'Quantity', v2: data.deliveryQuantity }
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ width: '140px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>{row.l1}</span>
                </td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#334155' }}>{row.v1}</td>
                <td style={{ width: '140px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>{row.l2}</span>
                </td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#334155' }}>{row.v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Main Inspections Section */}
      <table style={{ width: '100%', marginBottom: '40px', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', paddingRight: '20px' }}>
              <h2 style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '6px 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '15px'
              }}>Packaging Inspection</h2>
              <table style={{ width: '100%', fontSize: '13px' }}>
                <tbody>
                  {[
                    { l: 'Visual Inspection', v: data.packagingVisual },
                    { l: 'Completeness', v: data.completeness },
                    { l: 'Assembly Instructions', v: data.assemblyInstructions },
                    { l: 'Packaging Specifications', v: data.packagingSpecifications }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: '8px 0', color: '#475569' }}>{row.l}</td>
                      <td style={{ textAlign: 'right', padding: '8px 0' }}><StatusIcon status={row.v} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>
              <h2 style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '6px 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '15px'
              }}>Article Test Results</h2>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ border: '1px solid #e2e8f0', padding: '6px', textAlign: 'left', width: '30px' }}>#</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '6px', textAlign: 'center' }}>Weight</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '6px', textAlign: 'center' }}>Function</th>
                  </tr>
                </thead>
                <tbody>
                  {data.articles.map((art) => (
                    <tr key={art.articleNumber}>
                      <td style={{ border: '1px solid #e2e8f0', padding: '6px', fontWeight: 'bold' }}>{art.articleNumber}</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '6px', textAlign: 'center' }}><StatusIcon status={art.weightTest} /></td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '6px', textAlign: 'center' }}><StatusIcon status={art.functionalTest} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* AQL Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '6px 15px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '15px'
        }}>AQL Inspection Table</h2>
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>Batch (N)</th>
              <th style={{ border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>Sample (n)</th>
              <th style={{ border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>AQL</th>
              <th style={{ border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>Total Errors</th>
              <th style={{ border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}>
              <td style={{ border: '1px solid #e2e8f0', padding: '10px' }}>{data.batchQuantity}</td>
              <td style={{ border: '1px solid #e2e8f0', padding: '10px' }}>{data.sampleQuantity}</td>
              <td style={{ border: '1px solid #e2e8f0', padding: '10px' }}>{data.aqlValue}</td>
              <td style={{ border: '1px solid #e2e8f0', padding: '10px' }}>{data.totalErrors}</td>
              <td style={{ border: '1px solid #e2e8f0', padding: '10px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: data.aqlPassed === 'Yes' ? '#ecfdf5' : '#fef2f2',
                  color: data.aqlPassed === 'Yes' ? '#059669' : '#dc2626',
                  fontSize: '10px',
                  fontWeight: '900',
                  textTransform: 'uppercase'
                }}>
                  {data.aqlPassed === 'Yes' ? 'Passed' : 'Failed'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Defect Description */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '6px 15px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '15px'
        }}>Inspection Details</h2>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '10px 0' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: '#fcfcfc' }}>
                <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Error Description</p>
                <p style={{ fontSize: '13px', margin: 0, color: '#334155', lineHeight: '1.5' }}>{data.errorDescription || 'No errors reported during this inspection.'}</p>
              </td>
              <td style={{ verticalAlign: 'top', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: '#fcfcfc' }}>
                <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Missing Parts</p>
                <p style={{ fontSize: '13px', margin: 0, color: '#334155', lineHeight: '1.5' }}>{data.missingPartsDescription || 'All parts accounted for.'}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Evidence Section */}
      {data.images.length > 0 && (
        <section style={{ marginBottom: '40px', pageBreakBefore: 'always' }}>
          <h2 style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '6px 15px',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>Inspection Photographs</h2>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '15px' }}>
            <tbody>
              {Array.from({ length: Math.ceil(data.images.length / 2) }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {data.images.slice(rowIndex * 2, rowIndex * 2 + 2).map((img) => (
                    <td key={img.id} style={{ width: '50%', border: '1px solid #f1f5f9', padding: '10px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                      <img src={img.url} alt="Evidence" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px', display: 'block' }} />
                      {img.caption && <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', margin: 0 }}>{img.caption}</p>}
                    </td>
                  ))}
                  {data.images.slice(rowIndex * 2, rowIndex * 2 + 2).length === 1 && <td style={{ width: '50%' }}></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Signature Section */}
      <section style={{ borderTop: '4px solid #0f172a', paddingTop: '30px', marginTop: '50px' }}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'bottom' }}>
                <div style={{ marginBottom: '25px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Final Approval</p>
                  <p style={{
                    fontSize: '36px',
                    fontWeight: '950',
                    color: data.finalPassed === 'Yes' ? '#059669' : '#dc2626',
                    margin: 0,
                    letterSpacing: '-0.05em'
                  }}>
                    {data.finalPassed === 'Yes' ? 'PASSED' : 'REJECTED'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Comments</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', maxWidth: '450px', margin: 0, color: '#334155' }}>{data.finalComments || 'Inspection completed successfully with no major non-conformities.'}</p>
                </div>
              </td>
              <td style={{ width: '220px', textAlign: 'right', verticalAlign: 'bottom' }}>
                <div style={{ display: 'inline-block', width: '220px' }}>
                  <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '12px', paddingBottom: '5px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center', marginBottom: '15px' }}>Authorized Signature</p>
                    <div style={{ height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '20px', fontFamily: '"Brush Script MT", cursive' }}>
                      {data.finalInspectorName}
                    </div>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 2px 0', color: '#0f172a' }}>{data.finalInspectorName}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 2px 0' }}>QA Department</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{data.finalDate}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};
