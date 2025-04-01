package com.techm.mobicom.controller;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.techm.mobicom.dto.CategoryRechargeCountDTO;
import com.techm.mobicom.dto.CurrentPlanDetailsDTO;
import com.techm.mobicom.dto.PaginatedSubscriberDTO;
//import com.techm.mobicom.dto.RechargeHistoryDTO;
import com.techm.mobicom.model.Plan;
import com.techm.mobicom.model.SubscribersInfo;
import com.techm.mobicom.model.User;
import com.techm.mobicom.repository.RechargeRepository;
import com.techm.mobicom.service.RechargeService;

@RestController
@RequestMapping("/api/recharge")
@CrossOrigin("*")
public class RechargeController {

    @Autowired
    private RechargeService rechargeService;
    
    @Autowired
    private RechargeRepository rechargeRepository;

    @PostMapping("/buy")
    public ResponseEntity<String> buyPlan(@RequestParam Long userId,
                                          @RequestParam Integer planId,
                                          @RequestParam String paymentMode,
                                          @RequestParam BigDecimal amount,
                                          @RequestParam String transactionRef) {
    	try {
        String result = rechargeService.processRecharge(userId, planId, paymentMode, amount, transactionRef);
        return ResponseEntity.ok(result);
    	}
    	catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Recharge failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<?> getRechargeHistory(@RequestParam Long userId) {
    	try {
            return ResponseEntity.ok(rechargeService.getRechargeHistory(userId));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        }
    }
    
    @GetMapping("/current-plan/details")
    public ResponseEntity<?> getCurrentPlanFullDetails(@RequestParam Long userId) {
    	try {
            return ResponseEntity.ok(rechargeService.getCurrentPlanDetailsWithExtras(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @GetMapping("/monthly-recharges")
    public ResponseEntity<Map<String, Long>> getMonthlyRechargeCounts() {
        List<Object[]> results = rechargeRepository.getMonthlyRechargeCounts();

        // Initialize all 12 months to 0
        Map<String, Long> monthlyCounts = new LinkedHashMap<>();
        List<String> allMonths = List.of("January", "February", "March", "April", "May", "June",
                                         "July", "August", "September", "October", "November", "December");
        for (String month : allMonths) {
            monthlyCounts.put(month, 0L);
        }

        for (Object[] row : results) {
            String month = (String) row[0];
            Long count = (Long) row[1];
            monthlyCounts.put(month, count);
        }

        return ResponseEntity.ok(monthlyCounts);
    }
    
    @GetMapping("/category-recharges")
    public ResponseEntity<Map<String, Long>> getRechargeCountPerCategory() {
        List<CategoryRechargeCountDTO> results = rechargeRepository.getRechargeCountPerCategory();
        Map<String, Long> categoryCounts = new LinkedHashMap<>();
        for (CategoryRechargeCountDTO dto : results) {
            categoryCounts.put(dto.getCategoryName(), dto.getRechargeCount());
        }
        return ResponseEntity.ok(categoryCounts);
    }
    
    @GetMapping("/subscribers/paginated")
    public ResponseEntity<?> getSubscribersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size,
            @RequestParam(defaultValue = "all") String filter) {

    	try {
        Page<SubscribersInfo> subscriberPage = rechargeService.getFilteredSubscribers(filter, page, size);

        List<CurrentPlanDetailsDTO> dtos = subscriberPage.getContent().stream()
            .map(info -> {
                User user = info.getUser();
                Plan plan = info.getCurrentPlan();

                CurrentPlanDetailsDTO dto = new CurrentPlanDetailsDTO();
                dto.setUserId(user.getUserId());
                dto.setName(user.getFirstName() + " " + user.getLastName());
                dto.setMobile(user.getMobileNumber());
                dto.setStatus(info.getCurrentPlanStatus());
                dto.setCost(plan.getPrice());
                dto.setValidity(plan.getValidity());
                dto.setData(plan.getData());
                dto.setSms(plan.getSms());
                dto.setCalls(plan.getCalls());
                dto.setExpiryDate(info.getPlanExpiryDate());

                return dto;
            }).collect(Collectors.toList());

        PaginatedSubscriberDTO response = new PaginatedSubscriberDTO();
        response.setSubscribers(dtos);
        response.setCurrentPage(page);
        response.setTotalPages(subscriberPage.getTotalPages());
        response.setTotalSubscribers(subscriberPage.getTotalElements());

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to fetch subscriber data");
    }
    }
}

