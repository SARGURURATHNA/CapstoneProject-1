package com.techm.mobicom.dto;

public class CategoryRechargeCountDTO {
    
    private String categoryName;
    private Long rechargeCount;

    // Constructor
    public CategoryRechargeCountDTO(String categoryName, Long rechargeCount) {
        this.categoryName = categoryName;
        this.rechargeCount = rechargeCount;
    }

    // Default constructor for JPA
    public CategoryRechargeCountDTO() {
    }

    // Getters and Setters
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getRechargeCount() {
        return rechargeCount;
    }

    public void setRechargeCount(Long rechargeCount) {
        this.rechargeCount = rechargeCount;
    }
}