package com.techm.mobicom.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techm.mobicom.dto.CategoryRequest;
import com.techm.mobicom.dto.PlanDto;
import com.techm.mobicom.dto.PlanRequest;
import com.techm.mobicom.exception.DuplicateCategoryException;
import com.techm.mobicom.exception.ResourceNotFoundException;
import com.techm.mobicom.model.Category;
import com.techm.mobicom.model.Plan;
import com.techm.mobicom.repository.CategoryRepository;
import com.techm.mobicom.repository.PlanRepository;
import com.techm.mobicom.service.PlanService;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin("*")
public class PlanController {

    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private PlanService planService;

    @GetMapping
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }
        
    @GetMapping("/category")
    public ResponseEntity<Page<PlanDto>> getPlansByCategory(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer minValidity,
            @RequestParam(required = false) Integer maxValidity,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        Page<PlanDto> plans = planService.getFilteredPlans(category, minValidity, maxValidity, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(plans);
    }

    
    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return planRepository.findAllCategories();
    }
    
    @PostMapping("/categories/add")
    public ResponseEntity<?> addCategory(@RequestBody CategoryRequest request) {
        // Check if category already exists
        Category existingCategory = categoryRepository.findByCategoryNameIgnoreCase(request.getCategoryName());
        if (existingCategory != null) {
        	throw new DuplicateCategoryException("Category with this name already exists");
        }

        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @PostMapping
    public ResponseEntity<Plan> addPlan(@RequestBody PlanRequest request) {
        Plan savedPlan = planService.addPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Integer id, @RequestBody PlanRequest request) {
        request.setPlanId(id);
        Plan updatedPlan = planService.updatePlan(request);
        return ResponseEntity.ok(updatedPlan);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Integer id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/categories/{categoryName}")
    public ResponseEntity<?> deleteCategory(@PathVariable String categoryName) {
        try {
            planService.deleteCategory(categoryName);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
