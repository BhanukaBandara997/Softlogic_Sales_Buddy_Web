package com.softlogic.dealer.application.webapp.rest;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.softlogic.dealer.application.webapp.config.WebSecurityConfig;
import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import com.softlogic.dealer.application.webapp.entity.Role;
import com.softlogic.dealer.application.webapp.entity.User;
import com.softlogic.dealer.application.webapp.repository.RoleRepository;
import com.softlogic.dealer.application.webapp.service.UserService;
import com.softlogic.dealer.application.webapp.utils.AppConstants;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/rest")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    private Environment env;

    @Autowired
    private JavaMailSender mailSender;

    @RequestMapping(value = "/createUser", method = RequestMethod.POST, consumes = {"application/json"})
    public ResponseEntity<String> createUser(@RequestBody Map<String, Object> request, @RequestParam String role) {
        String emailAddress = request.get("email").toString();
        String affiliateCompany = "";
        if (request.containsKey("affiliateCompany")) {
            affiliateCompany = request.get("affiliateCompany").toString();
        }
        String password = request.get("password").toString();

        Role roleItem;
        Set<Role> roles = new HashSet<>();
        if (role.equals("ROLE_ADMIN")) {
            roleItem = roleRepository.findByName("ROLE_ADMIN");
        } else if (role.equals("ROLE_USER")) {
            roleItem = roleRepository.findByName("ROLE_USER");
        } else {
            roleItem = roleRepository.findByName("SALES_PERSON");
        }

        roles.add(roleItem);
        String status;
        String username = emailAddress.split("@")[0];

        User user = new User();
        user.setName(username);
        user.setEmail(emailAddress);
        user.setAffiliateCompany(affiliateCompany);
        user.setPassword(password);
        user.setRoles(roles);
        user.setAccountExpired(false);
        user.setAccountLocked(false);

        User userObj = userService.findByEmail(emailAddress);
        if (userObj == null) {
            userService.save(user);
            final SimpleMailMessage email = constructEmailMessage(user, password);
            mailSender.send(email);
            status = "User creation success";
        } else {
            status = "User creation error";
        }
        JSONObject returnObj = new JSONObject();
        returnObj.put("msg", status);
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/updateUser", method = RequestMethod.POST, consumes = {"application/json"})
    public ResponseEntity<String> updateUser(@RequestBody Map<String, Object> request, @RequestParam String role) {
        String status;
        String emailAddress = request.get("email").toString();
        String password = request.get("password").toString();
        String affiliateCompany = "";
        if (request.containsKey("affiliateCompany")) {
            affiliateCompany = request.get("affiliateCompany").toString();
        }
        User user = userService.findByEmail(emailAddress);
        Role roleItem;
        Set<Role> roles = new HashSet<>();
        if (role.equals("ROLE_ADMIN")) {
            roleItem = roleRepository.findByName("ROLE_ADMIN");
        } else if (role.equals("ROLE_USER")) {
            roleItem = roleRepository.findByName("ROLE_USER");
        } else {
            roleItem = roleRepository.findByName("SALES_PERSON");
        }
        roles.add(roleItem);
        user.setRoles(roles);
        if (user == null) {
            user.setPassword(password);
            user.setAffiliateCompany(affiliateCompany);
            userService.save(user);
            final SimpleMailMessage email = constructEmailMessage(user, password);
            mailSender.send(email);
            status = "User creation success";
        } else {
            user.setAffiliateCompany(affiliateCompany);
            user.setPassword(password);
            userService.save(user);
            status = "User edited success";
        }
        JSONObject returnObj = new JSONObject();
        returnObj.put("msg", status);
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/loginAuthentication", method = RequestMethod.GET)
    public ResponseEntity<String> loginAuthentication(@RequestParam String email, @RequestParam String password) {
        User userObj = userService.findByEmail(email);
        Boolean validAccount = true;
        JSONObject returnObj = new JSONObject();
        if (userObj == null) {
            validAccount = false;
            returnObj.put("isAuthenticated", validAccount);
        } else {
            Set<Role> roles = userObj.getRoles();
            String roleName = "";
            for (Role role:roles) {
                roleName = role.getName();
            }
//            if (roleName.equals("SALES_PERSON")){
                boolean validEmail = userObj.getEmail().equals(email);
                boolean validPassword = WebSecurityConfig.passwordEncoder().matches(userObj.getPassword(), password);
                if (!validEmail && !validPassword) {
                    validAccount = false;
                }
//            }else{
//                validAccount = false;
//            }
        }
        returnObj.put("isAuthenticated", validAccount);
        returnObj.put("affiliateCompany", userObj.getAffiliateCompany());
        returnObj.put("userId", userObj.getId());
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/getUserById", method = RequestMethod.POST)
    public ResponseEntity<String> getUserById(@RequestParam String userId) {
        Optional<User> userOptObj = userService.findById(Integer.valueOf(userId));
        JSONObject userJsonObj = new JSONObject();
        User userObj = userOptObj.get();
        userJsonObj.put("emailAddress", userObj.getEmail());
        userJsonObj.put("userId", userObj.getId());
        Set<Role> roles = userObj.getRoles();
        Role firstElement = roles.stream().findFirst().get();
        userJsonObj.put("userRole", firstElement.getName());
        userJsonObj.put("affiliateCompany", userObj.getAffiliateCompany());
        return ResponseEntity.status(HttpStatus.OK).body(userJsonObj.toString());
    }

    @RequestMapping(value = "/getUserByEmail", method = RequestMethod.POST)
    public ResponseEntity<String> getUserByEmail(@RequestParam String emailAddress) {
        User userObj = userService.findByEmail(emailAddress);
        JSONObject userJsonObj = new JSONObject();
        userJsonObj.put("emailAddress", userObj.getEmail());
        userJsonObj.put("userId", userObj.getId());
        Set<Role> roles = userObj.getRoles();
        Role firstElement = roles.stream().findFirst().get();
        userJsonObj.put("userRole", firstElement.getName());
        userJsonObj.put("affiliateCompany", userObj.getAffiliateCompany());
        return ResponseEntity.status(HttpStatus.OK).body(userJsonObj.toString());
    }

    @RequestMapping(value = "/deleteUserById", method = RequestMethod.POST, consumes = {"application/json"})
    public ResponseEntity<String> deleteUserById(@RequestParam String userId) {
        Optional<User> userOptObj = userService.findById(Integer.valueOf(userId));
        User userObj = userOptObj.get();
        userService.delete(userObj);
        JSONObject returnObj = new JSONObject();
        returnObj.put("msg", "User Delete Success");
        return ResponseEntity.status(HttpStatus.OK).body(returnObj.toString());
    }

    @RequestMapping(value = "/deleteUsersWithIds", method = RequestMethod.POST, consumes = {"application/json"})
    public ResponseEntity<String> deleteUsersWithIds(@RequestParam List<Integer> salesRepIdList) {
        List<User> removingSalesPersonList = new ArrayList<>();
        for (int i = 0; i < salesRepIdList.size(); i++) {
            Integer userId = salesRepIdList.get(i);
            Optional<User> userOptObj = userService.findById(userId);
            User salesPersonObj = userOptObj.get();
            removingSalesPersonList.add(salesPersonObj);
        }
        for (User salesPersonObj : removingSalesPersonList) {
            userService.delete(salesPersonObj);
        }
        JSONObject userDeletedObj = new JSONObject();
        userDeletedObj.put("msg", "Sales Person List Delete Success");
        return ResponseEntity.status(HttpStatus.OK).body(userDeletedObj.toString());
    }

    @RequestMapping(value = "/getAllUsers", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE, consumes = {"application/json"})
    public ResponseEntity<String> getAllUsers() {
        Set<Role> roles = new HashSet<>();
        Role roleAdmin = roleRepository.findByName("ROLE_ADMIN");
        Role roleUser = roleRepository.findByName("ROLE_USER");
        roles.add(roleAdmin);
        roles.add(roleUser);
        List<User> allUsers = userService.getAllUsers(roles);
        List<JSONObject> entities = new ArrayList<>();
        for (User user : allUsers) {
            JSONObject entity = new JSONObject();
            entity.put("userId", user.getId());
            entity.put("username", user.getEmail());
            entities.add(entity);
        }
        return ResponseEntity.status(HttpStatus.OK).body(entities.toString());
    }

    @RequestMapping(value = "/getAllSalesPersons", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE, consumes = {"application/json"})
    public ResponseEntity<String> getAllSalesPersons() {
        Set<Role> roles = new HashSet<>();
        Role roleItem = roleRepository.findByName("SALES_PERSON");
        roles.add(roleItem);
        List<User> allSalesPersons = userService.getSalesPersons(roles);
        List<JSONObject> entities = new ArrayList<>();
        for (User salesPerson : allSalesPersons) {
            JSONObject entity = new JSONObject();
            entity.put("salesPersonId", salesPerson.getId());
            entity.put("salesPersonName", salesPerson.getName());
            entity.put("affiliateCompany", salesPerson.getAffiliateCompany());
            entities.add(entity);
        }
        return ResponseEntity.status(HttpStatus.OK).body(entities.toString());
    }

    @RequestMapping(value = "/getSalesPersonById", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getSalesPersonById(@RequestParam String userEmailAddress) {
        User salesPerson = userService.findByEmail(userEmailAddress);
        JSONObject entity = new JSONObject();
        entity.put("salesPersonId", salesPerson.getId());
        entity.put("salesPersonName", salesPerson.getName());
        entity.put("salesPersonEmailAddress", salesPerson.getEmail());
        entity.put("affiliateCompany", salesPerson.getAffiliateCompany());
        return ResponseEntity.status(HttpStatus.OK).body(entity.toString());
    }


    private SimpleMailMessage constructEmailMessage(final User user, String password) {
        final String recipientAddress = user.getEmail();
        final String subject = "Registration Confirmation";
        final SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText("Hi,  \n Congratulations You Have Been Successfully Registered For the Softlogic Dealers Application !!!  \n" +
                "\n User account has been created for your email address: \n " + user.getEmail() + "\n Login to the system using your registered email address: \r\n"
                + "User password : " + password + "DO NOT SHARE THIS");
        email.setFrom(env.getProperty("support.email"));
        return email;
    }
}
