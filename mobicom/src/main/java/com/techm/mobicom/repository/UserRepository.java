package com.techm.mobicom.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.techm.mobicom.model.User;

public interface UserRepository extends JpaRepository<User,Long> {
	boolean existsByMobileNumber(String mobileNumber);
	User findByMobileNumber(String mobileNumber);
	Optional<User> findByUsername(String username);
	
	@Query("SELECT u FROM User u JOIN u.roles r " +
		       "WHERE r.roleId <> 1 AND " +
		       "(:status = '' OR LOWER(u.userStatus) = :status) AND " +
		       "(:search = '' OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE CONCAT('%', :search, '%') " +
		       "OR u.mobileNumber LIKE CONCAT('%', :search, '%'))")
		Page<User> findFilteredSubscribers(@Param("search") String search,
		                                  @Param("status") String status,
		                                  Pageable pageable);
}

