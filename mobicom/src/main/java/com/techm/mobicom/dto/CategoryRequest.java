package com.techm.mobicom.dto;

public class CategoryRequest {
    private String categoryName;

    public CategoryRequest() {
    }

    public CategoryRequest(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    @Override
    public String toString() {
        return "CategoryRequest [categoryName=" + categoryName + "]";
    }
}