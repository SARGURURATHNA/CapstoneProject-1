package com.techm.mobicom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techm.mobicom.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findByCategoryNameIgnoreCase(String categoryName);
    
    boolean existsByCategoryNameIgnoreCase(String categoryName);
}
