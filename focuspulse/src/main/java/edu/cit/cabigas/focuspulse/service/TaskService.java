package edu.cit.cabigas.focuspulse.service;

import edu.cit.cabigas.focuspulse.model.Task;
import edu.cit.cabigas.focuspulse.entity.User;
import edu.cit.cabigas.focuspulse.repository.TaskRepository;
import edu.cit.cabigas.focuspulse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;

    private User getUserFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setLastActiveAt(java.time.OffsetDateTime.now());
        userRepository.save(user);
        
        return user;
    }

    @Transactional
    public Task createTask(String token, Task task) {
        User user = getUserFromToken(token);
        task.setUser(user);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(String token) {
        User user = getUserFromToken(token);
        return taskRepository.findByUserAndCompletedFalse(user);
    }

    public List<Task> getHistoryTasks(String token) {
        User user = getUserFromToken(token);
        return taskRepository.findByUserAndCompletedTrue(user);
    }

    @Transactional
    public Task completeTask(String token, Long id) {
        User user = getUserFromToken(token);
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This task does not belong to you");
        }
        
        task.setCompleted(true);
        task.setCompletedAt(java.time.LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteAllHistory(String token) {
        User user = getUserFromToken(token);
        List<Task> historyTasks = taskRepository.findByUserAndCompletedTrue(user);
        taskRepository.deleteAll(historyTasks);
    }

    @Transactional
    public Task updateTask(String token, Long id, Task taskDetails) {
        User user = getUserFromToken(token);
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This task does not belong to you");
        }
        
        task.setName(taskDetails.getName());
        task.setPomodoroDuration(taskDetails.getPomodoroDuration());
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(String token, Long id) {
        User user = getUserFromToken(token);
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This task does not belong to you");
        }
        
        taskRepository.deleteById(id);
    }
}