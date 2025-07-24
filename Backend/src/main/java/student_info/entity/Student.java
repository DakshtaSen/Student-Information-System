package student_info.entity;

import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students")
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
    
    @Column(name = "enrollment_no", unique = true)
    private String enrollmentNo;

    private String image;
<<<<<<< HEAD

    private String admissionSlip;
    private String aadharImage;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

=======
 
>>>>>>> 78c32857a3837ffde2b866e891a4256ebdad80f1
    private String gender;
    private String cuetno;
    private Date dob;
    
    private String course;

    private String batch;

    private String contact;

    @Column(name = "roll_no", nullable = false, unique = true)
    private String rollNo;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

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
