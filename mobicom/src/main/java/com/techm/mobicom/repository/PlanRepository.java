package com.techm.mobicom.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.techm.mobicom.dto.PlanDto;
import com.techm.mobicom.model.Plan;

public interface PlanRepository extends JpaRepository<Plan, Integer> {
	@Query("SELECT new com.techm.mobicom.dto.PlanDto(p.planId, p.price, p.validity, p.data, p.calls, p.sms, p.badge, c.categoryName, o.name, o.ottCategory, p.planStatus) " +
		       "FROM Plan p " +
		       "JOIN p.categories c " +
		       "LEFT JOIN p.otts o " +
		       "WHERE c.categoryName = :categoryName")
		List<PlanDto> findPlansByCategoryName(@Param("categoryName") String categoryName);
	
	@Query("SELECT DISTINCT c.categoryName FROM Category c")
    List<String> findAllCategories();
	
	@Query("SELECT new com.techm.mobicom.dto.PlanDto(p.planId, p.price, p.validity, p.data, p.calls, p.sms, p.badge, c.categoryName, o.name, o.ottCategory, p.planStatus) " +
		       "FROM Plan p " +
		       "JOIN p.categories c " +
		       "LEFT JOIN p.otts o " +
		       "WHERE (:categoryName IS NULL OR c.categoryName = :categoryName) " +
		       "AND (:minValidity IS NULL OR p.validity >= :minValidity) " +
		       "AND (:maxValidity IS NULL OR p.validity <= :maxValidity) " +
		       "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
		       "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
		Page<PlanDto> findFilteredPlans(
		        @Param("categoryName") String categoryName,
		        @Param("minValidity") Integer minValidity,
		        @Param("maxValidity") Integer maxValidity,
		        @Param("minPrice") BigDecimal minPrice,
		        @Param("maxPrice") BigDecimal maxPrice,
		        Pageable pageable
		);
}
