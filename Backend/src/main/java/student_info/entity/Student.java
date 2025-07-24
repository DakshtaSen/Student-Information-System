package student_info.entity;

import java.util.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"enrollment_no", "email"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Enrollment No is required")
    @Column(name = "enrollment_no")
    private String enrollmentNo;

//    @NotNull(message = "Image is required")

    @Column(name = "image")
    private String image;

    private String admissionSlip;
    private String aadharImage;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String gender;
    private String cuetno;
    private Date dob;
    
    @NotBlank(message = "Course is required")
    private String course;

    @NotBlank(message = "Batch is required")
    private String batch;

    @NotBlank(message = "Contact is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid contact number")
    private String contact;

    @NotBlank(message = "Roll No is required")
    @Column(name = "roll_no")
    private String rollNo;

    @NotBlank(message = "Father's Name is required")
    @Column(name = "father_name")
    private String fatherName;

    @NotBlank(message = "Parent Contact is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid parent contact number")
    @Column(name = "parent_contact")
    private String parentContact;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Blood Group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group (e.g., A+, B-, O+)")
    @Column(name = "blood_group")
    private String bloodGroup;

   
}
