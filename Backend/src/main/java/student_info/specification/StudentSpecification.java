package student_info.specification;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import student_info.dto.StudentFilterRequest;
import student_info.entity.Student;

public class StudentSpecification {

    public static Specification<Student> getFilteredStudents(StudentFilterRequest req) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 🔍 DEBUG LOGGING
            System.out.println("🟡 Incoming Filter Request:");
            System.out.println("Search: " + req.getSearchTerm());
            System.out.println("Gender: " + req.getGender());
            System.out.println("Blood Group: " + req.getBloodGroup());
            System.out.println("Course: " + req.getCourse());
            System.out.println("Batch: " + req.getBatch());

            // 🔍 Search by name, roll no, enrollment no
            if (req.getSearchTerm() != null && !req.getSearchTerm().isBlank()) {
                String likeTerm = "%" + req.getSearchTerm().trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), likeTerm);
                Predicate rollMatch = cb.like(cb.lower(root.get("rollNo")), likeTerm);
                Predicate enrollMatch = cb.like(cb.lower(root.get("enrollmentNo")), likeTerm);
                predicates.add(cb.or(nameMatch, rollMatch, enrollMatch));
            }

            // ⚙️ Blood Group
            if (req.getBloodGroup() != null && !req.getBloodGroup().trim().equalsIgnoreCase("All") && !req.getBloodGroup().trim().isEmpty()) {
                String bloodGroup = req.getBloodGroup().trim().toUpperCase();
                predicates.add(cb.equal(cb.upper(cb.trim(root.get("bloodGroup"))), bloodGroup));
            }

            // ⚙️ Gender
            if (req.getGender() != null && !req.getGender().trim().equalsIgnoreCase("All") && !req.getGender().trim().isEmpty()) {
                String gender = req.getGender().trim().toUpperCase();
                predicates.add(cb.equal(cb.upper(cb.trim(root.get("gender"))), gender));
            }

            // 🎓 Course
            if (req.getCourse() != null && !req.getCourse().trim().equalsIgnoreCase("All") && !req.getCourse().trim().isEmpty()) {
                String course = req.getCourse().trim().toUpperCase();
                predicates.add(cb.equal(cb.upper(cb.trim(root.get("course"))), course));
            }

            // 🕒 Batch
            if (req.getBatch() != null && !req.getBatch().trim().equalsIgnoreCase("All") && !req.getBatch().trim().isEmpty()) {
                String batch = req.getBatch().trim().toUpperCase();
                predicates.add(cb.equal(cb.upper(cb.trim(root.get("batch"))), batch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
