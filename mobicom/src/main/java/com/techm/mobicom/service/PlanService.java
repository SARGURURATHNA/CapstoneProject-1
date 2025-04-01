package com.techm.mobicom.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.techm.mobicom.dto.PlanDto;
import com.techm.mobicom.dto.PlanRequest;
import com.techm.mobicom.exception.ResourceNotFoundException;
import com.techm.mobicom.model.Category;
import com.techm.mobicom.model.Ott;
import com.techm.mobicom.model.Plan;
import com.techm.mobicom.repository.CategoryRepository;
import com.techm.mobicom.repository.OttRepository;
import com.techm.mobicom.repository.PlanRepository;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OttRepository ottRepository;

    public List<PlanDto> getPlansByCategory(String categoryName) {
        List<PlanDto> planDtos = planRepository.findPlansByCategoryName(categoryName);
        
        // Group PlanDtos by planId and combine OTT names
        Map<Integer, PlanDto> planMap = new HashMap<>();
        
        for (PlanDto dto : planDtos) {
            PlanDto existingDto = planMap.get(dto.getPlanId());
            
            if (existingDto == null) {
                planMap.put(dto.getPlanId(), dto);
            } else {
                // Add OTT name if it's not already in the list
                if (dto.getOttNames() != null && !dto.getOttNames().isEmpty()) {
                    String ottName = dto.getOttNames().get(0);
                    if (!existingDto.getOttNames().contains(ottName)) {
                        existingDto.getOttNames().add(ottName);
                    }
                }
                
                // Add OTT category if it's not already in the list
                if (dto.getOttCategories() != null && !dto.getOttCategories().isEmpty()) {
                    String ottCategory = dto.getOttCategories().get(0);
                    if (!existingDto.getOttCategories().contains(ottCategory)) {
                        existingDto.getOttCategories().add(ottCategory);
                    }
                }
            }
        }
        
        return new ArrayList<>(planMap.values());
    }
    
    public Page<PlanDto> getFilteredPlans(String categoryName, Integer minValidity, Integer maxValidity,
            BigDecimal minPrice, BigDecimal maxPrice, int page, int size) {
			PageRequest pageable = PageRequest.of(page, size);
			Page<PlanDto> dtoPage = planRepository.findFilteredPlans(categoryName, minValidity, maxValidity, minPrice, maxPrice, pageable);
			
			// Group OTTs
			Map<Integer, PlanDto> grouped = new LinkedHashMap<>();
			for (PlanDto dto : dtoPage.getContent()) {
			PlanDto existing = grouped.get(dto.getPlanId());
			if (existing == null) {
			grouped.put(dto.getPlanId(), dto);
			} else {
			if (dto.getOttNames() != null) existing.getOttNames().addAll(dto.getOttNames());
			if (dto.getOttCategories() != null) existing.getOttCategories().addAll(dto.getOttCategories());
			}
			}
			
			return new PageImpl<>(new ArrayList<>(grouped.values()), pageable, dtoPage.getTotalElements());
	}

    
    public Plan addPlan(PlanRequest request) {
        Plan plan = new Plan();
        setPlanFields(plan, request);
        return planRepository.save(plan);
    }

    public Plan updatePlan(PlanRequest request) {
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + request.getPlanId()));
        setPlanFields(plan, request);
        return planRepository.save(plan);
    }

    private void setPlanFields(Plan plan, PlanRequest request) {
        plan.setPrice(request.getPrice());
        plan.setValidity(request.getValidity());
        plan.setData(request.getData());
        plan.setCalls(request.getCalls());
        plan.setSms(request.getSms());
        plan.setBadge(request.getBadge());

        if (request.getCategoryName() != null && !request.getCategoryName().isEmpty()) {
        	Category category = categoryRepository.findByCategoryNameIgnoreCase(request.getCategoryName().trim());
            if (category != null) {
                plan.setCategories(new HashSet<>(List.of(category)));
            } else {
                throw new ResourceNotFoundException("Category not found: " + request.getCategoryName());
            }
        }

        // Handle OTTs from names and categories
        if (request.getOttNames() != null && !request.getOttNames().isEmpty() && request.getOttCategories() != null && !request.getOttCategories().isEmpty()) {
            List<Ott> ottList = new ArrayList<>();

            for (int i = 0; i < request.getOttNames().size(); i++) {
                String name = request.getOttNames().get(i).trim();
                String category = request.getOttCategories().size() > i ? request.getOttCategories().get(i).trim() : "standard";

                // Find by name and category
                Ott ott = ottRepository.findByNameAndOttCategory(name, category)
                        .orElseGet(() -> {
                            // Create if not found
                            Ott newOtt = new Ott();
                            newOtt.setName(name);
                            newOtt.setOttCategory(category);
                            return ottRepository.save(newOtt);
                        });

                ottList.add(ott);
            }

            plan.setOtts(new HashSet<>(ottList));
            if (!ottList.isEmpty()) {
                plan.setBadge("OTT included");
            } else {
                plan.setBadge(null); // or "" if you prefer an empty string
            }
        }
        else {
        	plan.getOtts().clear();
        	plan.setBadge(null);
        }
    }
    
    public void deletePlan(Integer id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));

        plan.getOtts().clear();
        plan.getCategories().clear();
        planRepository.save(plan); // Reflect unlinked associations

        planRepository.delete(plan);
    }
    
    public void deleteCategory(String categoryName) {
        // Find the category by name
        Category category = categoryRepository.findByCategoryNameIgnoreCase(categoryName);
        if (category == null) {
            throw new ResourceNotFoundException("Category not found with name: " + categoryName);
        }

        // Find all plans associated with this category
        List<Plan> associatedPlans = planRepository.findAll().stream()
                .filter(plan -> plan.getCategories().contains(category))
                .toList();

        // Delete each associated plan
        for (Plan plan : associatedPlans) {
            // First clear relationships to avoid constraint violations
            plan.getOtts().clear();
            plan.getCategories().clear();
            planRepository.save(plan); // Save to reflect unlinked associations
            
            // Then delete the plan
            planRepository.delete(plan);
        }

        // Finally, delete the category
        categoryRepository.delete(category);
    }
}
