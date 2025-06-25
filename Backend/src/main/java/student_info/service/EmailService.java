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

            List<Admin> superAdmins = adminRepository.findByadminRole("SUPERADMIN");

            if (superAdmins.isEmpty()) {
                logger.warning("⚠️ No super admins found in the database.");
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

            logger.info("✅ Email sent to all Super Admins.");
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

    // ✅ 3. Send Confirmation to Student after form submit
    public void sendStudentConfirmationEmail(Student student) {
        try {
            String token = generateToken(student.getEnrollmentNo(), student.getEmail());
            String editLink = "http://localhost:8080/api/student/register/" + token;

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
                        <p><a href="%s" style="color: #27AE60;">Edit My Info</a></p>
                    </body>
                </html>
            """,
                student.getName(), student.getEnrollmentNo(), student.getCourse(), student.getBatch(),
                student.getRollNo(), student.getEmail(), student.getContact(), student.getFatherName(),
                student.getParentContact(), student.getAddress(), student.getBloodGroup(), editLink);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("📩 Student confirmation sent.");
        } catch (MessagingException | MailException e) {
            logger.severe("❌ Failed to send student confirmation: " + e.getMessage());
        }
    }

    // ✅ 4. Send Email after Student edits info
    public void sendStudentEditConfirmationEmail(Student student) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(student.getEmail());
            helper.setSubject("📝 Student Info Updated");

            String html = String.format("""
                <html>
                    <body style="font-family: Arial;">
                        <h2 style="color: #2980B9;">Info Updated</h2>
                        <p>Your latest data:</p>
                        <ul>
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
                        <p>If this wasn't you, contact admin!</p>
                    </body>
                </html>
            """,
                student.getEnrollmentNo(), student.getCourse(), student.getBatch(), student.getRollNo(),
                student.getEmail(), student.getContact(), student.getFatherName(),
                student.getParentContact(), student.getAddress(), student.getBloodGroup());

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("✉️ Student edit confirmation sent to: " + student.getEmail());
        } catch (MessagingException | MailException e) {
            logger.severe("❌ Error sending edit confirmation: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(Admin admin) {
        try {
            String encodedToken = Base64.getEncoder().encodeToString(admin.getAdminEmail().getBytes());
            String resetLink = "http://localhost:3000/resetpassword?token=" + encodedToken;

            sendHtmlMessage(admin.getAdminEmail(), "Reset Your Password", resetLink);
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

            String html = "<div style='font-family: Arial; padding: 20px;'>"
                    + "<h2>Reset Your Password</h2>"
                    + "<p>Click below to reset:</p>"
                    + "<a href='" + resetLink + "' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset</a>"
                    + "<p>If not requested by you, ignore this email.</p>"
                    + "</div>";

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("🔐 Password reset email sent to: " + to);
        } catch (MessagingException e) {
            logger.severe("❌ Failed to send reset email to: " + to);
        }
    }


    // ✅ Token Utility
    public String generateToken(String enrollmentNo, String email) {
        String combined = enrollmentNo + ":" + email;
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
