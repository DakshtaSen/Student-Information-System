package student_info.service;

import lombok.RequiredArgsConstructor;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

//import ch.qos.logback.classic.Level;
import student_info.entity.Admin;
import student_info.entity.Student;
import student_info.repository.AdminRepository;

import java.net.URLEncoder;
//import java.lang.System.Logger.Level;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final AdminRepository adminRepository;

    @Value("${spring.mail.username}")
    private String from;

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    // ✅ 1. Send Signup Notification to ALL Super Admins
    public void sendAdminSignUpNotification(String name, String email, String adminRole, Long adminId) {
        try {
            String approvalLink = "http://localhost:8080/api/superadmin/verify?adminId=" + adminId;

            // ✅ Fetch only approved Super Admins
            List<Admin> superAdmins = adminRepository.findByAdminRoleAndApprovedTrue("SUPERADMIN");

            if (superAdmins.isEmpty()) {
                logger.warning("⚠️ No approved super admins found in the database.");
                return;
            }

            String[] superAdminEmails = superAdmins.stream()
                    .map(Admin::getAdminEmail)
                    .toArray(String[]::new);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(superAdminEmails);
            helper.setSubject("🛡️ New Admin Registration Approval Needed");

            String html = String.format("""
                <html>
                    <body style="font-family: Arial;">
                        <h2 style="color: #E67E22;">New Admin Signup</h2>
                        <ul>
                            <li><strong>Name:</strong> %s</li>
                            <li><strong>Email:</strong> %s</li>
                            <li><strong>Role:</strong> %s</li>
                            <li><strong>Admin ID:</strong> %d</li>
                        </ul>
                        <p>Click to approve:</p>
                        <a href="%s" style="padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">✅ Approve Admin</a>
                        <p style="font-size: small; color: gray;">Automated email</p>
                    </body>
                </html>
            """, name, email, adminRole, adminId, approvalLink);

            helper.setText(html, true);
            mailSender.send(message);

            logger.info("✅ Email sent to all approved Super Admins.");
        } catch (MessagingException | MailException e) {
            logger.log(Level.SEVERE, "❌ Error sending Super Admin email: " + e.getMessage(), e);
        }
    }

    // ✅ 2. Confirmation Email after Super Admin approves new Admin
    public void sendAdminApprovalConfirmationEmail(String name, String email, String adminRole) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(email);
            helper.setSubject("✅ Admin Registration Approved");

            String html = String.format("""
                <html>
                    <body style="font-family: Arial;">
                        <h2 style="color: #28a745;">Congratulations!</h2>
                        <p>Your admin registration has been <strong>approved</strong>.</p>
                        <ul>
                            <li><strong>Name:</strong> %s</li>
                            <li><strong>Email:</strong> %s</li>
                            <li><strong>Role:</strong> %s</li>
                        </ul>
                        <p>You can now login:</p>
                        <a href="http://localhost:8080/admin/login" style="padding: 10px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                    </body>
                </html>
            """, name, email, adminRole);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("✅ Admin confirmation email sent to: " + email);
        } catch (MessagingException | MailException e) {
            logger.severe("❌ Error sending admin confirmation: " + e.getMessage());
        }
    }

    public void sendStudentConfirmationEmail(Student student) {
        try {
            String token = generateToken(student.getId(), student.getEmail());
            String editLink = "http://localhost:3000/student/edit/" + token; // React frontend link

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(student.getEmail());
            helper.setSubject("🎓 Student Registration Confirmation");

            String html = String.format("""
                <html>
                    <body style="font-family: Arial;">
                        <h2 style="color: #2E86C1;">Thank you for registering!</h2>
                        <p>Here is the data you submitted:</p>
                        <ul>
                            <li><strong>Name:</strong> %s</li>
                            <li><strong>Enrollment No:</strong> %s</li>
                            <li><strong>Course:</strong> %s</li>
                            <li><strong>Batch:</strong> %s</li>
                            <li><strong>Roll No:</strong> %s</li>
                            <li><strong>Email:</strong> %s</li>
                            <li><strong>Contact:</strong> %s</li>
                            <li><strong>Father's Name:</strong> %s</li>
                            <li><strong>Parent Contact:</strong> %s</li>
                            <li><strong>Address:</strong> %s</li>
                            <li><strong>Blood Group:</strong> %s</li>
                        </ul>
                        <p>
                            <a href="%s" style="color: #27AE60;">Edit My Info</a>
                        </p>
                    </body>
                </html>
            """,
                student.getName(), student.getEnrollmentNo(), student.getCourse(), student.getBatch(),
                student.getRollNo(), student.getEmail(), student.getContact(), student.getFatherName(),
                student.getParentContact(), student.getAddress(), student.getBloodGroup(), editLink);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("📩 Student registration confirmation email sent to: " + student.getEmail());
        } catch (MessagingException | MailException e) {
            logger.severe("❌ Failed to send student confirmation email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(Admin admin) {
        try {
            // Use URL-safe Base64 encoding and proper charset
            String encodedToken = Base64.getUrlEncoder().encodeToString(
                admin.getAdminEmail().getBytes(StandardCharsets.UTF_8)
            );
            
            // URL encode the token to handle any special characters
            String urlEncodedToken = URLEncoder.encode(encodedToken, StandardCharsets.UTF_8.name());
            String resetLink = "http://localhost:3000/resetpassword?token=" + urlEncodedToken;

            // Log for debugging purposes
            logger.info("🔐 Generated password reset link: " + resetLink);

            sendHtmlMessage(admin.getAdminEmail(), "Password Reset Request", resetLink);
        } catch (Exception e) {
            logger.severe("❌ Failed to prepare password reset email: " + e.getMessage());
        }
    }

    public void sendHtmlMessage(String to, String subject, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);

            // Improved HTML email with better styling and fallback text
            String html = "<!DOCTYPE html>"
                    + "<html>"
                    + "<head>"
                    + "<meta charset='UTF-8'>"
                    + "<style>"
                    + "  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }"
                    + "  .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }"
                    + "  .footer { margin-top: 20px; font-size: 12px; color: #777; }"
                    + "</style>"
                    + "</head>"
                    + "<body>"
                    + "<h2>Password Reset Request</h2>"
                    + "<p>We received a request to reset your password. Click the button below link to proceed:</p>"
                    + "<p><code>" + resetLink + "</code></p>"
                    + "<div class='footer'>"
                    + "<p>If you didn't request this password reset, please ignore this email.</p>"
                    + "<p>This link will expire in 24 hours for security reasons.</p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("✅ Password reset email successfully sent to: " + to);
        } catch (MessagingException e) {
            logger.severe("❌ Failed to send reset email to: " + to + " - Error: " + e.getMessage());
        }
    }

    // ✅ Token Utility
    public String generateToken(Long long1, String email) {
        String combined = long1 + ":" + email;
        return Base64.getUrlEncoder().encodeToString(combined.getBytes(StandardCharsets.UTF_8));
    }

    public String[] decodeToken(String token) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            return new String(decoded, StandardCharsets.UTF_8).split(":", 2);
        } catch (IllegalArgumentException e) {
            logger.severe("❌ Invalid token: " + e.getMessage());
            return null;
        }
    }
}
