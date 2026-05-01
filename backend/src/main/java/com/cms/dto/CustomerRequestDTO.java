package com.cms.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class CustomerRequestDTO {

    @NotBlank(message = "Name is mandatory")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;

    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dateOfBirth;

    @NotBlank(message = "NIC number is mandatory")
    @Size(max = 20, message = "NIC number must not exceed 20 characters")
    private String nicNumber;

    private List<String> mobileNumbers = new ArrayList<>();

    @Valid
    private List<AddressDTO> addresses = new ArrayList<>();

    private Set<Long> familyMemberIds = new HashSet<>();
}
