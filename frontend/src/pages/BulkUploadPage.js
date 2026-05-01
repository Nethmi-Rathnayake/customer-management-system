import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { bulkUploadService } from '../services/customerService';
import './BulkUploadPage.css';

const TEMPLATE_HEADERS = ['Name', 'Date of Birth', 'NIC Number', 'Mobile Numbers', 'Address Line 1', 'Address Line 2', 'City', 'Country'];
const SAMPLE_ROWS = [
  ['Amal Perera', '1990-03-15', '199003150123', '0771234567,0712345678', '45 Galle Road', 'Dehiwala', 'Colombo', 'Sri Lanka'],
  ['Nimal Fernando', '1985-07-22', '198507220456', '0759876543', '8 Kandy Road', '', 'Kandy', 'Sri Lanka'],
];

export default function BulkUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.match(/\.(xlsx|xls)$/i)) {
      alert('Only Excel files (.xlsx, .xls) are supported.');
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    setResult(null);

    try {
      const res = await bulkUploadService.uploadCustomers(file, (evt) => {
        if (evt.total) {
          setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });
      setResult(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setResult({ status: 'FAILED', errorMessage: msg });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Build a CSV template for download
    const rows = [TEMPLATE_HEADERS, ...SAMPLE_ROWS];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = {
    COMPLETED: 'success',
    PARTIAL: 'warning',
    FAILED: 'danger',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bulk Upload</h1>
          <p className="page-subtitle">Upload up to 1,000,000 customer records via Excel</p>
        </div>
        <Link to="/customers" className="btn btn-secondary">← Back to Customers</Link>
      </div>

      <div className="bulk-upload-grid">
        {/* Upload Panel */}
        <div>
          <div className="card mb-2">
            <div className="card-header">
              <h2 className="card-title">Upload Excel File</h2>
              <button className="btn btn-secondary btn-sm" onClick={downloadTemplate}>
                ⬇ Download Template
              </button>
            </div>

            {/* Drop Zone */}
            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
              {file ? (
                <div className="file-info">
                  <span style={{ fontSize: 32 }}>📊</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{file.name}</div>
                    <div className="text-muted text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                  >✕ Remove</button>
                </div>
              ) : (
                <div className="drop-placeholder">
                  <span style={{ fontSize: 40 }}>📂</span>
                  <div style={{ fontWeight: 600 }}>Drop Excel file here</div>
                  <div className="text-muted text-sm">or click to browse — .xlsx / .xls, max 200MB</div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-2">
                <div className="flex-between mb-1">
                  <span className="text-sm text-muted">Uploading file...</span>
                  <span className="text-sm font-mono">{uploadProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-sm text-muted mt-1">
                  ⏳ Processing large files may take several minutes. Please do not close this page.
                </p>
              </div>
            )}

            <div className="mt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading
                  ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Processing...</>
                  : '📤 Upload & Process'
                }
              </button>
            </div>
          </div>

          {/* Format Guide */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">File Format</h2>
            </div>
            <div className="format-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Field</th>
                    <th>Required</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="font-mono">A</td><td>Name</td><td><span className="badge badge-danger">Yes</span></td><td>Full name</td></tr>
                  <tr><td className="font-mono">B</td><td>Date of Birth</td><td><span className="badge badge-danger">Yes</span></td><td>yyyy-MM-dd or dd/MM/yyyy</td></tr>
                  <tr><td className="font-mono">C</td><td>NIC Number</td><td><span className="badge badge-danger">Yes</span></td><td>Must be unique</td></tr>
                  <tr><td className="font-mono">D</td><td>Mobile Numbers</td><td><span className="badge badge-primary">No</span></td><td>Comma-separated</td></tr>
                  <tr><td className="font-mono">E</td><td>Address Line 1</td><td><span className="badge badge-primary">No</span></td><td></td></tr>
                  <tr><td className="font-mono">F</td><td>Address Line 2</td><td><span className="badge badge-primary">No</span></td><td></td></tr>
                  <tr><td className="font-mono">G</td><td>City</td><td><span className="badge badge-primary">No</span></td><td>Must match master data</td></tr>
                  <tr><td className="font-mono">H</td><td>Country</td><td><span className="badge badge-primary">No</span></td><td>Must match master data</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div>
          {result ? (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Upload Result</h2>
                <span className={`badge badge-${statusColor[result.status] || 'primary'}`}>
                  {result.status}
                </span>
              </div>

              {result.errorMessage ? (
                <div className="alert alert-danger">
                  <strong>Upload Failed:</strong> {result.errorMessage}
                </div>
              ) : (
                <>
                  <div className="result-stats">
                    <div className="stat-box stat-success">
                      <div className="stat-value">{(result.successCount || 0).toLocaleString()}</div>
                      <div className="stat-label">Inserted</div>
                    </div>
                    <div className="stat-box stat-danger">
                      <div className="stat-value">{(result.failureCount || 0).toLocaleString()}</div>
                      <div className="stat-label">Failed</div>
                    </div>
                    <div className="stat-box stat-neutral">
                      <div className="stat-value">{(result.totalRows || 0).toLocaleString()}</div>
                      <div className="stat-label">Total Rows</div>
                    </div>
                    <div className="stat-box stat-neutral">
                      <div className="stat-value">{result.processingTimeMs ? `${(result.processingTimeMs / 1000).toFixed(1)}s` : '—'}</div>
                      <div className="stat-label">Time</div>
                    </div>
                  </div>

                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="flex-between mb-1">
                        <strong className="text-sm">Errors {result.errors.length > 999 ? '(showing first 1000)' : ''}</strong>
                      </div>
                      <div className="error-list">
                        <table>
                          <thead>
                            <tr>
                              <th>Row</th>
                              <th>NIC</th>
                              <th>Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.errors.map((err, i) => (
                              <tr key={i}>
                                <td className="font-mono text-sm">{err.rowNumber}</td>
                                <td className="font-mono text-sm">{err.nicNumber || '—'}</td>
                                <td className="text-sm" style={{ color: 'var(--color-danger)' }}>{err.errorMessage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="mt-2">
                    <Link to="/customers" className="btn btn-primary">
                      View Customers →
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Performance Notes</h2>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['🚀', 'Streaming parser', 'SAX-based Excel reading keeps memory usage flat even for 1M rows'],
                  ['⚡', 'Batch inserts', 'Records are inserted in batches of 500 for maximum throughput'],
                  ['✅', 'Validation', 'Each row is validated before insert — errors are collected, not aborted'],
                  ['🔁', 'Duplicate check', 'NICs already in DB and within the file itself are detected'],
                  ['💾', 'Rollback safety', 'Failed batches are reported individually without stopping the upload'],
                ].map(([icon, title, desc]) => (
                  <li key={title} className="flex gap-1" style={{ alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20, lineHeight: 1.4 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                      <div className="text-sm text-muted">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
