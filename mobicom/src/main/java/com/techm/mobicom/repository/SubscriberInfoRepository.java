package com.techm.mobicom.repository;


import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.techm.mobicom.model.SubscribersInfo;

public interface SubscriberInfoRepository extends JpaRepository<SubscribersInfo, Integer> {
    Optional<SubscribersInfo> findByUser_UserId(Long userId);
    Page<SubscribersInfo> findByPlanExpiryDateBetween(LocalDate start, LocalDate end, Pageable pageable);
}