package student_info.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor

public class AdminUpdateRequest {
    private String role;
    private String batch;
    private String course;
}
