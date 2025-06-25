package student_info.listener;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;
import student_info.entity.Admin;
import student_info.repository.AdminRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthenticationFailureListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

    private final AdminRepository adminRepository;

    @Override
    @Transactional
    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
        String email = (String) event.getAuthentication().getPrincipal();
        Optional<Admin> optionalAdmin = adminRepository.findByAdminEmail(email);

        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            int attempts = admin.getFailedAttempts() + 1;
            admin.setFailedAttempts(attempts);

            if (attempts >= 3) {
                admin.setAccountNonLocked(false);
                admin.setLockTime(LocalDateTime.now());
            }

            adminRepository.save(admin);
        }
    }
}
