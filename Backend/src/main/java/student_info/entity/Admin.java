package student_info.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "admins")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    private String adminName;

    private String adminEmail;

    private String adminPassword;

    private String adminMobileNo;

    private String adminRole; 

    private boolean approved = false;
    
    private String batch;
    
    private String course;
    
    @Column(name = "failed_attempts")
    private int failedAttempts = 0;

    @Column(name = "lock_time")
    private LocalDateTime lockTime;

    @Column(name = "account_non_locked")
    private boolean accountNonLocked = true;

}