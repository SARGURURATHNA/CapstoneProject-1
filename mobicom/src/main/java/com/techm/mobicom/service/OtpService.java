package com.techm.mobicom.service;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Value("${twilio.service.sid}")
    private String serviceSid;
    
    @Value("${twilio.auth.token}")
    private String authToken;
    
    @Value("${twilio.account.sid}")
    private String accountSid;
    
    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
        System.out.println("Twilio initialized with account: " + accountSid);
    }

    // Send OTP
    public String sendOtp(String mobile) {
        Verification verification = Verification.creator(
                serviceSid,
                mobile,   // must be in E.164 format like +919876543210
                "sms"
        ).create();
        return verification.getStatus(); // returns "pending" if OTP is sent
    }

    // Verify OTP
    public String verifyOtp(String mobile, String otp) {
        VerificationCheck check = VerificationCheck.creator(serviceSid)
                .setTo(mobile)
                .setCode(otp)
                .create();
        return check.getStatus(); // returns "approved" if OTP is correct
    }
}

