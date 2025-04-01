package com.techm.mobicom.dto;

public class PaymentModeCountDTO {
    private String paymentMode;
    private Long count;
    
    public PaymentModeCountDTO(String paymentMode, Long count) {
        this.paymentMode = paymentMode;
        this.count = count;
    }
    
    // Getters and setters
    public String getPaymentMode() {
        return paymentMode;
    }
    
    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }
    
    public Long getCount() {
        return count;
    }
    
    public void setCount(Long count) {
        this.count = count;
    }
}