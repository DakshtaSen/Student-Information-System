package student_info.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Value("${super.admin.email}")
    private String superAdminEmail;

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    public void sendAdminSignUpNotification(String name, String email, String role, Long adminId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(superAdminEmail);
            message.setSubject("New Admin Registration Approval Required");

            String approvalLink = "http://localhost:8080/api/superadmin/approve?adminId=" + adminId;

            message.setText(String.format(
                "A new admin has registered:\n\nName: %s\nEmail: %s\nRole: %s\n\nClick to approve: %s",
                name, email, role, approvalLink
            ));

            mailSender.send(message);
            logger.info("Email sent to Super Admin.");
        } catch (MailException e) {
            logger.severe("Error sending approval email: " + e.getMessage());
        }
    }
}
