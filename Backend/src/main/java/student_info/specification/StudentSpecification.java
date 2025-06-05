package student_info.specification;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import student_info.dto.StudentFilterRequest;
import student_info.entity.Student;

public class StudentSpecification {

    public static Specification<Student> getFilteredStudents(StudentFilterRequest req) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (req.getSearchTerm() != null && !req.getSearchTerm().isBlank()) {
                String likeTerm = "%" + req.getSearchTerm().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), likeTerm);
                Predicate rollMatch = cb.like(cb.lower(root.get("rollNo")), likeTerm);
                Predicate enrollMatch = cb.like(cb.lower(root.get("enrollmentNo")), likeTerm);
                predicates.add(cb.or(nameMatch, rollMatch, enrollMatch));
            }

            if (req.getGender() != null && !req.getGender().equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("gender"), req.getGender()));
            }

            if (req.getBloodGroup() != null && !req.getBloodGroup().equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("bloodGroup"), req.getBloodGroup()));
            }

            if (req.getCourse() != null && !req.getCourse().equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("course"), req.getCourse()));
            }

            if (req.getBatch() != null && !req.getBatch().equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("batch"), req.getBatch()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
