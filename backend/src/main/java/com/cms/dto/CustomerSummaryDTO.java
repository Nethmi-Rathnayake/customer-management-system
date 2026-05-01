package com.cms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CustomerSummaryDTO {
    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String nicNumber;
    private int mobileCount;
    private int addressCount;
    private int familyMemberCount;
}
