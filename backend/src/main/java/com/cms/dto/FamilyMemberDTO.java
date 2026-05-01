package com.cms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FamilyMemberDTO {
    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String nicNumber;
}
