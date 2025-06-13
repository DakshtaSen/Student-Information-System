package student_info.controller;

import lombok.RequiredArgsConstructor;
import student_info.dto.AdminJwtResponse;
import student_info.dto.EmailRequest;
import student_info.dto.LoginRequest;
import student_info.dto.ResetPasswordRequest;
import student_info.dto.SignUpRequest;
import student_info.entity.Admin;
import student_info.service.AdminService;
import student_info.util.JwtUtil;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody SignUpRequest request) {
        System.out.println("admin data:");
        System.out.println("Name: " + request.getAdminName());
        System.out.println("Email: " + request.getAdminEmail());
        System.out.println("Password: " + request.getAdminPassword());
        System.out.println("Confirm Password: " + request.getConfirmPassword());
    	
        String response = adminService.registerAdmin(request);
    	System.out.println("response "+response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getAdminEmail();

        try {
            Optional<Admin> optionalAdmin = adminService.findByAdminEmail(email);
            if (optionalAdmin.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found.");
            }

            Admin admin = optionalAdmin.get();

            // Check if account is locked
            if (!admin.isAccountNonLocked()) {
                // Check if lock duration (15 min) has passed
                if (admin.getLockTime() != null &&
                        admin.getLockTime().plusMinutes(15).isBefore(LocalDateTime.now())) {
                    admin.setAccountNonLocked(true);
                    admin.setFailedAttempts(0);
                    admin.setLockTime(null);
                    adminService.saveAdmin(admin); // reset lock
                } else {
                    return ResponseEntity.status(HttpStatus.LOCKED)
                            .body("Your account is locked. Try again after 15 minutes.");
                }
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, loginRequest.getAdminPassword()));

            // ✅ Reset failed attempts on successful login
            adminService.resetFailedAttempts(email);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateToken(email);

            return ResponseEntity.ok(new AdminJwtResponse(jwt, "Bearer", 3600));

        } catch (BadCredentialsException ex) {
            // ✅ Increase failed attempts
            adminService.increaseFailedAttempts(email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
    }

    @PostMapping("/forgotpassword")

    public ResponseEntity<String> forgotPassword(@RequestBody EmailRequest request) {
    	System.out.println("email"+request.getEmail());
        return adminService.sendResetPasswordLink(request.getEmail());
    }

    @PostMapping("/resetpassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        return adminService.resetPassword(request.getToken(), request.getNewPassword());
    }
    
}
