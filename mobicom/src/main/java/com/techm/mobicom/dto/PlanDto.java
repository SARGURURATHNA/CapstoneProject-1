package com.techm.mobicom.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PlanDto {
    private Integer planId;
    private BigDecimal price;
    private Integer validity;
    private String data;
    private String calls;
    private String sms;
    private String badge;
    private String categoryName;
    private String planStatus;
    private List<String> ottNames = new ArrayList<>();
    private List<String> ottCategories = new ArrayList<>();

    public PlanDto() {
    }

    public PlanDto(Integer planId, BigDecimal price, Integer validity, String data, String calls, String sms, 
                  String badge, String categoryName) {
        this.planId = planId;
        this.price = price;
        this.validity = validity;
        this.data = data;
        this.calls = calls;
        this.sms = sms;
        this.badge = badge;
        this.categoryName = categoryName;
    }

    // Used for projection constructor in repository
    public PlanDto(Integer planId, BigDecimal price, Integer validity, String data, String calls, String sms, 
                  String badge, String categoryName, String ottName, String ottCategory, String planStatus) {
        this.planId = planId;
        this.price = price;
        this.validity = validity;
        this.data = data;
        this.calls = calls;
        this.sms = sms;
        this.badge = badge;
        this.categoryName = categoryName;
        
        if (ottName != null) {
            this.ottNames.add(ottName);
        }
        
        if (ottCategory != null) {
            this.ottCategories.add(ottCategory);
        }
        
        this.planStatus = planStatus;
    }

    public Integer getPlanId() {
        return planId;
    }

    public void setPlanId(Integer planId) {
        this.planId = planId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getValidity() {
        return validity;
    }

    public void setValidity(Integer validity) {
        this.validity = validity;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getCalls() {
        return calls;
    }

    public void setCalls(String calls) {
        this.calls = calls;
    }

    public String getSms() {
        return sms;
    }

    public void setSms(String sms) {
        this.sms = sms;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<String> getOttNames() {
        return ottNames;
    }

    public void setOttNames(List<String> ottNames) {
        this.ottNames = ottNames;
    }

    public List<String> getOttCategories() {
        return ottCategories;
    }

    public void setOttCategories(List<String> ottCategories) {
        this.ottCategories = ottCategories;
    }
    
    public String getPlanStatus() {
        return planStatus;
    }
    public void setPlanStatus(String planStatus) {
        this.planStatus = planStatus;
    }

    @Override
    public String toString() {
        return "PlanDto [planId=" + planId + ", price=" + price + ", validity=" + validity + ", data=" + data
                + ", calls=" + calls + ", sms=" + sms + ", badge=" + badge + ", categoryName=" + categoryName
                + ", ottNames=" + ottNames + ", ottCategories=" + ottCategories + "]";
    }
}