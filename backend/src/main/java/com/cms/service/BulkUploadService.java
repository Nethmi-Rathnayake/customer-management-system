package com.cms.service;

import com.cms.dto.BulkUploadResultDTO;
import com.cms.entity.Customer;
import com.cms.entity.MobileNumber;
import com.cms.repository.CustomerRepository;
import com.cms.repository.CityRepository;
import com.cms.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class BulkUploadService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    private static final DateTimeFormatter[] DATE_FORMATS = {
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        DateTimeFormatter.ofPattern("dd/MM/yyyy"),
        DateTimeFormatter.ofPattern("MM/dd/yyyy"),
        DateTimeFormatter.ofPattern("dd-MM-yyyy")
    };

    @Transactional
    public BulkUploadResultDTO processBulkUpload(MultipartFile file) throws Exception {
        long startTime = System.currentTimeMillis();
        log.info("Starting bulk upload: {}", file.getOriginalFilename());

        BulkUploadResultDTO result = new BulkUploadResultDTO();
        List<BulkUploadResultDTO.UploadErrorDTO> errors = new ArrayList<>();
        
        // Get existing NICs to check duplicates
        Set<String> existingNics = new HashSet<>();
        customerRepository.findAll().forEach(c -> existingNics.add(c.getNicNumber()));
        
        // Build city and country maps for lookup
        Map<String, Long> cityMap = buildCityMap();
        Map<String, Long> countryMap = buildCountryMap();

        int successCount = 0;
        int failureCount = 0;
        List<Customer> customersToSave = new ArrayList<>();
        Set<String> batchNics = new HashSet<>();

        try (InputStream is = file.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            
            boolean isFirstRow = true;
            int rowNum = 0;
            
            for (Row row : sheet) {
                if (isFirstRow) {
                    isFirstRow = false;
                    continue;
                }
                rowNum++;
                
                try {
                    // Read cells
                    String name = getCellValue(row.getCell(0));
                    String dobStr = getCellValue(row.getCell(1));
                    String nic = getCellValue(row.getCell(2));
                    String mobiles = getCellValue(row.getCell(3));
                    String cityName = getCellValue(row.getCell(6));
                    String countryName = getCellValue(row.getCell(7));
                    
                    // Validate required fields
                    List<String> validationErrors = new ArrayList<>();
                    if (isEmpty(name)) validationErrors.add("Name is mandatory");
                    if (isEmpty(dobStr)) validationErrors.add("Date of Birth is mandatory");
                    if (isEmpty(nic)) validationErrors.add("NIC Number is mandatory");
                    
                    if (!validationErrors.isEmpty()) {
                        errors.add(new BulkUploadResultDTO.UploadErrorDTO(rowNum, nic, String.join("; ", validationErrors)));
                        failureCount++;
                        continue;
                    }
                    
                    // Check duplicate NIC
                    nic = nic.trim();
                    if (existingNics.contains(nic) || batchNics.contains(nic)) {
                        errors.add(new BulkUploadResultDTO.UploadErrorDTO(rowNum, nic, "Duplicate NIC number: " + nic));
                        failureCount++;
                        continue;
                    }
                    
                    // Parse date
                    LocalDate dateOfBirth = parseDate(dobStr.trim());
                    if (dateOfBirth == null) {
                        errors.add(new BulkUploadResultDTO.UploadErrorDTO(rowNum, nic, "Invalid date format: " + dobStr));
                        failureCount++;
                        continue;
                    }
                    
                    batchNics.add(nic);
                    
                    // Create customer entity
                    Customer customer = new Customer();
                    customer.setName(name.trim());
                    customer.setDateOfBirth(dateOfBirth);
                    customer.setNicNumber(nic);
                    
                    // Add mobile numbers
                    if (!isEmpty(mobiles)) {
                        String[] mobileList = mobiles.split(",");
                        for (String mobile : mobileList) {
                            String trimmed = mobile.trim();
                            if (!trimmed.isEmpty()) {
                                customer.addMobileNumber(new MobileNumber(trimmed));
                            }
                        }
                    }
                    
                    customersToSave.add(customer);
                    successCount++;
                    
                } catch (Exception e) {
                    log.error("Error processing row {}: {}", rowNum, e.getMessage());
                    errors.add(new BulkUploadResultDTO.UploadErrorDTO(rowNum, "", "Error: " + e.getMessage()));
                    failureCount++;
                }
            }
            
            workbook.close();
        }
        
        // Save all customers in batch
        if (!customersToSave.isEmpty()) {
            customerRepository.saveAll(customersToSave);
            log.info("Saved {} customers", customersToSave.size());
        }
        
        result.setSuccessCount(successCount);
        result.setFailureCount(failureCount);
        result.setTotalRows(successCount + failureCount);
        result.setProcessingTimeMs(System.currentTimeMillis() - startTime);
        result.setErrors(errors.size() > 1000 ? errors.subList(0, 1000) : errors);
        
        String status;
        if (failureCount == 0) {
            status = "COMPLETED";
        } else if (successCount > 0) {
            status = "PARTIAL";
        } else {
            status = "FAILED";
        }
        result.setStatus(status);
        
        log.info("Bulk upload complete: {} success, {} failed, {}ms", successCount, failureCount, result.getProcessingTimeMs());
        return result;
    }
    
    private Map<String, Long> buildCityMap() {
        Map<String, Long> map = new HashMap<>();
        cityRepository.findAll().forEach(city -> {
            map.put(city.getName().toLowerCase(), city.getId());
        });
        return map;
    }
    
    private Map<String, Long> buildCountryMap() {
        Map<String, Long> map = new HashMap<>();
        countryRepository.findAll().forEach(country -> {
            map.put(country.getName().toLowerCase(), country.getId());
        });
        return map;
    }
    
    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue());
            default: return "";
        }
    }
    
    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    private LocalDate parseDate(String dateStr) {
        if (isEmpty(dateStr)) return null;
        
        for (DateTimeFormatter fmt : DATE_FORMATS) {
            try {
                return LocalDate.parse(dateStr.trim(), fmt);
            } catch (DateTimeParseException ignored) {
            }
        }
        return null;
    }
}