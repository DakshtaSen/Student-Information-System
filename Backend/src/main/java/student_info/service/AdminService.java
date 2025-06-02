package student_info.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import student_info.dto.LoginRequest;
import student_info.dto.SignUpRequest;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;

import java.util.Optional;

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
        if ("BATCH_MENTOR".equalsIgnoreCase(request.getAdminRole())) {
            admin.setBatch(request.getBatch());
        } else {
            admin.setBatch(null);
        }
        admin.setApproved(false);

        Admin savedAdmin = adminRepository.save(admin);

        // Send approval email
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
}
