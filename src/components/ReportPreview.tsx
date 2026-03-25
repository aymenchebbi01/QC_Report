import React from 'react';
import logo from '../assets/logo.png';
import { ReportData } from '../types';

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
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        padding: '40px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%'
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'middle' }}>
                  <table style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'middle' }}>
                          <img src={logo} alt="Logo" style={{ height: '55px', width: 'auto', display: 'block' }} />
                        </td>
                        <td style={{ padding: '0 25px', verticalAlign: 'middle' }}>
                          <div style={{ width: '2px', height: '45px', backgroundColor: '#e2e8f0' }}></div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <div style={{
                            fontSize: '25px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            lineHeight: '1.3',
                            color: '#0f172a',
                            letterSpacing: '-0.01em',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap'
                          }}>
                            QUALITY INSPECTION
                          </div>
                          <div style={{
                            fontSize: '25px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            lineHeight: '1.3',
                            color: '#0f172a',
                            letterSpacing: '-0.01em'
                          }}>
                            REPORT
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
              {/* Thick Separator Line */}
              <tr>
                <td colSpan={2} style={{ padding: '35px 0 0 0' }}>
                  <div style={{ height: '3px', backgroundColor: '#0f172a', width: '100%' }}></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* General Information */}
        <section style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
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
                { l1: 'Set Number', v1: data.articleNumber, l2: 'Source', v2: data.supplier },
                { l1: 'Description', v1: data.articleDescription }

              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ width: '120px', padding: '12px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.02em' }}>{row.l1}</div>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#1e293b', verticalAlign: 'top' }}>{row.v1 || '---'}</td>
                  <td style={{ width: '120px', padding: '12px 0', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.02em' }}>{row.l2}</div>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#1e293b', verticalAlign: 'top' }}>{row.v2 || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Inspections Row */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '15px', pageBreakInside: 'avoid' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>Packaging Inspection</h2>
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
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>Article Test Results</h2>
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ border: '1px solid #e2e8f0', padding: '8px', textAlign: 'left', width: '30px' }}>Ref</th>
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
          </div>
        </div>

        {/* AQL Section */}
        <section style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
          <h2 style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>AQL Inspection Table</h2>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center' }}>Total Qty (N)</th>
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

        {/* Details Section */}
        <section style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
          <h2 style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>Inspection Details</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: '#fcfcfc' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Error Description</div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{data.errorDescription || 'No errors reported.'}</div>
            </div>
            <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: '#fcfcfc' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Missing Parts</div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{data.missingPartsDescription || 'None.'}</div>
            </div>
          </div>
        </section>

        {/* Evidence Section */}
        {data.images.length > 0 && (
          <section style={{ marginBottom: '15px' }}>
            <h2 style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '8px 15px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px' }}>Inspection Photographs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {data.images.map((img) => (
                <div key={img.id} style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#fcfcfc', pageBreakInside: 'avoid' }}>
                  <img src={img.url} alt="Evidence" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px', display: 'block' }} />
                  {img.caption && <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{img.caption}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Signature Section */}
        <section style={{ borderTop: '4px solid #0f172a', paddingTop: '30px', marginTop: '10px', pageBreakInside: 'avoid' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ marginBottom: '7px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Final Inspection Decision</div>
                    <div style={{ fontSize: '30px', fontWeight: '950', color: data.finalPassed === 'Yes' ? '#059669' : '#dc2626', lineHeight: '1' }}>
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
                    <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '7px', paddingBottom: '10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#3d3e3fff', textTransform: 'uppercase', textAlign: 'center', marginBottom: '15px' }}>Signature</div>
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
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>Quality Department</div>
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
