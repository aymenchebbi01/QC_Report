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
        fontSize: '11px',
        whiteSpace: 'nowrap'
      }}>
        {isOk ? '✓ OK' : '✕ NOK'}
      </span>
    );
  };

  return (
    <div
      id="report-content"
      style={{
        width: '794px',
        minHeight: '1123px',
        backgroundColor: '#ffffff',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '40px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Header Section */}
        <table style={{ width: '100%', marginBottom: '40px', borderBottom: '3px solid #0f172a', paddingBottom: '25px', borderCollapse: 'collapse' }}>
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
                        <div style={{
                          fontSize: '28px',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                          color: '#0f172a',
                          letterSpacing: '-0.01em'
                        }}>
                          QUALITY INSPECTION
                        </div>
                        <div style={{
                          fontSize: '28px',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                          color: '#0f172a',
                          letterSpacing: '-0.01em'
                        }}>
                          TEST REPORT
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style={{ textAlign: 'right', verticalAlign: 'top', width: '220px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'right', paddingBottom: '12px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Report No.</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace', lineHeight: '1.1' }}>{data.reportNumber || '---'}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Date</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', lineHeight: '1.1' }}>{data.testDate || '---'}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* General Information */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 15px',
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
                  <td style={{ width: '120px', padding: '12px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.02em' }}>{row.l1}</div>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#1e293b', verticalAlign: 'top' }}>{row.v1 || '---'}</td>
                  <td style={{ width: '120px', padding: '12px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.02em' }}>{row.l2}</div>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#1e293b', verticalAlign: 'top' }}>{row.v2 || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Main Inspections Section */}
        <table style={{ width: '100%', marginBottom: '40px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', paddingRight: '20px', width: '50%' }}>
                <h2 style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '8px 15px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  marginBottom: '15px'
                }}>Packaging Inspection</h2>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      { l: 'Visual Inspection', v: data.packagingVisual },
                      { l: 'Completeness', v: data.completeness },
                      { l: 'Assembly Instructions', v: data.assemblyInstructions },
                      { l: 'Packaging Specifications', v: data.packagingSpecifications }
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: '10px 0', color: '#475569', borderBottom: '1px solid #f8fafc' }}>{row.l}</td>
                        <td style={{ textAlign: 'right', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}><StatusIcon status={row.v} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td style={{ verticalAlign: 'top', paddingLeft: '20px', width: '50%' }}>
                <h2 style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '8px 15px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  marginBottom: '15px'
                }}>Article Test Results</h2>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'left', width: '30px' }}>#</th>
                      <th style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>Weight</th>
                      <th style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.articles.map((art) => (
                      <tr key={art.articleNumber}>
                        <td style={{ border: '1px solid #e2e8f0', padding: '8px', fontWeight: 'bold' }}>{art.articleNumber}</td>
                        <td style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}><StatusIcon status={art.weightTest} /></td>
                        <td style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}><StatusIcon status={art.functionalTest} /></td>
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
            padding: '8px 15px',
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>AQL Inspection Table</h2>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>Batch (N)</th>
                <th style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>Sample (n)</th>
                <th style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>AQL</th>
                <th style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>Total Errors</th>
                <th style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ textAlign: 'center', fontWeight: '600', color: '#1e293b' }}>
                <td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>{data.batchQuantity}</td>
                <td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>{data.sampleQuantity}</td>
                <td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>{data.aqlValue}</td>
                <td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>{data.totalErrors}</td>
                <td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '5px 15px',
                    borderRadius: '4px',
                    backgroundColor: data.aqlPassed === 'Yes' ? '#ecfdf5' : '#fef2f2',
                    color: data.aqlPassed === 'Yes' ? '#059669' : '#dc2626',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {data.aqlPassed === 'Yes' ? 'Passed' : 'Failed'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Inspection Details Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '8px 15px',
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>Inspection Details</h2>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '10px 0' }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'top', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: '#fcfcfc', width: '50%' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Error Description</div>
                  <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{data.errorDescription || 'No errors reported during this inspection.'}</div>
                </td>
                <td style={{ verticalAlign: 'top', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: '#fcfcfc', width: '50%' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Missing Parts</div>
                  <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{data.missingPartsDescription || 'All parts accounted for.'}</div>
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
              padding: '8px 15px',
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
                      <td key={img.id} style={{ width: '50%', border: '1px solid #f1f5f9', padding: '12px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#fcfcfc' }}>
                        <img src={img.url} alt="Evidence" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px', display: 'block' }} />
                        {img.caption && <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{img.caption}</div>}
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
        <section style={{ borderTop: '4px solid #0f172a', paddingTop: '40px', marginTop: '60px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Final Inspection Decision</div>
                    <div style={{
                      fontSize: '42px',
                      fontWeight: '950',
                      color: data.finalPassed === 'Yes' ? '#059669' : '#dc2626',
                      lineHeight: '1'
                    }}>
                      {data.finalPassed === 'Yes' ? 'APPROVED' : 'REJECTED'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Inspector Remarks</div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', maxWidth: '450px', color: '#475569' }}>{data.finalComments || 'Inspection process completed according to standards.'}</div>
                  </div>
                </td>
                <td style={{ width: '240px', textAlign: 'right', verticalAlign: 'bottom' }}>
                  <div style={{ display: 'inline-block', width: '220px', textAlign: 'left' }}>
                    <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '15px', paddingBottom: '10px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', textAlign: 'center', marginBottom: '25px' }}>Authentication Signature</div>
                      <div style={{
                        height: '50px',
                        textAlign: 'center',
                        lineHeight: '50px',
                        color: '#0f172a',
                        fontSize: '24px',
                        fontFamily: '"Brush Script MT", cursive',
                        opacity: 1
                      }}>
                        {data.finalInspectorName}
                      </div>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>{data.finalInspectorName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>QA Department</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{data.finalDate}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
