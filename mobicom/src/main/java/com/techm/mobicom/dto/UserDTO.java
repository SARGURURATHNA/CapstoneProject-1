package com.techm.mobicom.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.techm.mobicom.model.Address;
import com.techm.mobicom.model.User;

public class UserDTO {
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String alternateMobile;
    private LocalDate dob;
    private String userStatus;
    private LocalDateTime lastLogin;
    private List<String> roles = new ArrayList<>();
    private List<AddressDTO> addresses = new ArrayList<>();
    
    // Default constructor
    public UserDTO() {
    }
    
    // Constructor from User entity
    public UserDTO(User user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.mobileNumber = user.getMobileNumber();
        this.alternateMobile = user.getAlternateMobile();
        this.dob = user.getDob();
        this.userStatus = user.getUserStatus();
        this.lastLogin = user.getLastLogin();
        
        // Add roles if available
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> this.roles.add(role.getUserRole()));
        }
        
        // Add addresses if available
        if (user.getAddresses() != null) {
            user.getAddresses().forEach(address -> 
                this.addresses.add(new AddressDTO(address))
            );
        }
    }
    
    // Getters and setters for all fields
    
    // Static utility method to convert User to UserDTO
    public static UserDTO fromEntity(User user) {
        if (user == null) return null;
        return new UserDTO(user);
    }
    
    public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getAlternateMobile() {
		return alternateMobile;
	}

	public void setAlternateMobile(String alternateMobile) {
		this.alternateMobile = alternateMobile;
	}

	public LocalDate getDob() {
		return dob;
	}

	public void setDob(LocalDate dob) {
		this.dob = dob;
	}

	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	public LocalDateTime getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(LocalDateTime lastLogin) {
		this.lastLogin = lastLogin;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public List<AddressDTO> getAddresses() {
		return addresses;
	}

	public void setAddresses(List<AddressDTO> addresses) {
		this.addresses = addresses;
	}

	// Static utility method to convert List<User> to List<UserDTO>
    public static List<UserDTO> fromEntities(List<User> users) {
        if (users == null) return Collections.emptyList();
        return users.stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Inner class for Address data
    public static class AddressDTO {
        private Long addressId;
        private String doorNo;
        private String street;
        private String city;
        private String district;
        private String state;
        private String pincode;
        
        public AddressDTO() {
        }
        
        public AddressDTO(Address address) {
            this.addressId = address.getAddressId();
            this.doorNo = address.getDoorNo();
            this.street = address.getStreet();
            this.city = address.getCity();
            this.district = address.getDistrict();
            this.state = address.getState();
            this.pincode = address.getPincode();
        }

		public Long getAddressId() {
			return addressId;
		}

		public void setAddressId(Long addressId) {
			this.addressId = addressId;
		}

		public String getDoorNo() {
			return doorNo;
		}

		public void setDoorNo(String doorNo) {
			this.doorNo = doorNo;
		}

		public String getStreet() {
			return street;
		}

		public void setStreet(String street) {
			this.street = street;
		}

		public String getCity() {
			return city;
		}

		public void setCity(String city) {
			this.city = city;
		}

		public String getDistrict() {
			return district;
		}

		public void setDistrict(String district) {
			this.district = district;
		}

		public String getState() {
			return state;
		}

		public void setState(String state) {
			this.state = state;
		}

		public String getPincode() {
			return pincode;
		}

		public void setPincode(String pincode) {
			this.pincode = pincode;
		}
        
        // Getters and setters
        
    }
}
