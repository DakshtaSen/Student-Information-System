package student_info.controller;

import jakarta.validation.Valid;
import student_info.dto.StudentFilterRequest;
import student_info.entity.Student;
import student_info.repository.StudentRepository;
import student_info.service.EmailService;
import student_info.service.StudentService;
import student_info.specification.StudentSpecification;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
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
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
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

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Student> studentPage = studentService.getPaginatedStudentsForBM(email, pageable);

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
    @PutMapping("/edit/{token}")
    public ResponseEntity<?> editStudent(@PathVariable String token, @Valid @RequestBody Student student) {
        String[] decoded = emailService.decodeToken(token);
        if (decoded == null || !student.getEnrollmentNo().equals(decoded[0]) || !student.getEmail().equals(decoded[1])) {
            return ResponseEntity.status(403).body("Invalid or mismatched token.");
        }
        try {
            Optional<Student> existing = studentService.findByEnrollmentNoAndEmail(decoded[0], decoded[1]);
            if (existing.isEmpty()) {
                return ResponseEntity.status(404).body("Student not found.");
            }
            student.setId(existing.get().getId());
            Student updated = studentService.updateStudent(student);
            emailService.sendStudentEditConfirmationEmail(updated);

            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
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
    

}
