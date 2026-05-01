import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

import Layout from './components/common/Layout';
import LandingPage from './pages/LandingPage';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import BulkUploadPage from './pages/BulkUploadPage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page — no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* App pages — with sidebar layout */}
        <Route path="/dashboard" element={<Layout><CustomerListPage /></Layout>} />
        <Route path="/customers" element={<Layout><CustomerListPage /></Layout>} />
        <Route path="/customers/new" element={<Layout><CustomerFormPage /></Layout>} />
        <Route path="/customers/:id/edit" element={<Layout><CustomerFormPage /></Layout>} />
        <Route path="/customers/:id" element={<Layout><CustomerDetailPage /></Layout>} />
        <Route path="/bulk-upload" element={<Layout><BulkUploadPage /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastStyle={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14 }}
      />
    </Router>
  );
}

export default App;
