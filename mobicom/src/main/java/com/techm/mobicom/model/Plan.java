package com.techm.mobicom.model;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
//import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "plans")
public class Plan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer planId;
    
    private String badge;
    
    private String calls;
    
    private String data;
    
    private BigDecimal price;
    
    private String sms;
    
    private Integer validity;
    
    private String planStatus;
    
    @ManyToMany
    @JoinTable(
        name = "plans_ott",
        joinColumns = @JoinColumn(name = "plan_id"),
        inverseJoinColumns = @JoinColumn(name = "ott_id")
    )
    private Set<Ott> otts = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "plan_category",
        joinColumns = @JoinColumn(name = "plan_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
    
//    @OneToMany(mappedBy = "plan")
//    private Set<Recharge> recharges = new HashSet<>();
//    
//    @OneToMany(mappedBy = "currentPlan")
//    private Set<SubscribersInfo> subscribers = new HashSet<>();
    
    // Default constructor
    public Plan() {
    }
    
    // Getters and Setters
    public Integer getPlanId() {
        return planId;
    }

    public void setPlanId(Integer planId) {
        this.planId = planId;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getCalls() {
        return calls;
    }

    public void setCalls(String calls) {
        this.calls = calls;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSms() {
        return sms;
    }

    public void setSms(String sms) {
        this.sms = sms;
    }

    public Integer getValidity() {
        return validity;
    }

    public void setValidity(Integer validity) {
        this.validity = validity;
    }

    public String getPlanStatus() {
        return planStatus;
    }

    public void setPlanStatus(String planStatus) {
        this.planStatus = planStatus;
    }

    public Set<Ott> getOtts() {
        return otts;
    }

    public void setOtts(Set<Ott> otts) {
        this.otts = otts;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

//    public Set<Recharge> getRecharges() {
//        return recharges;
//    }
//
//    public void setRecharges(Set<Recharge> recharges) {
//        this.recharges = recharges;
//    }
//
//    public Set<SubscribersInfo> getSubscribers() {
//        return subscribers;
//    }
//
//    public void setSubscribers(Set<SubscribersInfo> subscribers) {
//        this.subscribers = subscribers;
//    }
}