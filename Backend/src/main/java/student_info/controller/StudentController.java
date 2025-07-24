package student_info.controller;

import jakarta.validation.Valid;
import student_info.dto.StudentFilterRequest;
import student_info.entity.Student;
import student_info.repository.StudentRepository;
import student_info.service.EmailService;
import student_info.service.StudentService;
import student_info.specification.StudentSpecification;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;
    private final EmailService emailService;
   
//    private final StudentRepository studentRepository;
    private final StudentRepository studentrepository;
    
    public StudentController(StudentService studentService, EmailService emailService,StudentRepository studentrepository ) {
        this.studentService = studentService;
        this.emailService = emailService;
		this.studentrepository = studentrepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> submitStudent(@Valid @RequestBody Student student) {
        try {
            Student saved = studentService.submitStudent(student);
            emailService.sendStudentConfirmationEmail(saved);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email or enrollment number already exists.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    @GetMapping("/viewstudent")
    @PreAuthorize("hasAnyRole('PI', 'BATCH_MENTOR')")
    public ResponseEntity<Page<Student>> getPaginatedStudentsForBM(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {

        String email = authentication.getName(); // get logged-in BM email
        System.out.println(email);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Student> studentPage = studentService.getPaginatedStudents(email, pageable);

        return ResponseEntity.ok(studentPage);
    }

    // ✅ PUT update student
//    @PutMapping("/updateStudent/{id}")
//    public ResponseEntity<String> updateStudent(@PathVariable Long id,
//                                                @RequestBody Student request) {
////        String email = authentication.getName();  // logged-in admin's email
//        String result = studentService.updateStudent(id, request);
//        return ResponseEntity.ok(result);
//    }

    
    //student can update their info
    // ✅ 2. Prefill data using token
    @GetMapping("/editstudent/{token}")
    public ResponseEntity<?> getStudentForEdit(@PathVariable String token) {
        String[] decoded = emailService.decodeToken(token);
        System.out.println("🧩 Decoded Token: " + Arrays.toString(decoded));

        if (decoded == null || decoded.length != 2) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token.");
        }

        try {
            Long studentId = Long.parseLong(decoded[0]);
            String email = decoded[1];

            Optional<Student> optional = studentrepository.findById(studentId);
            if (optional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
            }

            Student student = optional.get();
            if (!student.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email mismatch.");
            }

            return ResponseEntity.ok(student);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Malformed student ID in token.");
        }
    }
    
    
    @PutMapping("/editstudent/{token}")
    public ResponseEntity<?> editStudent(@PathVariable String token, @RequestBody Student incomingStudent) {
    	System.out.println("update student") ;
    	String[] decoded = emailService.decodeToken(token);
        if (decoded == null || decoded.length != 2) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or corrupted token.");
        }

        try {
            Long studentId = Long.parseLong(decoded[0]);
            String email = decoded[1];

            Optional<Student> optional = studentrepository.findById(studentId);
            if (optional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
            }

            Student existing = optional.get();

            if (!existing.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email mismatch.");
            }

            // ✅ Safely update only editable fields
            existing.setName(incomingStudent.getName());
            existing.setCourse(incomingStudent.getCourse());
            existing.setBatch(incomingStudent.getBatch());
            existing.setContact(incomingStudent.getContact());
            existing.setFatherName(incomingStudent.getFatherName());
            existing.setParentContact(incomingStudent.getParentContact());
            existing.setAddress(incomingStudent.getAddress());
            existing.setBloodGroup(incomingStudent.getBloodGroup());
            existing.setDob(incomingStudent.getDob());
            existing.setGender(incomingStudent.getGender());
            existing.setImage(incomingStudent.getImage());
            existing.setAadharImage(incomingStudent.getAadharImage());
            existing.setAdmissionSlip(incomingStudent.getAdmissionSlip());
            existing.setEnrollmentNo(incomingStudent.getEnrollmentNo());
            existing.setRollNo(incomingStudent.getRollNo());
            existing.setCuetno(incomingStudent.getCuetno());
            existing.setEmail(incomingStudent.getEmail());

            Student updated = studentrepository.save(existing);
                System.out.println(updated);
            // ✅ Optional: send updated confirmation mail
            emailService.sendStudentConfirmationEmail(updated); // ✅ Reusing same email method is fine now

            return ResponseEntity.ok(updated);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Malformed student ID.");
        }
    }

//
    @PreAuthorize("hasAnyRole('PI', 'BATCH_MENTOR')")
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam String query) {
        StudentFilterRequest dummyFilter = new StudentFilterRequest();
        dummyFilter.setSearchTerm(query);  // Only setting searchTerm
        List<Student> results = studentrepository.findAll(
            StudentSpecification.getFilteredStudents(dummyFilter)
        );
        return ResponseEntity.ok(results);
    }

    // 🧩 Case 2 and 3: Course + Batch or Full Filter
    @PostMapping("/filter")
    public ResponseEntity<List<Student>> filterStudents(@RequestBody StudentFilterRequest filterRequest) {
        List<Student> results = studentrepository.findAll(
            StudentSpecification.getFilteredStudents(filterRequest)
        );
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/All")
    @PreAuthorize("hasAnyRole('BATCH_MENTOR','PI')")
    public ResponseEntity<Page<Student>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentPage = studentService.findAllPaginated(pageable);
        return ResponseEntity.ok(studentPage);
    }

    //bm update student
    @GetMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('BATCH_MENTOR')")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
    	System.out.println("student id"+id);
        Optional<Student> student = studentService.findById(id);
        return student.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    @PreAuthorize("hasRole('BATCH_MENTOR')")
    public ResponseEntity<?> createStudent(@Valid @RequestBody Student student) {
        try {
            Student saved = studentService.submitStudent(student);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/updateStudent/{id}")  //update student by bm
    @PreAuthorize("hasRole('BATCH_MENTOR')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody Student student) {
        Optional<Student> existing = studentService.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        try {
            student.setId(id);
            Student updated = studentService.updateStudent(student);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BATCH_MENTOR')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
    
    
    
    
//    @GetMapping("/edit/{token}")
//    public ResponseEntity<?> getStudentByToken(@PathVariable String token) {
//        try {
//            String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
//            String[] parts = decoded.split(":");
//
//            if (parts.length != 2) {
//                return ResponseEntity.badRequest().body("Invalid token format");
//            }
//
//            String enrollmentNo = parts[0];
//            String email = parts[1];
//
//            Optional<Student> optionalStudent = studentrepository.findByEnrollmentNoAndEmail(enrollmentNo, email);
//            if (optionalStudent.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
//            }
//
//            return ResponseEntity.ok(optionalStudent.get());
//
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body("Invalid token");
//        }
//    }


}