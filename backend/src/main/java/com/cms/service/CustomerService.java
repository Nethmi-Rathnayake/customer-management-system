package com.cms.service;

import com.cms.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    CustomerResponseDTO createCustomer(CustomerRequestDTO requestDTO);

    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO requestDTO);

    CustomerResponseDTO getCustomerById(Long id);

    Page<CustomerSummaryDTO> getAllCustomers(String name, String nicNumber, Pageable pageable);

    void deleteCustomer(Long id);
}
