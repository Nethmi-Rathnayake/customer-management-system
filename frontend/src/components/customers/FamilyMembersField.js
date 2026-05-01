import React, { useState, useEffect, useCallback } from 'react';
import { customerService } from '../../services/customerService';

let debounceTimer;

export default function FamilyMembersField({ selectedIds = [], onChange, excludeId }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]); // full objects for display
  const [searching, setSearching] = useState(false);

  // Load initial selected customers when editing
  useEffect(() => {
    if (!selectedIds.length) { setSelected([]); return; }
    Promise.all(selectedIds.map(id => customerService.getById(id)))
      .then(responses => setSelected(responses.map(r => r.data.data)))
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doSearch = useCallback(async (query) => {
    if (!query.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await customerService.getAll({ name: query, size: 10 });
      const filtered = res.data.data.content.filter(c =>
        c.id !== excludeId && !selectedIds.includes(c.id)
      );
      setResults(filtered);
    } catch (e) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [excludeId, selectedIds]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doSearch(val), 350);
  };

  const addMember = (customer) => {
    const newSelected = [...selected, customer];
    setSelected(newSelected);
    onChange(newSelected.map(c => c.id));
    setSearch('');
    setResults([]);
  };

  const removeMember = (id) => {
    const newSelected = selected.filter(c => c.id !== id);
    setSelected(newSelected);
    onChange(newSelected.map(c => c.id));
  };

  return (
    <div>
      {/* Selected list */}
      {selected.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {selected.map(c => (
            <div key={c.id} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--color-primary-light)',
              border: '1px solid var(--color-primary)',
              borderRadius: 100,
              padding: '4px 10px 4px 12px',
              fontSize: 13,
              marginRight: 6,
              marginBottom: 6,
            }}>
              <span style={{ fontWeight: 500 }}>{c.name}</span>
              <span className="text-muted font-mono" style={{ fontSize: 11 }}>{c.nicNumber}</span>
              <button
                type="button"
                onClick={() => removeMember(c.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 700, fontSize: 14, padding: '0 2px' }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div style={{ position: 'relative', maxWidth: 360 }}>
        <input
          className="form-control"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by customer name..."
        />
        {searching && (
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          </span>
        )}

        {results.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 50,
            maxHeight: 220,
            overflowY: 'auto',
          }}>
            {results.map(c => (
              <div
                key={c.id}
                onClick={() => addMember(c)}
                style={{
                  padding: '9px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  borderBottom: '1px solid var(--color-border)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <span style={{ fontWeight: 500 }}>{c.name}</span>
                <span className="text-muted font-mono text-sm">{c.nicNumber}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected.length === 0 && (
        <p className="text-sm text-muted mt-1">
          Type a name above to search and link existing customers as family members.
        </p>
      )}
    </div>
  );
}
