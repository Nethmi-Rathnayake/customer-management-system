package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.dto.MasterDataDTO;
import com.cms.dto.ReferenceDTO;
import com.cms.service.MasterDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/master-data")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MasterDataController {

    private final MasterDataService masterDataService;

    @GetMapping
    public ResponseEntity<ApiResponse<MasterDataDTO>> getAllMasterData() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getAllMasterData()));
    }

    @GetMapping("/countries")
    public ResponseEntity<ApiResponse<List<ReferenceDTO>>> getCountries() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getAllCountries()));
    }

    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<List<ReferenceDTO>>> getCities() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getAllCities()));
    }
}
