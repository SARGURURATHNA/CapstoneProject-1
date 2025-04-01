package com.techm.mobicom.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.techm.mobicom.exception.UserNotFoundException;
import com.techm.mobicom.model.Address;
import com.techm.mobicom.model.Role;
import com.techm.mobicom.model.User;
import com.techm.mobicom.repository.AddressRepository;
import com.techm.mobicom.repository.RoleRepository;
import com.techm.mobicom.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AddressRepository addressRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Page<User> getSubscribersPaginated(int page, int size, String search, String status) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findFilteredSubscribers(search.toLowerCase(), status.toLowerCase(), pageable);
    }

    public User saveUser(User user) {
        // Re-fetch roles and addresses from DB
        Set<Role> validatedRoles = new HashSet<>();
        for (Role r : user.getRoles()) {
            roleRepository.findById(r.getRoleId()).ifPresent(validatedRoles::add);
        }

        Set<Address> validatedAddresses = new HashSet<>();
        for (Address a : user.getAddresses()) {
            addressRepository.findById(a.getAddressId()).ifPresent(validatedAddresses::add);
        }

        user.setRoles(validatedRoles);
        user.setAddresses(validatedAddresses);

        return userRepository.save(user);
    }
    
    public User getUserByMobileNumber(String mobileNumber) {
    	User user = userRepository.findByMobileNumber(mobileNumber);
        if (user == null) {
            throw new UserNotFoundException("User with mobile number " + mobileNumber + " not found.");
        }
        return user;
    }
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found."));
    }
}
