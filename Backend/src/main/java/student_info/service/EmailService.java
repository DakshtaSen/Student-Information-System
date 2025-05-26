package student_info.service;

import lombok.RequiredArgsConstructor;
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

    public void sendStudentConfirmationEmail(Student student) {
        try {
            String token = generateToken(student.getEnrollmentNo(), student.getEmail());
            String editLink = "http://localhost:8080/api/student/edit/" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(student.getEmail());
            message.setSubject("Student Registration Confirmation");

            message.setText(String.format(
                "Thank you for registering.\n\nHere is the data you submitted:\n" +
                "Name: %s\nEnrollment No: %s\nCourse: %s\nBatch: %s\n" +
                "Roll No: %s\nEmail: %s\nContact: %s\nFather's Name: %s\n" +
                "Parent Contact: %s\nAddress: %s\nBlood Group: %s\n\n" +
                "Use the following link to edit your data:\n%s",
                student.getName(), student.getEnrollmentNo(), student.getCourse(), student.getBatch(),
                student.getRollNo(), student.getEmail(), student.getContact(), student.getFatherName(),
                student.getParentContact(), student.getAddress(), student.getBloodGroup(), editLink
            ));

            mailSender.send(message);
            logger.info("Student confirmation email sent.");
        } catch (MailException e) {
            logger.severe("Failed to send confirmation email: " + e.getMessage());
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
}
