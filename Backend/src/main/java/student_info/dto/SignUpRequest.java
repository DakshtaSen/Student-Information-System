package student_info.dto;


import lombok.*;
import jakarta.validation.constraints.*; // Correct package for Spring Boot 3+



import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
public class SignUpRequest {
    private String adminName;
    private String adminEmail;
    private String adminPassword;
    private String confirmPassword;
    private String adminMobileNo;
    private String adminRole; // PI or BatchMentor
	
    
}

