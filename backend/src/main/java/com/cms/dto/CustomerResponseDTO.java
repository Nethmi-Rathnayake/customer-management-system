package com.cms.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class CustomerResponseDTO {
    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String nicNumber;
    private List<String> mobileNumbers = new ArrayList<>();
    private List<AddressDTO> addresses = new ArrayList<>();
    private Set<FamilyMemberDTO> familyMembers = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
