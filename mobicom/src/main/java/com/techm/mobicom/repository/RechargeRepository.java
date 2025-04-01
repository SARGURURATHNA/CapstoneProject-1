package com.techm.mobicom.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.techm.mobicom.dto.CategoryRechargeCountDTO;
import com.techm.mobicom.model.Recharge;

@Repository
public interface RechargeRepository extends JpaRepository<Recharge, Integer> {
    
    List<Recharge> findByUser_UserId(Long userId);
    
    @Query("SELECT FUNCTION('MONTHNAME', r.rechargeDate) as month, COUNT(r) as count " +
           "FROM Recharge r " +
           "GROUP BY FUNCTION('MONTHNAME', r.rechargeDate), FUNCTION('MONTH', r.rechargeDate) " +
           "ORDER BY FUNCTION('MONTH', r.rechargeDate)")
    List<Object[]> getMonthlyRechargeCounts();
    
    @Query("SELECT new com.techm.mobicom.dto.CategoryRechargeCountDTO(c.categoryName, COUNT(r)) " +
           "FROM Recharge r JOIN r.plan p JOIN p.categories c " +
           "GROUP BY c.categoryName")
    List<CategoryRechargeCountDTO> getRechargeCountPerCategory();
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) " +
            "FROM Recharge r JOIN r.transactionDetail t " +
            "WHERE YEAR(r.rechargeDate) = YEAR(CURRENT_DATE) " +
            "AND MONTH(r.rechargeDate) = MONTH(CURRENT_DATE)")
     BigDecimal getCurrentMonthRevenue();
}