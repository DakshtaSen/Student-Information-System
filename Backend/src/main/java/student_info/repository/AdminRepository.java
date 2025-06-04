package student_info.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import student_info.entity.Admin;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByAdminEmail(String adminEmail);

    boolean existsByAdminEmail(String adminEmail);

    List<Admin> findByApproved(boolean approved);

    List<Admin> findByAdminRoleAndApproved(String adminRole, boolean approved);

    long countByApproved(boolean approved);

    long countByAdminRoleAndApproved(String adminRole, boolean approved);
}
