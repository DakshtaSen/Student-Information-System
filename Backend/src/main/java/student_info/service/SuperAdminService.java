package student_info.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final AdminRepository adminRepository;
    private final EmailService emailService;

    public String approveAdmin(Long adminId) {
        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);

        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            admin.setApproved(true);
            adminRepository.save(admin);

            // ✅ Send confirmation email to the approved admin
            emailService.sendAdminApprovalConfirmationEmail(
                admin.getAdminName(),
                admin.getAdminEmail(),
                admin.getAdminRole()
            );

            return "✅ Admin approved successfully.";
        } else {
            throw new RuntimeException("❌ Admin not found with ID: " + adminId);
        }
    }
}
