package student_info.controller;

import java.util.List;
import java.util.Map;

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

    public SuperAdminController(AdminRepository adminRepository, SuperAdminService superAdminService) {
        this.adminRepository = adminRepository;
        this.superAdminService = superAdminService;
    }

    // ✅ Approve Admin via email clickable link
    @GetMapping("/approve")
    public ResponseEntity<String> approveAdminViaLink(@RequestParam Long adminId) {
        try {
            String result = superAdminService.approveAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ✅ Reject Admin via email clickable link
    @GetMapping("/reject")
    public ResponseEntity<String> rejectAdminViaLink(@RequestParam Long adminId) {
        try {
            String result = superAdminService.rejectAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ✅ View Unverified Admins
    @GetMapping("/unverified")
    public ResponseEntity<List<Admin>> getUnverifiedAdmins() {
        return ResponseEntity.ok(adminRepository.findByApproved(false));
    }

    // ✅ View Verified Admins
    @GetMapping("/verified")
    public ResponseEntity<List<Admin>> getVerifiedAdmins() {
        return ResponseEntity.ok(adminRepository.findByApproved(true));
    }

    // ✅ Get list of verified Batch Mentors
    @GetMapping("/batchmentors")
    public ResponseEntity<List<Admin>> getBatchMentors() {
        return ResponseEntity.ok(adminRepository.findByAdminRoleAndApproved("BatchMentor", true));
    }

    // ✅ Get list of verified PIs
    @GetMapping("/pis")
    public ResponseEntity<List<Admin>> getPIs() {
        return ResponseEntity.ok(adminRepository.findByAdminRoleAndApproved("PI", true));
    }

    // ✅ Count summary
    @GetMapping("/summary")
    public ResponseEntity<?> getAdminSummary() {
        long totalVerified = adminRepository.countByApproved(true);
        long totalUnverified = adminRepository.countByApproved(false);
        long totalPIs = adminRepository.countByAdminRoleAndApproved("PI", true);
        long totalBatchMentors = adminRepository.countByAdminRoleAndApproved("BatchMentor", true);

        return ResponseEntity.ok(
            Map.of(
                "totalVerified", totalVerified,
                "totalUnverified", totalUnverified,
                "totalPIs", totalPIs,
                "totalBatchMentors", totalBatchMentors
            )
        );
    }

    // ✅ Approve via button (POST)
    @PostMapping("/approve/{adminId}")
    public ResponseEntity<String> approveAdmin(@PathVariable Long adminId) {
        try {
            String result = superAdminService.approveAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ✅ Reject via button (POST)
    @PostMapping("/reject/{adminId}")
    public ResponseEntity<String> rejectAdmin(@PathVariable Long adminId) {
        try {
            String result = superAdminService.rejectAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
