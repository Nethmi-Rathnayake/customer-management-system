package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MasterDataDTO {
    private List<ReferenceDTO> countries;
    private List<ReferenceDTO> cities;
}
