package student_info.dto;

import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
public class AdminDTO {
    private String adminName;
    private String adminEmail;
    private String adminMobileNo;
    private String adminRole;
    private boolean approved;
    private String batch;
    private String course;
}