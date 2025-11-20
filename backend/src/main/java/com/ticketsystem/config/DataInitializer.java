package com.ticketsystem.config;

import com.ticketsystem.entity.Role;
import com.ticketsystem.entity.User;
import com.ticketsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@ticketsystem.com");
            admin.setFullName("System Administrator");
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            
            // Create support user
            User support = new User();
            support.setUsername("support");
            support.setPassword(passwordEncoder.encode("support123"));
            support.setEmail("support@ticketsystem.com");
            support.setFullName("Support Agent");
            support.setRole(Role.SUPPORT);
            support.setEnabled(true);
            userRepository.save(support);
            
            // Create regular user
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@ticketsystem.com");
            user.setFullName("Regular User");
            user.setRole(Role.USER);
            user.setEnabled(true);
            userRepository.save(user);
            
            System.out.println("Sample users created:");
            System.out.println("Admin - username: admin, password: admin123");
            System.out.println("Support - username: support, password: support123");
            System.out.println("User - username: user, password: user123");
        }
    }
}
