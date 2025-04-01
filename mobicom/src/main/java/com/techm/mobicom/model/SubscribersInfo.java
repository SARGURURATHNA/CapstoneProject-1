package com.techm.mobicom.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "subscribers_info")
public class SubscribersInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer subscriberInfoId;
    
    private String currentPlanStatus;
    
    private LocalDate planExpiryDate;

    private LocalDate planStartDate;
    
    @ManyToOne
    @JoinColumn(name = "current_plan_id")
    private Plan currentPlan;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    // Default constructor
    public SubscribersInfo() {
    }
    
    // Getters and Setters
    public Integer getSubscriberInfoId() {
        return subscriberInfoId;
    }

    public void setSubscriberInfoId(Integer subscriberInfoId) {
        this.subscriberInfoId = subscriberInfoId;
    }

    public String getCurrentPlanStatus() {
        return currentPlanStatus;
    }

    public void setCurrentPlanStatus(String currentPlanStatus) {
        this.currentPlanStatus = currentPlanStatus;
    }

    public LocalDate getPlanExpiryDate() {
        return planExpiryDate;
    }

    public void setPlanExpiryDate(LocalDate planExpiryDate) {
        this.planExpiryDate = planExpiryDate;
    }

    public LocalDate getPlanStartDate() {
        return planStartDate;
    }

    public void setPlanStartDate(LocalDate planStartDate) {
        this.planStartDate = planStartDate;
    }

    public Plan getCurrentPlan() {
        return currentPlan;
    }

    public void setCurrentPlan(Plan currentPlan) {
        this.currentPlan = currentPlan;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}