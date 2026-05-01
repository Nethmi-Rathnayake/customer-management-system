import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customerService } from '../services/customerService';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import './CustomerListPage.css';

const STAT_CARDS = (total) => [
  { label: 'TOTAL CUSTOMERS', value: total.toLocaleString(), trend: '↑ 12% from last month', trendColor: '#16A34A', icon: '👥' },
  { label: 'ACTIVE UPLOADS',  value: '8', icon: '📤' },
  { label: 'PENDING REVIEWS', value: '24', icon: '⏳' },
  { label: 'DATABASE LOAD',   value: '42%', icon: '💾' },
];

export default function CustomerListPage() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const [nameFilter, setNameFilter] = useState('');
  const [nicFilter, setNicFilter] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchNic, setSearchNic] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerService.getAll({
        page, size: pageSize, sortBy, sortDir,
        name: searchName || undefined,
        nicNumber: searchNic || undefined,
      });
      
      // Extract data from backend response structure
      const responseData = res.data;
      if (responseData.success) {
        const pageData = responseData.data;
        setCustomers(pageData.content || []);
        setTotalPages(pageData.totalPages || 0);
        setTotalElements(pageData.totalElements || 0);
      } else {
        setCustomers([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setCustomers([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortDir, searchName, searchNic]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchName(nameFilter);
    setSearchNic(nicFilter);
    setPage(0);
  };

  const handleClearSearch = () => {
    setNameFilter(''); setNicFilter('');
    setSearchName(''); setSearchNic('');
    setPage(0);
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
    setPage(0);
  };

  const sortIcon = (col) => {
    if (sortBy !== col) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customerService.delete(deleteTarget.id);
      toast.success(`Customer "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
      fetchCustomers();
    } catch (err) {
      // handled by interceptor
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Stats Row */}
      <div className="stats-grid">
        {STAT_CARDS(totalElements).map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{loading && i === 0 ? '…' : s.value}</div>
            {s.trend && <div className="stat-card-trend" style={{ color: s.trendColor }}>{s.trend}</div>}
          </div>
        ))}
      </div>

      {/* Recent Customers Table */}
      <div className="dashboard-section">
        <div className="dash-table-header">
          <h2 className="dash-section-title">Recent Customers</h2>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/customers/new')}>
            + Add New
          </button>
        </div>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-field">
            <SearchIcon />
            <input
              type="text"
              className="search-input"
              placeholder="Search by customer name..."
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <div className="search-field">
            <NicIcon />
            <input
              type="text"
              className="search-input"
              placeholder="Search by NIC number..."
              value={nicFilter}
              onChange={e => setNicFilter(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
          {(searchName || searchNic) && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClearSearch}>Clear</button>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/bulk-upload')}>
              📤 Bulk Upload
            </button>
          </div>
        </form>

        {/* Table */}
        {loading ? (
          <div className="loading-overlay" style={{ padding: 40 }}>
            <div className="spinner" />
            <span style={{ color: 'var(--text-muted)' }}>Loading customers...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="loading-overlay" style={{ padding: 60 }}>
            <div style={{ fontSize: 48 }}>👤</div>
            <p style={{ fontWeight: 700, fontSize: 16 }}>No customers found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {searchName || searchNic ? 'Try adjusting your filters.' : 'Start by adding your first customer.'}
            </p>
            {!searchName && !searchNic && (
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate('/customers/new')}>
                + Add Customer
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} style={{ paddingLeft: 20 }}>
                      CUSTOMER NAME {sortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('nicNumber')}>NIC NUMBER {sortIcon('nicNumber')}</th>
                    <th>CITY</th>
                    <th>STATUS</th>
                    <th>MOBILES</th>
                    <th>FAMILY</th>
                    <th style={{ textAlign: 'right', paddingRight: 20 }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td style={{ paddingLeft: 20 }}>
                        <Link to={`/customers/${c.id}`} className="customer-name-link">{c.name}</Link>
                      </td>
                      <td><span className="nic-chip">{c.nicNumber}</span></td>
                      <td className="text-muted-cell">—</td>
                      <td><span className="badge badge-success status-badge">Active</span></td>
                      <td>
                        {c.mobileCount > 0
                          ? <span className="badge badge-primary">{c.mobileCount}</span>
                          : <span className="text-muted-cell">—</span>}
                      </td>
                      <td>
                        {c.familyMemberCount > 0
                          ? <span className="badge badge-neutral">{c.familyMemberCount}</span>
                          : <span className="text-muted-cell">—</span>}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 20 }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button className="action-btn" title="View" onClick={() => navigate(`/customers/${c.id}`)}>
                            <EyeIcon />
                          </button>
                          <button className="action-btn" title="Edit" onClick={() => navigate(`/customers/${c.id}/edit`)}>
                            <EditIcon />
                          </button>
                          <button className="action-btn action-btn--danger" title="Delete" onClick={() => setDeleteTarget(c)}>
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 0 && (
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={() => {}}
              />
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmDanger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

/* Icons */
function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function NicIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>;
}
function EyeIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
}