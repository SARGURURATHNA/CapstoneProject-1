package com.techm.mobicom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techm.mobicom.model.TransactionDetail;
import com.techm.mobicom.dto.PaymentModeCountDTO;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface TransactionDetailsRepository extends JpaRepository<TransactionDetail, Integer> {
    // Basic CRUD methods are provided by JpaRepository
	@Query("SELECT FUNCTION('MONTHNAME', t.paymentDate) as month, " +
	           "SUM(t.amount) as revenue " +
	           "FROM TransactionDetail t " +
	           "WHERE t.paymentStatus = 'SUCCESS' " +
	           "GROUP BY FUNCTION('MONTHNAME', t.paymentDate), FUNCTION('MONTH', t.paymentDate) " +
	           "ORDER BY FUNCTION('MONTH', t.paymentDate)")
	    List<Object[]> getMonthlyRevenue();
	    
	    @Query("SELECT new com.techm.mobicom.dto.PaymentModeCountDTO(t.paymentMode, COUNT(t)) " +
	           "FROM TransactionDetail t " +
	           "WHERE t.paymentStatus = 'SUCCESS' " +
	           "GROUP BY t.paymentMode")
	    List<PaymentModeCountDTO> getPaymentModeCounts();
}