package edu.cit.cabigas.focuspulse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.cabigas.focuspulse.entity.User;
import edu.cit.cabigas.focuspulse.model.Task;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndCompletedFalse(User user);
    List<Task> findByUserAndCompletedTrue(User user);
}
