package student_info.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentFilterRequest {
    private String searchTerm;     // optional
    private String gender;         // Male, Female, or All
    private String bloodGroup;     // B+, O-, etc. or All
    private String course;         // or All
    private String batch;          // or All
}
