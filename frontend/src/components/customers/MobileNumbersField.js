import React from 'react';

export default function MobileNumbersField({ values = [], onChange }) {
  const add = () => onChange([...values, '']);
  const update = (i, val) => {
    const updated = [...values];
    updated[i] = val;
    onChange(updated);
  };
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div>
      {values.length === 0 && (
        <p className="text-sm text-muted mb-1">No mobile numbers added.</p>
      )}
      {values.map((num, i) => (
        <div key={i} className="flex gap-1 mb-1" style={{ alignItems: 'center' }}>
          <input
            className="form-control font-mono"
            value={num}
            onChange={e => update(i, e.target.value)}
            placeholder="e.g. 0771234567"
            maxLength={20}
          />
          <button
            type="button"
            className="btn btn-danger btn-sm btn-icon"
            onClick={() => remove(i)}
            title="Remove"
          >✕</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={add}>
        + Add Mobile Number
      </button>
    </div>
  );
}
