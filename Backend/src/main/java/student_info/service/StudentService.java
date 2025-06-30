package student_info.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import student_info.entity.Admin;
import student_info.entity.Student;
import student_info.repository.AdminRepository;
import student_info.repository.StudentRepository;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final AdminRepository  Adminrepo;

    // Submit new student information
    public Student submitStudent(Student student) {
        Optional<Student> existing = studentRepository.findByEnrollmentNoAndEmail(
            student.getEnrollmentNo(), student.getEmail()
        );
        if (existing.isPresent()) {
            throw new RuntimeException("Student with the given Enrollment No and Email already exists.");
        }
        return studentRepository.save(student);
    }

    // Update existing student data
    public Student updateStudent(Student student) {
        if (student.getId() == null || !studentRepository.existsById(student.getId())) {
            throw new RuntimeException("Student not found.");
        }
        return studentRepository.save(student);
    }

    // Delete student by ID
    public void deleteById(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student with ID " + id + " does not exist.");
        }
        studentRepository.deleteById(id);
    }

    // Get all students
    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }
    
    public Optional<Student> findByEnrollmentNoAndEmail(String enrollmentNo, String email) {
        return studentRepository.findByEnrollmentNoAndEmail(enrollmentNo, email);
    }


    // Search students by various fields
    public List<Student> searchByField(String field, String value) {
        switch (field.toLowerCase()) {
            case "enrollmentno":
                return studentRepository.findByEnrollmentNo(value)
                        .map(List::of)
                        .orElse(List.of());

            case "email":
                return studentRepository.findByEmail(value)
                        .map(List::of)
                        .orElse(List.of());

            case "rollno":
                System.out.println("Searching rollNo with: " + value);  // Add this
                return studentRepository.findByRollNo(value)

                    .map(List::of)
                    .orElse(List.of());

            case "name":
                 return studentRepository.findByNameContainingIgnoreCase(value);


            case "bloodgroup":
                return studentRepository.findByBloodGroup(value);

            case "course":
                return studentRepository.findByCourse(value);

            case "batch":
                return studentRepository.findByBatch(value);

            case "address":
                return studentRepository.findByAddressContainingIgnoreCase(value);

            default:
                return List.of(); // Return empty list for unsupported fields
        }
    }


    public Page<Student> findAllPaginated(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    public Page<Student> getPaginatedStudents(String email, Pageable pageable) {
        Admin admin = Adminrepo.findByAdminEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        String role = admin.getAdminRole(); // assuming getRole() returns "batchmentor" or "pi"

        String course = admin.getCourse();

        if ("batchmentor".equalsIgnoreCase(role)) {
            String batch = admin.getBatch();
            return studentRepository.findByCourseAndBatch(course, batch, pageable);
        } else if ("pi".equalsIgnoreCase(role)) {
            return studentRepository.findByCourse(course, pageable);
        } else {
            throw new IllegalArgumentException("Invalid admin role: " + role);
        }
    }

    // ✅ Edit student if belongs to the same batch & course
    public String updateStudent(Long studentId, Student request, String adminEmail) {
        Admin admin = Adminrepo.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if ("BatchMentor".equalsIgnoreCase(admin.getAdminRole())) {
            if (!admin.getBatch().equals(student.getBatch()) ||
                !admin.getCourse().equals(student.getCourse())) {
                throw new RuntimeException("Access Denied: You can only edit students from your batch and course.");
            }
        }
        student.setName(request.getName());
        student.setContact(request.getContact());
        student.setEmail(request.getEmail());
        student.setBatch(request.getBatch());
        student.setCourse(request.getCourse());
        student.setAddress(request.getAddress());

        studentRepository.save(student);
        return "Student updated successfully.";
    }
}

