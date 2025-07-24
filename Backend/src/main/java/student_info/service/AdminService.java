package student_info.service;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import student_info.dto.AdminDTO;
import student_info.dto.AdminUpdateRequest;
import student_info.dto.LoginRequest;
import student_info.dto.SignUpRequest;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;

import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public String registerAdmin(SignUpRequest request) {
        if (adminRepository.existsByAdminEmail(request.getAdminEmail())) {
            return "Email already in use.";
        }
        if (!request.getAdminPassword().equals(request.getConfirmPassword())) {
            return "Passwords do not match.";
        }
        Admin admin = new Admin();
        admin.setAdminName(request.getAdminName());
        admin.setAdminEmail(request.getAdminEmail());
        admin.setAdminPassword(passwordEncoder.encode(request.getAdminPassword()));
        admin.setAdminMobileNo(request.getAdminMobileNo());
        admin.setCourse(request.getCourse());
        admin.setAdminRole(request.getAdminRole());
        if ("BATCHMENTOR".equalsIgnoreCase(request.getAdminRole())) {
            admin.setBatch(request.getBatch());
        } else {
            admin.setBatch(null);
        }
        admin.setApproved(false);
        Admin savedAdmin = adminRepository.save(admin);
        emailService.sendAdminSignUpNotification(
                savedAdmin.getAdminName(),
                savedAdmin.getAdminEmail(),
                savedAdmin.getAdminRole(),
                savedAdmin.getAdminId()
        );

        return "Admin registered. Awaiting Super Admin approval.";
    }

    public Optional<Admin> getAdminByEmail(String email) {
        return adminRepository.findByAdminEmail(email);
    }

    public String approveAdmin(Long adminId) {
        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);

        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            admin.setApproved(true);
            adminRepository.save(admin);

            emailService.sendAdminApprovalConfirmationEmail(
                    admin.getAdminName(),
                    admin.getAdminEmail(),
                    admin.getAdminRole()
            );

            return "Admin approved successfully.";
        } else {
            return "Admin not found.";
        }
    }

    public String loginAdmin(LoginRequest request) {
        Optional<Admin> optional = adminRepository.findByAdminEmail(request.getAdminEmail());

        if (optional.isEmpty()) {
            return "Invalid email or password.";
        }

        Admin admin = optional.get();

        if (!admin.isApproved()) {
            return "Account not approved.";
        }

        if (!passwordEncoder.matches(request.getAdminPassword(), admin.getAdminPassword())) {
            return "Invalid email or password.";
        }

        return "Login successful.";
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void updateAdminWithTypeLogic(Long adminId, AdminUpdateRequest updateRequest) throws Exception {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new Exception("Admin not found with id: " + adminId));

        String adminType = admin.getAdminRole();

        if ("pi".equalsIgnoreCase(adminType)) {
            admin.setCourse(updateRequest.getCourse());
            admin.setAdminRole(updateRequest.getRole());
        } else if ("BatchMentor".equalsIgnoreCase(adminType)) {
            admin.setAdminRole(updateRequest.getRole());
            admin.setBatch(updateRequest.getBatch());
            admin.setCourse(updateRequest.getCourse());
        } else {
            throw new Exception("Unsupported admin type: " + adminType);
        }

        adminRepository.save(admin);
    }

    public List<AdminDTO> searchAdminsByName(String name) {
        List<String> roles = List.of("PI", "BatchMentor");
        return adminRepository.findByAdminNameContainingIgnoreCaseAndAdminRoleIn(name, roles)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ FILTER by course, batch, role
    public List<AdminDTO> filterAdmins(String course, String batch, String role) {
        return adminRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (course != null && !course.isBlank()) {
                predicates.add(cb.equal(root.get("course"), course));
            }
            if (batch != null && !batch.isBlank()) {
                predicates.add(cb.equal(root.get("batch"), batch));
            }
            if (role != null && !role.isBlank()) {
                predicates.add(cb.equal(root.get("adminRole"), role));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }).stream()
          .map(this::mapToDTO)
          .collect(Collectors.toList());
    }

    private AdminDTO mapToDTO(Admin admin) {
        return new AdminDTO(
                admin.getAdminName(),
                admin.getAdminEmail(),
                admin.getAdminMobileNo(),
                admin.getAdminRole(),
                admin.isApproved(),
                admin.getBatch(),
                admin.getCourse()
        );
    }
    
    public ResponseEntity<String> sendResetPasswordLink(String email) {
        Optional<Admin> optionalAdmin = adminRepository.findByAdminEmail(email);
        if (optionalAdmin.isEmpty() || !optionalAdmin.get().isApproved()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found or not approved");
        }

        Admin admin = optionalAdmin.get();
        String token = Base64.getEncoder().encodeToString(admin.getAdminEmail().getBytes());
        String resetLink = "http://studentinfo-phi.vercel.app/reset-password?token=" + token;

        emailService.sendHtmlMessage(
            admin.getAdminEmail(),
            "Reset Your Password",
            "<p>Click the link below to reset your password:</p>" +
            "<a href=\"" + resetLink + "\">Reset Password</a>"
        );

        return ResponseEntity.ok("Reset password link has been sent to your email.");
    }

    public ResponseEntity<String> resetPassword(String token, String newPassword) {
        try {
            String decodedEmail = new String(Base64.getDecoder().decode(token));
            Optional<Admin> optionalAdmin = adminRepository.findByAdminEmail(decodedEmail);

            if (optionalAdmin.isEmpty() || !optionalAdmin.get().isApproved()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid or expired token");
            }

            Admin admin = optionalAdmin.get();
            admin.setAdminPassword(passwordEncoder.encode(newPassword));
            adminRepository.save(admin);

            return ResponseEntity.ok("Password updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid reset token");
        }
    }


    public void resetFailedAttempts(String email) {
           adminRepository.findByAdminEmail(email).ifPresent(admin -> {
               admin.setFailedAttempts(0);
               admin.setAccountNonLocked(true);
               admin.setLockTime(null);
               adminRepository.save(admin);
           });
       }

       public void increaseFailedAttempts(String email) {
           adminRepository.findByAdminEmail(email).ifPresent(admin -> {
               int newFailAttempts = admin.getFailedAttempts() + 1;
               admin.setFailedAttempts(newFailAttempts);

               if (newFailAttempts >= 3) {
                   admin.setAccountNonLocked(false);
                   admin.setLockTime(LocalDateTime.now());
               }

               adminRepository.save(admin);
           });
       }

       // 🔹 Find admin by email
       public Optional<Admin> findByAdminEmail(String email) {
           return adminRepository.findByAdminEmail(email);
       }

       // 🔹 Save admin (used to update lock state or other fields)
       public void saveAdmin(Admin admin) {
           adminRepository.save(admin);
       }

}