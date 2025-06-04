package student_info.service;

import org.springframework.stereotype.Service;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;

import java.util.Optional;

@Service
public class SuperAdminService {

    private final AdminRepository adminRepository;

    public SuperAdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public String approveAdmin(Long adminId) {
        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);
        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            if (admin.isApproved()) {
                return "Admin is already approved.";
            }
            admin.setApproved(true);
            adminRepository.save(admin);
            return "Admin approved successfully.";
        } else {
            throw new RuntimeException("Admin not found with ID: " + adminId);
        }
    }

    public String rejectAdmin(Long adminId) {
        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);

        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();

            // ❗ Mark as unverified instead of deleting
            admin.setApproved(false);
            adminRepository.save(admin);

            return "Admin has been rejected and marked as unverified.";
        } else {
            throw new RuntimeException("Admin not found with ID: " + adminId);
        }
    }


}
