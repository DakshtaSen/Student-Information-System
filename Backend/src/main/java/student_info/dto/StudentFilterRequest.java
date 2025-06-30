package student_info.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentFilterRequest {
    private String searchTerm;     
    private String gender;         
    private String bloodGroup;     
    private String course;         
    private String batch;          
}
