package student_info.dto;

import lombok.*;
import jakarta.validation.constraints.*; // Correct package for Spring Boot 3+


@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor

public class LoginRequest {
    private String adminEmail;
    private String adminPassword;
    // Getters and setters
}
