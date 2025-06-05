package student_info.controller;

import jakarta.validation.Valid;
import student_info.entity.Student;
import student_info.repository.StudentRepository;
import student_info.service.EmailService;
import student_info.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;
    private final EmailService emailService;


    public StudentController(StudentService studentService, EmailService emailService) {
        this.studentService = studentService;
        this.emailService = emailService;
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

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('BATCH_MENTOR','PI')")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam String field, @RequestParam String value) {
        System.out.println("Searching by name: " + value);

        List<Student> results = studentService.searchByField(field, value);
        System.out.println(results);
        return ResponseEntity.ok(results);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BATCH_MENTOR','PI')")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BATCH_MENTOR','PI')")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
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

    @PutMapping("/{id}")
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
    
    @GetMapping("/test")
    public void test() {
        System.out.println("student"+studentService.findByName("Sneha Patil"));
    }

    
}
