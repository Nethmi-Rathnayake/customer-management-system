import React from 'react';

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const pageSizes = [10, 20, 50, 100];

  // Safety checks - if values are undefined, show defaults
  const safeTotalElements = totalElements || 0;
  const safeCurrentPage = currentPage || 0;
  const safeTotalPages = totalPages || 0;
  const safePageSize = pageSize || 20;

  const start = safeTotalElements === 0 ? 0 : safeCurrentPage * safePageSize + 1;
  const end = Math.min((safeCurrentPage + 1) * safePageSize, safeTotalElements);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(0, safeCurrentPage - delta);
    const right = Math.min(safeTotalPages - 1, safeCurrentPage + delta);

    if (left > 0) { pages.push(0); if (left > 1) pages.push('...'); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < safeTotalPages - 1) {
      if (right < safeTotalPages - 2) pages.push('...');
      pages.push(safeTotalPages - 1);
    }
    return pages;
  };

  if (safeTotalPages <= 1 && safeTotalElements <= safePageSize) {
    return null;
  }

  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
      <div className="text-sm text-muted">
        {safeTotalElements === 0 ? 'No records' : `Showing ${start}–${end} of ${safeTotalElements.toLocaleString()}`}
      </div>

      <div className="pagination">
        <button onClick={() => onPageChange(0)} disabled={safeCurrentPage === 0}>«</button>
        <button onClick={() => onPageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 0}>‹</button>

        {getPageNumbers().map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} style={{ padding: '0 4px', color: 'var(--color-text-muted)' }}>…</span>
            : <button
                key={p}
                className={safeCurrentPage === p ? 'active' : ''}
                onClick={() => onPageChange(p)}
              >{p + 1}</button>
        )}

        <button onClick={() => onPageChange(safeCurrentPage + 1)} disabled={safeCurrentPage >= safeTotalPages - 1}>›</button>
        <button onClick={() => onPageChange(safeTotalPages - 1)} disabled={safeCurrentPage >= safeTotalPages - 1}>»</button>
      </div>

      {onPageSizeChange && (
        <div className="flex-center gap-1">
          <span className="text-sm text-muted">Rows:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '4px 8px' }}
            value={safePageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}