package student_info.service;

import lombok.RequiredArgsConstructor;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByAdminEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        // Check if Super Admin has approved this admin
        if (!admin.isApproved()) {
            throw new BadCredentialsException("Your account is not yet approved by the Super Admin.");
        }

        return new User(admin.getAdminEmail(), admin.getAdminPassword(),
                Collections.singletonList(() -> "ROLE_" + admin.getAdminRole().toUpperCase()));
    }
}
