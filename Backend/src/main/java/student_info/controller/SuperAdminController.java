package student_info.controller;

import java.util.List;
import java.util.Map;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import student_info.dto.AdminDTO;
import student_info.dto.AdminUpdateRequest;
import student_info.dto.LoginRequest;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;
import student_info.service.AdminService;
import student_info.service.SuperAdminService;

@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    private final AdminRepository adminRepository;
    private final SuperAdminService superAdminService;
    private final AdminService adminservice ;

    public SuperAdminController(AdminRepository adminRepository, SuperAdminService superAdminServic,AdminService adminservice) {
        this.adminRepository = adminRepository;
        this.superAdminService = superAdminServic;
		this.adminservice = adminservice;
    }

    @GetMapping("/approve")
    public ResponseEntity<String> approveAdminViaLink(@RequestParam Long adminId) {
        try {
            String result = superAdminService.approveAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/reject")
    public ResponseEntity<String> rejectAdminViaLink(@RequestParam Long adminId) {
        try {
            String result = superAdminService.rejectAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/unverified")
    public ResponseEntity<List<Admin>> getUnverifiedAdmins() {
    	List<Admin> unverified=adminRepository.findByApproved(false);
        System.out.println("Found " + unverified.size() + " unverified admins");

        return ResponseEntity.ok(unverified);
    }

    @GetMapping("/verified")
    public ResponseEntity<List<Admin>> getVerifiedAdmins() {
        List<Admin> verifiedAdmins = adminRepository.findByApproved(true);
        System.out.println("Found " + verifiedAdmins.size() + " verified admins");
        return ResponseEntity.ok(verifiedAdmins);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<AdminDTO>> searchAdmins(@RequestParam String name) {
    	System.out.println(name);
        return ResponseEntity.ok(adminservice.searchAdminsByName(name));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<AdminDTO>> filterAdmins(
            @RequestParam(required = false) String course,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(adminservice.filterAdmins(course, batch, role));
    }

    
    @GetMapping("/summary")
    public ResponseEntity<List<Admin>> getAllUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        System.out.println("Current User Authorities: " + auth.getAuthorities());

        List<Admin> users;
			users = adminservice.getAllAdmins();
        return ResponseEntity.ok(users);
    }

    
    @PatchMapping("/approve/{adminId}")
    public ResponseEntity<String> approveAdmin(@PathVariable Long adminId) {
    	System.out.println("adminid"+adminId);
        try {
            String result = superAdminService.approveAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/verify/{adminId}")
    public void verifyAdmin(@PathVariable Long adminId) {
    	System.out.println("adminid"+adminId);
        try {
            String result = superAdminService.approveAdmin(adminId);
        	System.out.println("admin  verified"+result);

        } catch (RuntimeException e) {
        	System.out.println("admin not verified");
        }
    }
    
    @DeleteMapping("/reject/{adminId}")
    public ResponseEntity<String> rejectAdmin(@PathVariable Long adminId) {
    	System.out.println("delte admin with id "+adminId);

        try {
            String result = superAdminService.rejectAdmin(adminId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @PutMapping("/savechanges/{adminId}")
    public ResponseEntity<String> updateAdminRoleBatchCourse(
            @PathVariable Long adminId,
            @RequestBody AdminUpdateRequest updateRequest) {
        
        System.out.println("Updating admin with id: " + adminId + ", data: " + updateRequest);

        try {
            adminservice.updateAdminWithTypeLogic(adminId, updateRequest);
            return ResponseEntity.ok("Admin updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }
}
