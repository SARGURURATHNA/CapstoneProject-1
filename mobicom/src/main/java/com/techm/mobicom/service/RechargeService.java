package com.techm.mobicom.service;

import java.math.BigDecimal;
import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.LinkedHashMap;
import java.util.List;
//import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.techm.mobicom.dto.CurrentPlanDetailsDTO;
//import com.techm.mobicom.dto.CategoryRechargeCountDTO;
import com.techm.mobicom.dto.RechargeHistoryDTO;
import com.techm.mobicom.model.Plan;
import com.techm.mobicom.model.Recharge;
import com.techm.mobicom.model.SubscribersInfo;
import com.techm.mobicom.model.TransactionDetail;
import com.techm.mobicom.model.User;
import com.techm.mobicom.repository.PlanRepository;
import com.techm.mobicom.repository.RechargeRepository;
import com.techm.mobicom.repository.SubscriberInfoRepository;
import com.techm.mobicom.repository.TransactionDetailsRepository;
import com.techm.mobicom.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class RechargeService {

    @Autowired
    private TransactionDetailsRepository transactionRepo;

    @Autowired
    private RechargeRepository rechargeRepo;

    @Autowired
    private SubscriberInfoRepository subscribersInfoRepo;

    @Autowired
    private PlanRepository planRepo;

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private MailService mailService;

    @Transactional
    public String processRecharge(Long userId, Integer planId, String paymentMode, BigDecimal amount, String transactionRef) {
    	User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Plan plan = planRepo.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));
        // 1. Save Transaction
        TransactionDetail txn = new TransactionDetail();
        txn.setPaymentMode(paymentMode);
        txn.setPaymentDate(LocalDate.now());
        txn.setPaymentStatus("Success");
        txn.setTransactionRef(transactionRef);
        txn.setAmount(amount);
        txn = transactionRepo.save(txn);

        // 2. Create Recharge
        Recharge recharge = new Recharge();
        recharge.setUser(user);
        recharge.setPlan(plan);
        recharge.setTransactionDetail(txn);
        recharge.setRechargeDate(LocalDate.now());
        rechargeRepo.save(recharge);

        // 3. Update SubscribersInfo (only current plan info)
        //Plan plan = planRepo.findById(planId).orElseThrow();
        SubscribersInfo info = subscribersInfoRepo.findByUser_UserId(userId)
                .orElse(new SubscribersInfo());

        info.setUser(user);
        info.setCurrentPlan(plan);
        info.setCurrentPlanStatus("Active");
        info.setPlanStartDate(LocalDate.now());
        info.setPlanExpiryDate(LocalDate.now().plusDays(plan.getValidity()));
        subscribersInfoRepo.save(info);
        
        // Get user email
        //User user = userRepo.findById(userId).orElseThrow();

        // Compose email
        String subject = "Mobicom Recharge Confirmation";
        String body = "Dear " + user.getFirstName() + user.getLastName() + ",\n\n" +
                      "Your recharge was successful. Below are your transaction details:\n\n" +
                      "Plan Details: \n" +
                      "Amount: ₹" + amount + "\n" +
                      "Validity: " + plan.getValidity() + " days\n" +
                      "Calls: " + plan.getCalls() + "\n" +
                      "Data: " + plan.getData() + " GB/day\n" +
                      "SMS: " + plan.getSms() + "/day\n" +
                      "Expiry Date: " + info.getPlanExpiryDate() + "\n\n" +
                      "Transaction Details: \n" +
                      "Transaction Reference: " + transactionRef + "\n" +
                      "Payment Mode: " + paymentMode + "\n" +
                      "Recharge Date: " + LocalDate.now() + "\n\n" +
                      "Expiry Date: " + info.getPlanExpiryDate() + "\n\n" +
                      "Thank you for using Mobicom.";

        // Send email
        mailService.sendRechargeEmail(user.getEmail(), subject, body);

        return "Recharge successful";
    }
    
    public List<RechargeHistoryDTO> getRechargeHistory(Long userId) {
    	if (!userRepo.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        List<Recharge> recharges = rechargeRepo.findByUser_UserId(userId);

        return recharges.stream().map(recharge -> {
            TransactionDetail txn = recharge.getTransactionDetail();
            Plan plan = recharge.getPlan();

            RechargeHistoryDTO dto = new RechargeHistoryDTO();
            dto.setTransactionRef(txn.getTransactionRef());
            dto.setPaymentMode(txn.getPaymentMode());
            dto.setPaymentStatus(txn.getPaymentStatus());
            dto.setPaymentDate(txn.getPaymentDate());
            dto.setAmount(txn.getAmount());

            dto.setCost(plan.getPrice());
            dto.setValidity(plan.getValidity() + " days");
            dto.setData(plan.getData());
            dto.setSms(plan.getSms());
            dto.setCalls(plan.getCalls());

            dto.setRechargeDate(recharge.getRechargeDate());

            return dto;
        }).collect(Collectors.toList());
    }
    
    public CurrentPlanDetailsDTO getCurrentPlanDetailsWithExtras(Long userId) {
    	User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    	
        SubscribersInfo info = subscribersInfoRepo.findByUser_UserId(userId)
            .orElseThrow(() -> new RuntimeException("Subscriber info not found"));

        Plan plan = info.getCurrentPlan();

        CurrentPlanDetailsDTO dto = new CurrentPlanDetailsDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getFirstName()+" "+user.getLastName());
        dto.setMobile(user.getMobileNumber());
        dto.setStatus(info.getCurrentPlanStatus());
        dto.setCost(plan.getPrice());
        dto.setValidity(plan.getValidity());
        dto.setData(plan.getData());
        dto.setSms(plan.getSms());
        dto.setCalls(plan.getCalls());
        dto.setExpiryDate(info.getPlanExpiryDate());

        return dto;
    }
    
    public Page<SubscribersInfo> getFilteredSubscribers(String filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        LocalDate now = LocalDate.now();
        LocalDate thresholdDate = null;

        switch (filter) {
            case "3days":
                thresholdDate = now.plusDays(3);
                break;
            case "2weeks":
                thresholdDate = now.plusWeeks(2);
                break;
            case "1month":
                thresholdDate = now.plusMonths(1);
                break;
        }

        if (thresholdDate != null) {
            return subscribersInfoRepo.findByPlanExpiryDateBetween(now, thresholdDate, pageable);
        } else {
            return subscribersInfoRepo.findAll(pageable); // For 'all' or invalid filter
        }
    }

}

