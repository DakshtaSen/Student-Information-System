package student_info.util;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderTest {

    public static void main(String[] args) {
        String rawPassword = "superadmin123";
        String encodedPassword = new BCryptPasswordEncoder().encode(rawPassword);
        System.out.println("BCrypt password: " + encodedPassword);
    }
}
