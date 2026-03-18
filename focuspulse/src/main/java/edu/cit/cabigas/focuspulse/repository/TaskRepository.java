package edu.cit.cabigas.focuspulse.repository;

import edu.cit.cabigas.focuspulse.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Custom queries can go here if needed
}