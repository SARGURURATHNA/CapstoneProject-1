package com.techm.mobicom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techm.mobicom.model.RevokedToken;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    
    // Check if a token exists in the revoked tokens list
    boolean existsByToken(String token);
    
    // Find a revoked token by its token string
    RevokedToken findByToken(String token);
}