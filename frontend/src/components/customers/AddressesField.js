import React from 'react';

const emptyAddress = () => ({
  addressLine1: '',
  addressLine2: '',
  cityId: '',
  countryId: '',
});

export default function AddressesField({ values = [], onChange, countries = [], cities = [] }) {
  const add = () => onChange([...values, emptyAddress()]);
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const updated = values.map((addr, idx) => {
      if (idx !== i) return addr;
      const next = { ...addr, [field]: val };
      // When country changes, reset city selection
      if (field === 'countryId') next.cityId = '';
      return next;
    });
    onChange(updated);
  };

  // Returns cities that belong to the given countryId.
  // Returns empty array when no country is selected so the City dropdown
  // shows only the placeholder until a Country is chosen.
  const getCitiesForCountry = (countryId) => {
    if (!countryId) return [];
    return cities.filter(c => String(c.parentId) === String(countryId));
  };

  return (
    <div>
      {values.length === 0 && (
        <p className="text-sm text-muted mb-1">No addresses added.</p>
      )}

      {values.map((addr, i) => {
        const availableCities = getCitiesForCountry(addr.countryId);

        return (
          <div key={i} style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            marginBottom: '12px',
            background: 'var(--color-bg)',
          }}>
            <div className="flex-between mb-1">
              <strong className="text-sm">Address {i + 1}</strong>
              <button
                type="button"
                className="btn btn-danger btn-sm btn-icon"
                onClick={() => remove(i)}
                title="Remove address"
              >✕</button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Address Line 1</label>
                <input
                  className="form-control"
                  value={addr.addressLine1 || ''}
                  onChange={e => update(i, 'addressLine1', e.target.value)}
                  placeholder="Street address..."
                  maxLength={255}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address Line 2</label>
                <input
                  className="form-control"
                  value={addr.addressLine2 || ''}
                  onChange={e => update(i, 'addressLine2', e.target.value)}
                  placeholder="Apartment, suite..."
                  maxLength={255}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  className="form-control"
                  value={addr.countryId || ''}
                  onChange={e => update(i, 'countryId', e.target.value)}
                >
                  <option value="">— Select Country —</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <select
                  className="form-control"
                  value={addr.cityId || ''}
                  onChange={e => update(i, 'cityId', e.target.value)}
                  disabled={!addr.countryId || availableCities.length === 0}
                >
                  <option value="">
                    {!addr.countryId
                      ? '— Select Country first —'
                      : availableCities.length === 0
                        ? '— No cities available —'
                        : '— Select City —'}
                  </option>
                  {availableCities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      })}

      <button type="button" className="btn btn-secondary btn-sm" onClick={add}>
        + Add Address
      </button>
    </div>
  );
}