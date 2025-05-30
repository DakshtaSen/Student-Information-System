package student_info.controller;

import java.util.List;
import java.util.Optional;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import student_info.entity.Admin;
import student_info.repository.AdminRepository;
import student_info.service.SuperAdminService;

@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    private final AdminRepository adminRepository;
    private final SuperAdminService superAdminService;

//    @Autowired
    public SuperAdminController(AdminRepository adminRepository, SuperAdminService superAdminService) {
        this.adminRepository = adminRepository;
        this.superAdminService = superAdminService;
    }

    // ✅ Approve admin via clickable email link (GET)
    @GetMapping("/approve")
    public ResponseEntity<String> approveAdminViaLink(@RequestParam Long adminId) {
        try {
            String result = superAdminService.approveAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ✅ View all unapproved admins
    @GetMapping("/unverified")
    public ResponseEntity<List<Admin>> getUnverifiedAdmins() {
        return ResponseEntity.ok(adminRepository.findByApproved(false));
    }

    // ✅ View all approved admins
    @GetMapping("/verified")
    public ResponseEntity<List<Admin>> getVerifiedAdmins() {
        return ResponseEntity.ok(adminRepository.findByApproved(true));
    }
}
