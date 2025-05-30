package student_info.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminJwtResponse {
	 private String token;
	    private String tokenType;
	    private int expiresIn;
}
