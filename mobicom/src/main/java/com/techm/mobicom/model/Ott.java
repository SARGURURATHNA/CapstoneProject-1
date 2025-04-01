package com.techm.mobicom.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "ott")
public class Ott {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ottId;
    
    private String name;
    
    private String ottCategory;
    
    @ManyToMany(mappedBy = "otts")
    private Set<Plan> plans = new HashSet<>();
    
    // Default constructor
    public Ott() {
    }
    
    // Getters and Setters
    public Integer getOttId() {
        return ottId;
    }

    public void setOttId(Integer ottId) {
        this.ottId = ottId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOttCategory() {
        return ottCategory;
    }

    public void setOttCategory(String ottCategory) {
        this.ottCategory = ottCategory;
    }

    public Set<Plan> getPlans() {
        return plans;
    }

    public void setPlans(Set<Plan> plans) {
        this.plans = plans;
    }
}
