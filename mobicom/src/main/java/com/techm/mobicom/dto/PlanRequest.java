package com.techm.mobicom.dto;

import java.math.BigDecimal;
import java.util.List;

public class PlanRequest {
    private Integer planId;
    private BigDecimal price;
    private Integer validity;
    private String data;
    private String calls;
    private String sms;
    private String badge;
    private String categoryName;
    private List<String> ottNames;
    private List<String> ottCategories;

    public PlanRequest() {
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

    @Override
    public String toString() {
        return "PlanRequest [planId=" + planId + ", price=" + price + ", validity=" + validity + ", data=" + data
                + ", calls=" + calls + ", sms=" + sms + ", badge=" + badge + ", categoryName=" + categoryName
                + ", ottNames=" + ottNames + ", ottCategories=" + ottCategories + "]";
    }
}