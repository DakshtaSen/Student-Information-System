package student_info.service;

import lombok.RequiredArgsConstructor;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import student_info.entity.Student;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
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
    	System.out.println(adminId);
        try {
            String approvalLink = "http://localhost:8080/api/superadmin/verify?adminId=" + adminId;

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(from);
            helper.setTo(superAdminEmail);
            helper.setSubject("🛡️ New Admin Registration Approval Needed");

            String htmlContent = String.format("""
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #E67E22;">New Admin Signup </h2>
                        <p>The following admin has requested registration:</p>
                        <ul>
                            <li><strong>Name:</strong> %s</li>
                            <li><strong>Email:</strong> %s</li>
                            <li><strong>Role:</strong> %s</li>
                            <li><strong>Admin ID:</strong> %d</li>
                        </ul>
                        <p>Click the button below to <strong>approve this admin</strong>:</p>
                        <p>
                            <a href="%s" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">✅ Approve Admin</a>
                        </p>
                        <br>
                        <p style="font-size: small; color: gray;">This is an automated notification email.</p>
                    </body>
                </html>
            """, name, email, role, adminId, approvalLink);

            helper.setText(htmlContent, true); // true = HTML content
            mailSender.send(mimeMessage);

            logger.info("Styled email sent to Super Admin.");
        } catch (MessagingException | MailException e) {
            logger.severe("Error sending decorated approval email: " + e.getMessage());
        }
    }
    public void sendAdminApprovalConfirmationEmail(String name, String email, String role) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(from);
            helper.setTo(email);
            helper.setSubject("✅ Admin Registration Approved");

            String htmlContent = String.format("""
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #28a745;">Congratulations!</h2>
                        <p>Your admin registration has been <strong>approved</strong>.</p>
                        <ul>
                            <li><strong>Name:</strong> %s</li>
                            <li><strong>Email:</strong> %s</li>
                            <li><strong>Role:</strong> %s</li>
                        </ul>
                        <p>You can now log in to the admin dashboard using your credentials.</p>
                        <p>
                            <a href="http://localhost:8080/admin/login"
                               style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                               Go to Admin Dashboard
                            </a>
                        </p>
                        <p style="font-size: small; color: gray;">This is an automated email. Please do not reply.</p>
                    </body>
                </html>
            """, name, email, role);

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            logger.info("✅ Admin approval confirmation email sent to: " + email);
        } catch (MessagingException | MailException e) {
            logger.severe("❌ Error sending admin approval confirmation email: " + e.getMessage());
        }
    }



    public void sendStudentConfirmationEmail(Student student) {
        try {
            String token = generateToken(student.getEnrollmentNo(), student.getEmail());
            String editLink = "http://localhost:8080/api/student/register/" + token;

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(from);
            helper.setTo(student.getEmail());
            helper.setSubject("🎓 Student Registration Confirmation");

            String htmlContent = String.format("""
                <html>
                    <body style="font-family: Arial, sans-serif;">
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
                        <p>Click the link below to <strong>edit your information</strong>:</p>
                        <p><a href="%s" style="color: #27AE60;">Edit My Info</a></p>
                        <br>
                        <p style="font-size: small; color: gray;">Please do not reply to this email.</p>
                    </body>
                </html>
                """,
                student.getName(), student.getEnrollmentNo(), student.getCourse(), student.getBatch(),
                student.getRollNo(), student.getEmail(), student.getContact(), student.getFatherName(),
                student.getParentContact(), student.getAddress(), student.getBloodGroup(), editLink
            );

            helper.setText(htmlContent, true); // true = enable HTML

            mailSender.send(mimeMessage);
            logger.info("Student  confirmation email sent.");
        } catch (MessagingException | MailException e) {
            logger.severe("Failed to send  confirmation email: " + e.getMessage());
        }
    }
    public void sendStudentEditConfirmationEmail(Student student) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(from);
            helper.setTo(student.getEmail());
            helper.setSubject("📝 Student Info Updated Successfully");

            String htmlContent = String.format("""
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #2980B9;">Your Information Has Been Updated</h2>
                        <p>Dear %s,</p>
                        <p>This is to inform you that your student information has been successfully updated. Below is your latest data:</p>
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
                        <p>If this was not done by you, please contact the admin immediately.</p>
                        <br>
                        <p style="font-size: small; color: gray;">This is an automated email. Please do not reply.</p>
                    </body>
                </html>
            """,
            student.getName(), student.getEnrollmentNo(), student.getCourse(), student.getBatch(),
            student.getRollNo(), student.getEmail(), student.getContact(), student.getFatherName(),
            student.getParentContact(), student.getAddress(), student.getBloodGroup()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            logger.info("📬 Student edit confirmation email sent to: " + student.getEmail());
        } catch (MessagingException | MailException e) {
            logger.severe("❌ Failed to send edit confirmation email: " + e.getMessage());
        }
    }



    public String generateToken(String enrollmentNo, String email) {
        String combined = enrollmentNo + ":" + email;
        return Base64.getUrlEncoder().encodeToString(combined.getBytes(StandardCharsets.UTF_8));
    }

    public String[] decodeToken(String token) {
        try {
            byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
            String decoded = new String(decodedBytes, StandardCharsets.UTF_8);
            return decoded.split(":", 2);
        } catch (IllegalArgumentException e) {
            logger.severe("Invalid token: " + e.getMessage());
            return null;
        }
    }
    public void sendHtmlMessage(String to, String subject, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom("your_email@gmail.com"); // ✅ Replace with your own email
            helper.setTo(to);
            helper.setSubject(subject);

            // HTML content
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;'>"
                    + "<h2 style='color: #333;'>Reset Your Password</h2>"
                    + "<p>Hello,</p>"
                    + "<p>We received a request to reset your password.</p>"
                    + "<p>Click the button below to reset it:</p>"
                    + "<a href='" + resetLink + "' style='display: inline-block; margin: 10px 0; padding: 10px 20px; "
                    + "background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;'>"
                    + "Reset Password</a>"
                    + "<p>If you did not request this, you can safely ignore this email.</p>"
                    + "<br><p style='font-size: 12px; color: #999;'>– Student Management System Team</p>"
                    + "</div>";

            helper.setText(htmlContent, true); // true = send as HTML

            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + to);

        } catch (MessagingException e) {
            System.err.println("❌ Error sending email to: " + to);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        }
    }

}
