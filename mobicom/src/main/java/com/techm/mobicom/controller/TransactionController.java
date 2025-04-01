package com.techm.mobicom.controller;

import com.techm.mobicom.dto.PaymentModeCountDTO;
import com.techm.mobicom.repository.TransactionDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class TransactionController {

    @Autowired
    private TransactionDetailsRepository transactionDetailsRepository;

    @GetMapping("/transactions/revenue-per-month")
    public ResponseEntity<Map<String, Object>> getRevenuePerMonth() {
        List<Object[]> results = transactionDetailsRepository.getMonthlyRevenue();
        
        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();
        // Initialize with all months to handle cases with zero revenue
        String[] months = {"January", "February", "March", "April", "May", "June", 
                           "July", "August", "September", "October", "November", "December"};
        
        for (String month : months) {
            monthlyRevenue.put(month, BigDecimal.ZERO);
        }
        
        // Populate with actual data
        for (Object[] row : results) {
            String month = (String) row[0];
            BigDecimal revenue = (BigDecimal) row[1];
            monthlyRevenue.put(month, revenue);
        }
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("monthlyRevenue", monthlyRevenue);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/transaction/payment-mode-counts")
    public ResponseEntity<List<PaymentModeCountDTO>> getPaymentModeCounts() {
        List<PaymentModeCountDTO> results = transactionDetailsRepository.getPaymentModeCounts();
        return ResponseEntity.ok(results);
    }
}
