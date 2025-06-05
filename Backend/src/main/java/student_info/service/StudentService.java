package student_info.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import student_info.entity.Student;
import student_info.repository.StudentRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

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

//	public List<Student> findByName(String name) {
//	    return studentRepository.findByNameContainingIgnoreCase(name);
//
//	}

}

