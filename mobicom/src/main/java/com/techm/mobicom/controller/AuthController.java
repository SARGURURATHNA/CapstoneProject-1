package com.techm.mobicom.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.techm.mobicom.exception.InvalidCredentialsException;
import com.techm.mobicom.exception.TokenException;
import com.techm.mobicom.model.RevokedToken;
import com.techm.mobicom.model.User;
import com.techm.mobicom.repository.RevokedTokenRepository;
import com.techm.mobicom.repository.UserRepository;
import com.techm.mobicom.security.JwtUtil;
import com.techm.mobicom.service.OtpService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
	
	 @Autowired
	 private OtpService otpService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ USER LOGIN (Mobile Number - NO Password)
    @PostMapping("/user-login")
    public ResponseEntity<?> userLogin(@RequestBody Map<String, String> loginRequest) {
        String mobileNumber = loginRequest.get("mobile_number");
        User user = userRepository.findByMobileNumber(mobileNumber);

        if (user == null) {  // ✅ Handle case when user is not found
            throw new InvalidCredentialsException("Mobile number not found.");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(mobileNumber, "ROLE_USER");

        return ResponseEntity.ok(Map.of(
            "accessToken", token,
            "role", "ROLE_USER",
            "lastLogin", user.getLastLogin()
        ));
    }

    

    // ✅ ADMIN LOGIN (Email & Password)
    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Optional<User> adminOpt = userRepository.findByUsername(username);

        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            
            if (passwordEncoder.matches(password, admin.getPassword())) {  // ✅ Compare with encoded password
                String token = jwtUtil.generateToken(admin.getUsername(), "ROLE_ADMIN");
                return ResponseEntity.ok(Map.of(
                    "accessToken", token,
                    "role", "ROLE_ADMIN"
                ));
            }
        }

        throw new InvalidCredentialsException("Invalid admin credentials.");
    }
    
    
 // ✅ LOGOUT & TOKEN REVOCATION
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new TokenException("❌ Invalid token format.");
        }
        
        token = token.substring(7); // Remove "Bearer " prefix

        if (revokedTokenRepository.existsByToken(token)) {
            throw new TokenException("❌ Token is already revoked.");
        }

        revokedTokenRepository.save(new RevokedToken(token));
        return ResponseEntity.ok("✅ Logged out successfully.");
    }
    
    // ✅ Send OTP to Mobile Number
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String mobileNumber = request.get("mobile_number");

        try {
            String response = otpService.sendOtp(mobileNumber);
            return ResponseEntity.ok(Map.of("message", response));
        } catch (Exception ex) {
            throw new RuntimeException("❌ Failed to send OTP. Try again.");
        }
    }

    // ✅ Verify OTP and Log in
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String mobileNumber = request.get("mobile_number");
        String otp = request.get("otp");

        String status = otpService.verifyOtp(mobileNumber, otp); // ✅ Get status as a string

        if ("approved".equalsIgnoreCase(status)) {  // ✅ Compare status correctly
            return ResponseEntity.ok(Map.of("message", "✅ OTP Verified!"));
        }
        throw new InvalidCredentialsException("❌ Invalid OTP.");
    }

}
