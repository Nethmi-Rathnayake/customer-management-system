import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { customerService, masterDataService } from '../services/customerService';
import MobileNumbersField from '../components/customers/MobileNumbersField';
import AddressesField from '../components/customers/AddressesField';
import FamilyMembersField from '../components/customers/FamilyMembersField';

const emptyForm = {
  name: '',
  dateOfBirth: null,
  nicNumber: '',
  mobileNumbers: [],
  addresses: [],
  familyMemberIds: [],
};

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [masterData, setMasterData] = useState({ countries: [], cities: [] });
  const [masterLoading, setMasterLoading] = useState(true);
  const [masterError, setMasterError] = useState(false);

  // Load master data (cities + countries) once
  useEffect(() => {
    setMasterLoading(true);
    setMasterError(false);
    masterDataService.getAll()
      .then(res => {
        // Safely extract — guard against unexpected response shapes
        const payload = res?.data?.data || res?.data || {};
        setMasterData({
          countries: Array.isArray(payload.countries) ? payload.countries : [],
          cities:    Array.isArray(payload.cities)    ? payload.cities    : [],
        });
      })
      .catch(() => {
        setMasterError(true);
        toast.error('Failed to load countries & cities. Please refresh the page.');
      })
      .finally(() => setMasterLoading(false));
  }, []);

  // Load existing customer data for edit
  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    customerService.getById(id)
      .then(res => {
        const c = res.data.data;
        setForm({
          name: c.name || '',
          dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : null,
          nicNumber: c.nicNumber || '',
          mobileNumbers: c.mobileNumbers || [],
          addresses: c.addresses || [],
          familyMemberIds: c.familyMembers ? c.familyMembers.map(f => f.id) : [],
        });
      })
      .catch(() => navigate('/customers'))
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!form.nicNumber.trim()) e.nicNumber = 'NIC number is required';
    else if (form.nicNumber.trim().length > 20) e.nicNumber = 'NIC must not exceed 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth
        ? form.dateOfBirth.toISOString().slice(0, 10)
        : null,
      nicNumber: form.nicNumber.trim(),
      mobileNumbers: form.mobileNumbers.filter(m => m.trim()),
      addresses: form.addresses,
      familyMemberIds: form.familyMemberIds,
    };

    try {
      if (isEdit) {
        await customerService.update(id, payload);
        toast.success('Customer updated successfully!');
      } else {
        await customerService.create(payload);
        toast.success('Customer created successfully!');
      }
      navigate('/customers');
    } catch (err) {
      if (err.response?.data?.data) {
        setErrors(err.response.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (fetching) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <span>Loading customer...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Customer' : 'Add Customer'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update customer information' : 'Create a new customer record'}
          </p>
        </div>
        <Link to="/customers" className="btn btn-secondary">← Back</Link>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="card mb-2">
          <div className="card-header">
            <h2 className="card-title">Basic Information</h2>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input
                className={`form-control ${errors.name ? 'error' : ''}`}
                value={form.name}
                onChange={e => set('name')(e.target.value)}
                placeholder="Enter full name"
                maxLength={200}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">Date of Birth</label>
              <DatePicker
                selected={form.dateOfBirth}
                onChange={set('dateOfBirth')}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                placeholderText="Select date..."
                maxDate={new Date()}
                className={`form-control ${errors.dateOfBirth ? 'error' : ''}`}
                wrapperClassName="w-full"
              />
              {errors.dateOfBirth && <div className="form-error">{errors.dateOfBirth}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">NIC Number</label>
              <input
                className={`form-control font-mono ${errors.nicNumber ? 'error' : ''}`}
                value={form.nicNumber}
                onChange={e => set('nicNumber')(e.target.value)}
                placeholder="e.g. 199001500123"
                maxLength={20}
              />
              {errors.nicNumber && <div className="form-error">{errors.nicNumber}</div>}
            </div>
          </div>
        </div>

        {/* Mobile Numbers */}
        <div className="card mb-2">
          <div className="card-header">
            <h2 className="card-title">Mobile Numbers</h2>
            <span className="text-sm text-muted">Optional — add one or more</span>
          </div>
          <MobileNumbersField
            values={form.mobileNumbers}
            onChange={set('mobileNumbers')}
          />
        </div>

        {/* Addresses */}
        <div className="card mb-2">
          <div className="card-header">
            <h2 className="card-title">Addresses</h2>
            <span className="text-sm text-muted">Optional — add one or more</span>
          </div>
          {masterError ? (
            <div style={{ padding: '16px', color: 'var(--danger)', fontSize: 14 }}>
              ⚠️ Could not load countries/cities. Check that the backend is running, then{' '}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
            </div>
          ) : masterLoading ? (
            <div className="loading-overlay" style={{ padding: 24 }}>
              <div className="spinner" />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading countries &amp; cities...</span>
            </div>
          ) : (
            <AddressesField
              values={form.addresses}
              onChange={set('addresses')}
              countries={masterData.countries}
              cities={masterData.cities}
            />
          )}
        </div>

        {/* Family Members */}
        <div className="card mb-2">
          <div className="card-header">
            <h2 className="card-title">Family Members</h2>
            <span className="text-sm text-muted">Optional — link existing customers</span>
          </div>
          <FamilyMembersField
            selectedIds={form.familyMemberIds}
            onChange={set('familyMemberIds')}
            excludeId={isEdit ? Number(id) : null}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
          <Link to="/customers" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
            ) : (
              isEdit ? '✓ Update Customer' : '+ Create Customer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}