package com.techm.mobicom.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RevokedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;
    private LocalDateTime revokedAt;
    
    public RevokedToken(String token) {
    	this.token = token;
    	this.revokedAt = LocalDateTime.now();
    }
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public LocalDateTime getRevokedAt() {
		return revokedAt;
	}
	public void setRevokedAt(LocalDateTime revokedAt) {
		this.revokedAt = revokedAt;
	}
    
}
