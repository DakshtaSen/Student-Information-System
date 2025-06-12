package student_info.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import student_info.entity.Student;

import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long>,JpaSpecificationExecutor<Student>{

    // Unique student lookup by enrollmentNo and email
    Optional<Student> findByEnrollmentNoAndEmail(String enrollmentNo, String email);

    // Unique student lookup by enrollmentNo
    Optional<Student> findByEnrollmentNo(String enrollmentNo);

    // Unique student lookup by rollNo
    Optional<Student> findByRollNo(String rollNo);

    // Unique student lookup by email
    Optional<Student> findByEmail(String email);  // ✅ Added for search

    // Search students by partial name (case insensitive)
    List<Student> findByNameContainingIgnoreCase(String name);

    // Search students by blood group (exact match)
    List<Student> findByBloodGroup(String bloodGroup);

    // Search students by course (exact match)
    List<Student> findByCourse(String course);

    // Search students by batch (exact match)
    List<Student> findByBatch(String batch);

    // Search students by partial address (case insensitive)
    List<Student> findByAddressContainingIgnoreCase(String address);

    Page<Student> findAll(Pageable pageable);

    Page<Student> findByCourseAndBatch(String course, String batch, Pageable pageable);
}
