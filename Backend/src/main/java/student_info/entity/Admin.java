package student_info.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "admins") // Initially saved here
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    @Column(nullable = false)
    private String adminName;

    @Column(nullable = false, unique = true)
    private String adminEmail;

    @Column(nullable = false)
    private String adminPassword;

    @Column(nullable = false, length = 15)
    private String adminMobileNo;

    @Column(nullable = false)
    private String adminRole; // 'PI' or 'BatchMentor'

    @Column(nullable = false)
    private boolean approved = false;
    
//    @Column(nullable = false)
    private String batch;
    
    @NotBlank(message = "Course is required")
    private String course;
}