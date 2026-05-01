package com.cms.service.impl;

import com.cms.dto.*;
import com.cms.entity.*;
import com.cms.exception.DuplicateNicException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.*;
import com.cms.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    @Override
    public CustomerResponseDTO createCustomer(CustomerRequestDTO requestDTO) {
        log.info("Creating customer with NIC: {}", requestDTO.getNicNumber());

        if (customerRepository.existsByNicNumber(requestDTO.getNicNumber())) {
            throw new DuplicateNicException("Customer with NIC " + requestDTO.getNicNumber() + " already exists");
        }

        Customer customer = mapToEntity(requestDTO);
        Customer saved = customerRepository.save(customer);
        log.info("Customer created with ID: {}", saved.getId());
        return mapToResponseDTO(saved);
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO requestDTO) {
        log.info("Updating customer ID: {}", id);

        Customer existing = customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        // Initialize lazy collections
        existing.getMobileNumbers().size();
        existing.getAddresses().size();
        existing.getFamilyMembers().size();

        if (customerRepository.existsByNicNumberAndIdNot(requestDTO.getNicNumber(), id)) {
            throw new DuplicateNicException("Another customer with NIC " + requestDTO.getNicNumber() + " already exists");
        }

        // Update basic fields
        existing.setName(requestDTO.getName());
        existing.setDateOfBirth(requestDTO.getDateOfBirth());
        existing.setNicNumber(requestDTO.getNicNumber());

        // Replace mobile numbers
        existing.getMobileNumbers().clear();
        if (requestDTO.getMobileNumbers() != null) {
            requestDTO.getMobileNumbers().forEach(num -> {
                if (num != null && !num.trim().isEmpty()) {
                    existing.addMobileNumber(new MobileNumber(num.trim()));
                }
            });
        }

        // Replace addresses
        existing.getAddresses().clear();
        if (requestDTO.getAddresses() != null) {
            requestDTO.getAddresses().forEach(addrDTO -> {
                Address address = buildAddress(addrDTO);
                existing.addAddress(address);
            });
        }

        // Replace family members
        existing.getFamilyMembers().clear();
        if (requestDTO.getFamilyMemberIds() != null && !requestDTO.getFamilyMemberIds().isEmpty()) {
            Set<Customer> familyMembers = new HashSet<>(
                customerRepository.findAllById(requestDTO.getFamilyMemberIds())
            );
            // Prevent self-reference
            familyMembers.removeIf(fm -> fm.getId().equals(id));
            existing.setFamilyMembers(familyMembers);
        }

        Customer saved = customerRepository.save(existing);
        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        
        // Initialize lazy collections within transaction
        customer.getMobileNumbers().size();
        customer.getAddresses().size();
        customer.getFamilyMembers().size();
        
        return mapToResponseDTO(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerSummaryDTO> getAllCustomers(String name, String nicNumber, Pageable pageable) {
        Page<Customer> customers = customerRepository.findWithFilters(name, nicNumber, pageable);
        // Initialize collections for each customer
        customers.getContent().forEach(c -> {
            c.getMobileNumbers().size();
            c.getAddresses().size();
            c.getFamilyMembers().size();
        });
        return customers.map(this::mapToSummaryDTO);
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + id);
        }
        customerRepository.deleteById(id);
        log.info("Customer deleted with ID: {}", id);
    }

    // =================== MAPPING HELPERS ===================

    private Customer mapToEntity(CustomerRequestDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName().trim());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setNicNumber(dto.getNicNumber().trim());

        if (dto.getMobileNumbers() != null) {
            dto.getMobileNumbers().forEach(num -> {
                if (num != null && !num.trim().isEmpty()) {
                    customer.addMobileNumber(new MobileNumber(num.trim()));
                }
            });
        }

        if (dto.getAddresses() != null) {
            dto.getAddresses().forEach(addrDTO -> {
                Address address = buildAddress(addrDTO);
                customer.addAddress(address);
            });
        }

        if (dto.getFamilyMemberIds() != null && !dto.getFamilyMemberIds().isEmpty()) {
            List<Customer> familyMembers = customerRepository.findAllById(dto.getFamilyMemberIds());
            customer.setFamilyMembers(new HashSet<>(familyMembers));
        }

        return customer;
    }

    private Address buildAddress(AddressDTO addrDTO) {
        Address address = new Address();
        address.setAddressLine1(addrDTO.getAddressLine1());
        address.setAddressLine2(addrDTO.getAddressLine2());

        if (addrDTO.getCityId() != null) {
            address.setCity(cityRepository.findById(addrDTO.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found: " + addrDTO.getCityId())));
        }
        if (addrDTO.getCountryId() != null) {
            address.setCountry(countryRepository.findById(addrDTO.getCountryId())
                .orElseThrow(() -> new ResourceNotFoundException("Country not found: " + addrDTO.getCountryId())));
        }
        return address;
    }

    public CustomerResponseDTO mapToResponseDTO(Customer customer) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setNicNumber(customer.getNicNumber());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());

        // Mobile numbers
        if (customer.getMobileNumbers() != null) {
            dto.setMobileNumbers(
                customer.getMobileNumbers().stream()
                    .map(MobileNumber::getNumber)
                    .collect(Collectors.toList())
            );
        }

        // Addresses
        if (customer.getAddresses() != null) {
            dto.setAddresses(
                customer.getAddresses().stream()
                    .map(this::mapAddressToDTO)
                    .collect(Collectors.toList())
            );
        }

        // Family members (shallow - avoid infinite recursion)
        if (customer.getFamilyMembers() != null) {
            dto.setFamilyMembers(
                customer.getFamilyMembers().stream()
                    .map(fm -> {
                        FamilyMemberDTO fmDTO = new FamilyMemberDTO();
                        fmDTO.setId(fm.getId());
                        fmDTO.setName(fm.getName());
                        fmDTO.setDateOfBirth(fm.getDateOfBirth());
                        fmDTO.setNicNumber(fm.getNicNumber());
                        return fmDTO;
                    })
                    .collect(Collectors.toSet())
            );
        }

        return dto;
    }

    private AddressDTO mapAddressToDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        if (address.getCity() != null) {
            dto.setCityId(address.getCity().getId());
            dto.setCityName(address.getCity().getName());
        }
        if (address.getCountry() != null) {
            dto.setCountryId(address.getCountry().getId());
            dto.setCountryName(address.getCountry().getName());
        }
        return dto;
    }

    private CustomerSummaryDTO mapToSummaryDTO(Customer customer) {
        CustomerSummaryDTO dto = new CustomerSummaryDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setNicNumber(customer.getNicNumber());
        dto.setMobileCount(customer.getMobileNumbers() != null ? customer.getMobileNumbers().size() : 0);
        dto.setAddressCount(customer.getAddresses() != null ? customer.getAddresses().size() : 0);
        dto.setFamilyMemberCount(customer.getFamilyMembers() != null ? customer.getFamilyMembers().size() : 0);
        return dto;
    }
}