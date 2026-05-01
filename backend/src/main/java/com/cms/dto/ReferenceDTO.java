package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReferenceDTO {
    private Long id;
    private String name;
    private Long parentId; // for cities: country id
}
