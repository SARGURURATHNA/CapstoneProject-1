package com.techm.mobicom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRechargeEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("2k21cse130@kiot.ac.in");
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            System.out.println("Recharge confirmation email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
    
//    public void sendExpiryNotificationEmail(String toEmail, String subject, String body) {
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setFrom("noreply@mobicom.com");
//            message.setTo(toEmail);
//            message.setSubject(subject);
//            message.setText(body);
//            
//            mailSender.send(message);
//            System.out.println("Plan expiry notification email sent to: " + toEmail);
//        } catch (Exception e) {
//            System.err.println("Failed to send expiry notification email: " + e.getMessage());
//            // Log the error but don't throw exception
//        }
//    }
}