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
 
    private String gender;
    
    private Date dob;
    
    private String course;
    
    private String category;

    private String batch;

    private String contact;
 
    private String religion;
    
    private String ews;
    
    private String pwd;
    
    private String annualIncome;
    
    private String minority;
    
    private String motherContact;
    
    private String guardianContact;
    
    @Column(name = "roll_no", nullable = false, unique = true)
    private String rollNo;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "father_name")
    private String fatherName;
    
    private String motherName;
    
    private String guardianName;
    @Column(name = "parent_contact")
    private String parentContact;

    private String address;

    private String permanentaddress;
    
    @Column(name = "blood_group")
    private String bloodGroup;
    
    private String admissionSlip;
    
    private String aadharImage;
    
    private String cuetno;
     
}