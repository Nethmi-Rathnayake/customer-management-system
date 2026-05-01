import api from './api';

export const customerService = {
  // Get paginated customers - matches backend @GetMapping
  getAll: (params = {}) => {
    const { page = 0, size = 20, sortBy = 'id', sortDir = 'asc', name, nicNumber } = params;
    return api.get('/customers', {
      params: { page, size, sortBy, sortDir, name, nicNumber },
    });
  },

  // Get single customer with full details - matches @GetMapping("/{id}")
  getById: (id) => api.get(`/customers/${id}`),

  // Create customer - matches @PostMapping
  create: (data) => api.post('/customers', data),

  // Update customer - matches @PutMapping("/{id}")
  update: (id, data) => api.put(`/customers/${id}`, data),

  // Delete customer - matches @DeleteMapping("/{id}")
  delete: (id) => api.delete(`/customers/${id}`),
};

export const masterDataService = {
  // Fetch all master data (countries + cities) - matches @GetMapping
  getAll: () => api.get('/master-data'),

  // Fetch countries only - matches @GetMapping("/countries")
  getCountries: () => api.get('/master-data/countries'),

  // Fetch cities only - matches @GetMapping("/cities")
  getCities: () => api.get('/master-data/cities'),
};

export const bulkUploadService = {
  // Bulk upload - matches @PostMapping("/customers") in BulkUploadController
  uploadCustomers: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/bulk-upload/customers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000,
      onUploadProgress,
    });
  },
};