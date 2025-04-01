package com.techm.mobicom.controller;

import java.math.BigDecimal;
//import java.util.Collections;
//import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techm.mobicom.dto.UserDTO;
//import com.techm.mobicom.dto.UserDTO;
import com.techm.mobicom.exception.UserNotFoundException;
import com.techm.mobicom.model.User;
import com.techm.mobicom.repository.RechargeRepository;
import com.techm.mobicom.repository.UserRepository;
import com.techm.mobicom.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RechargeRepository rechargeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/exists-by-mobile/{mobileNumber}")
    public ResponseEntity<Boolean> checkMobileExists(@PathVariable String mobileNumber) {
        boolean exists = userRepository.existsByMobileNumber(mobileNumber);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/mobile/{phoneNumber}")
    public ResponseEntity<?> getUserByMobile(@PathVariable String phoneNumber) {
        try {
            User user = userService.getUserByMobileNumber(phoneNumber);
            return ResponseEntity.ok(new UserDTO(user));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            UserDTO userDTO = new UserDTO(user);
            return ResponseEntity.ok(userDTO);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @PutMapping("/{userId}/update")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Map<String, String> updates) {
        try {
            User user = userService.getUserById(userId);
            
            // Handle regular updates
            if (updates.containsKey("email")) {
                user.setEmail(updates.get("email"));
            }
            
            if (updates.containsKey("alternateMobile")) {
                user.setAlternateMobile(updates.get("alternateMobile"));
            }
            
            // Handle password update
            if (updates.containsKey("currentPassword") && updates.containsKey("password")) {
                String currentPassword = updates.get("currentPassword");
                String newPassword = updates.get("password");
                
                // Verify current password
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Current password is incorrect");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                }
                
                // Update password with encoded version
                user.setPassword(passwordEncoder.encode(newPassword));
            }
            
            
            User updatedUser = userService.saveUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("userId", updatedUser.getUserId());
            response.put("email", updatedUser.getEmail());
            response.put("alternateMobile", updatedUser.getAlternateMobile());
            response.put("message", "User updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
        	Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getUserMetrics() {
    	long totalSubscribers = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream()
                         .noneMatch(r -> "admin".equals(r.getUserRole())))
                .count();
    	long activeSubscribers = userRepository.findAll().stream()
                .filter(u -> "active".equalsIgnoreCase(u.getUserStatus()) &&
                        u.getRoles().stream().noneMatch(r -> "admin".equals(r.getUserRole())))
                .count();
    	BigDecimal monthlyRevenue = rechargeRepository.getCurrentMonthRevenue();
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", totalSubscribers);
        metrics.put("activeUsers", activeSubscribers);
        metrics.put("monthlyRevenue", monthlyRevenue);
        
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/admin-users")
    public ResponseEntity<List<User>> getAdminUsers() {
        // Assuming role ID 1 is for admins based on your query
        List<User> adminUsers = userRepository.findAll().stream()
                               .filter(u -> u.getRoles().stream().anyMatch(r -> r.getRoleId() == 1))
                               .toList();
        return ResponseEntity.ok(adminUsers);
    }
    
    @GetMapping("/subscribers")
    public ResponseEntity<?> getSubscribers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String status) {
        
        try {
            Page<User> subscribers = userService.getSubscribersPaginated(page, size, search, status);
            List<UserDTO> subscriberDTOs = subscribers.getContent().stream()
                    .map(UserDTO::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("subscribers", subscriberDTOs);
            response.put("currentPage", subscribers.getNumber());
            response.put("totalItems", subscribers.getTotalElements());
            response.put("totalPages", subscribers.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Error retrieving subscribers: " + e.getMessage());
        }
    }
    
    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody  Map<String, String> statusUpdate) {
        
        try {
        	String status = statusUpdate.get("userStatus");
            if (status == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }
            
            User user = userService.getUserById(userId);
            user.setUserStatus(status);
            
            if ("inactive".equalsIgnoreCase(status)) {
                // Additional logic for inactivating a user if needed
            } else if ("active".equalsIgnoreCase(status)) {
                // Additional logic for activating a user if needed
            }
            
            User updatedUser = userService.saveUser(user);
            
            // Convert to DTO to avoid circular references
            UserDTO userDTO = new UserDTO(updatedUser);
            return ResponseEntity.ok(userDTO);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}