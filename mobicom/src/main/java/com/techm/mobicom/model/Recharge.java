package com.techm.mobicom.model;

import java.time.LocalDate;

//import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "recharges")
public class Recharge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rechargeId;
    
    private LocalDate rechargeDate;
    
    @ManyToOne
    @JoinColumn(name = "plans_id")
    private Plan plan;
    
    @OneToOne
    @JoinColumn(name = "transaction_id")
    private TransactionDetail transactionDetail;
    
//    @JsonBackReference(value = "user-recharge")
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"recharges", "roles", "addresses"})
    private User user;
    
    // Default constructor
    public Recharge() {
    }
    
    // Getters and Setters
    public Integer getRechargeId() {
        return rechargeId;
    }

    public void setRechargeId(Integer rechargeId) {
        this.rechargeId = rechargeId;
    }

    public LocalDate getRechargeDate() {
        return rechargeDate;
    }

    public void setRechargeDate(LocalDate rechargeDate) {
        this.rechargeDate = rechargeDate;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public TransactionDetail getTransactionDetail() {
        return transactionDetail;
    }

    public void setTransactionDetail(TransactionDetail transactionDetail) {
        this.transactionDetail = transactionDetail;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}