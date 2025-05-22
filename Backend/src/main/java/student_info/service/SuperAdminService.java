package student_info.service;

import org.springframework.beans.factory.annotation.Autowired;
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
            admin.setApproved(true);
            adminRepository.save(admin);
            return "Admin approved successfully.";
        } else {
            throw new RuntimeException("Admin not found with ID: " + adminId);
        }
    }
}

