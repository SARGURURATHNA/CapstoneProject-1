package com.techm.mobicom.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.techm.mobicom.dto.EmailRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

//    @PostMapping("/send-otp")
//    public ResponseEntity<String> sendOtp(@RequestBody EmailRequest request) {
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setTo(request.getEmail());
//            message.setSubject("Your OTP Code");
//            message.setText("Your OTP is: " + request.getOtp());
//            mailSender.send(message);
//            return ResponseEntity.ok("OTP sent successfully to your email!");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                                 .body("Failed to send OTP: " + e.getMessage());
//        }
//    }
}
