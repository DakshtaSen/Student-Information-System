package student_info.controller;

import lombok.RequiredArgsConstructor;
import student_info.dto.AdminJwtResponse;
import student_info.dto.LoginRequest;
import student_info.dto.SignUpRequest;
import student_info.service.AdminService;
import student_info.util.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        String response = adminService.registerAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getAdminEmail(), loginRequest.getAdminPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(loginRequest.getAdminEmail());

        return ResponseEntity.ok(new AdminJwtResponse(jwt, "Bearer", 3600));
    }
}
