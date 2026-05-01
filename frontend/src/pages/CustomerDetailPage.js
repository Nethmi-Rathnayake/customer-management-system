import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerService } from '../services/customerService';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await customerService.getById(id);
        setCustomer(res.data.data);
      } catch {
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <span>Loading customer...</span>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex-center gap-1 mb-1">
            <Link to="/customers" className="text-muted text-sm">← Customers</Link>
          </div>
          <h1 className="page-title">{customer.name}</h1>
          <p className="page-subtitle font-mono text-sm">{customer.nicNumber}</p>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-secondary" onClick={() => navigate(`/customers/${id}/edit`)}>
            ✏️ Edit
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/customers/new')}>
            + New Customer
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Basic Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Basic Information</h3>
          </div>
          <DetailRow label="Full Name" value={customer.name} />
          <DetailRow label="NIC Number" value={customer.nicNumber} mono />
          <DetailRow label="Date of Birth" value={customer.dateOfBirth} />
          <DetailRow
            label="Created At"
            value={customer.createdAt ? new Date(customer.createdAt).toLocaleString() : '—'}
          />
          <DetailRow
            label="Last Updated"
            value={customer.updatedAt ? new Date(customer.updatedAt).toLocaleString() : '—'}
          />
        </div>

        {/* Mobile Numbers */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Mobile Numbers</h3>
            <span className="badge badge-primary">{customer.mobileNumbers?.length || 0}</span>
          </div>
          {customer.mobileNumbers?.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {customer.mobileNumbers.map((num, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>📱</span>
                  <span className="font-mono">{num}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-sm">No mobile numbers added.</p>
          )}
        </div>

        {/* Addresses */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3 className="card-title">Addresses</h3>
            <span className="badge badge-primary">{customer.addresses?.length || 0}</span>
          </div>
          {customer.addresses?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {customer.addresses.map((addr, i) => (
                <div key={i} style={{
                  padding: '14px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Address {i + 1}</div>
                  {addr.addressLine1 && <div>{addr.addressLine1}</div>}
                  {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                  {addr.cityName && <div>{addr.cityName}</div>}
                  {addr.countryName && (
                    <div style={{ marginTop: 4 }}>
                      <span className="badge badge-primary">{addr.countryName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">No addresses added.</p>
          )}
        </div>

        {/* Family Members */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3 className="card-title">Family Members</h3>
            <span className="badge badge-success">{customer.familyMembers?.length || 0}</span>
          </div>
          {customer.familyMembers?.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>NIC Number</th>
                    <th>Date of Birth</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.familyMembers.map(fm => (
                    <tr key={fm.id}>
                      <td style={{ fontWeight: 600 }}>{fm.name}</td>
                      <td className="font-mono">{fm.nicNumber}</td>
                      <td>{fm.dateOfBirth}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/customers/${fm.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-sm">No family members linked.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '9px 0',
      borderBottom: '1px solid var(--color-border)',
      gap: 12,
    }}>
      <span style={{ fontSize: 13, color: 'var(--color-text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{
        fontWeight: 500,
        textAlign: 'right',
        fontFamily: mono ? 'var(--font-mono)' : undefined,
      }}>{value || '—'}</span>
    </div>
  );
}
