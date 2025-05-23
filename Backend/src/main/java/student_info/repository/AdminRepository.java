package student_info.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import student_info.entity.Admin;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Needed for login and sign-up checks
    Optional<Admin> findByAdminEmail(String adminEmail);

    // Use this for email uniqueness check during registration
    boolean existsByAdminEmail(String adminEmail);
    
    // For super admin to list approved/unapproved admins
    List<Admin> findByApproved(boolean approved);

}
