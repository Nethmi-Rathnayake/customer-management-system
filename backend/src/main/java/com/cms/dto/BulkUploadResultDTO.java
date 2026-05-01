package com.cms.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class BulkUploadResultDTO {
    private int totalRows;
    private int successCount;
    private int failureCount;
    private List<UploadErrorDTO> errors = new ArrayList<>();
    private long processingTimeMs;
    private String status; // COMPLETED, PARTIAL, FAILED

    @Data
    public static class UploadErrorDTO {
        private int rowNumber;
        private String nicNumber;
        private String errorMessage;

        public UploadErrorDTO(int rowNumber, String nicNumber, String errorMessage) {
            this.rowNumber = rowNumber;
            this.nicNumber = nicNumber;
            this.errorMessage = errorMessage;
        }
    }
}
