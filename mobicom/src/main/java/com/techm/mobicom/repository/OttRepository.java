package com.techm.mobicom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techm.mobicom.model.Ott;

public interface OttRepository extends JpaRepository<Ott, Integer>{
    Optional<Ott> findByNameAndOttCategory(String name, String ottCategory);
    boolean existsByNameAndOttCategory(String name, String ottCategory);
}
