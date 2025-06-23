package student_info.service;

import lombok.RequiredArgsConstructor;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByAdminEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        // ✅ Check if approved by super admin
        if (!admin.isApproved()) {
            throw new BadCredentialsException("Your account is not yet approved by the Super Admin.");
        }

        // ✅ Check lock status
        if (!admin.isAccountNonLocked()) {
            if (admin.getLockTime() != null) {
                long minutesSinceLock = Duration.between(admin.getLockTime(), LocalDateTime.now()).toMinutes();
                if (minutesSinceLock >= 15) {
                    // Unlock after 15 minutes
                    admin.setAccountNonLocked(true);
                    admin.setFailedAttempts(0);
                    admin.setLockTime(null);
                    adminRepository.save(admin);
                } else {
                    throw new LockedException("Account is locked. Try again after " + (15 - minutesSinceLock) + " minutes.");
                }
            } else {
                throw new LockedException("Account is locked.");
            }
        }

        // ✅ Return Spring Security user object
        return new User(
                admin.getAdminEmail(),
                admin.getAdminPassword(),
                admin.isAccountNonLocked(),   // enabled
                true,                         // accountNonExpired
                true,                         // credentialsNonExpired
                true,                         // accountNonLocked
                Collections.singletonList(() -> "ROLE_" + admin.getAdminRole().toUpperCase())
        );
    }
}