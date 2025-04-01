package com.techm.mobicom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techm.mobicom.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    // Find role by name
	Role findByUserRole(String userRole);
}