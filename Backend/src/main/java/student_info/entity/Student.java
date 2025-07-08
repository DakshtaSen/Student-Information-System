package student_info.entity;

import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students",
uniqueConstraints = {
        @UniqueConstraint(columnNames = "roll_no"),
        @UniqueConstraint(columnNames = "email")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(name = "enrollment_no")

    private String enrollmentNo;

    private String image;


    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
 
    private String gender;
    
    private Date dob;
    
    private String course;

    private String batch;

    private String contact;

    @Column(name = "roll_no")
    private String rollNo;

    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "parent_contact")
    private String parentContact;

    private String address;

    @Column(name = "blood_group")
    private String bloodGroup;
    
    private String admissionSlip;
    
    private String aadharImage;
    
    private String cuetno;

   
}
