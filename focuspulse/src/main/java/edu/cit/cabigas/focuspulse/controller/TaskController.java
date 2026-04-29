package edu.cit.cabigas.focuspulse.controller;

import edu.cit.cabigas.focuspulse.model.Task;  // Correct import for Task model
import edu.cit.cabigas.focuspulse.service.TaskService;  // Correct import for TaskService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestHeader("Authorization") String token, @RequestBody Task task) {
        Task createdTask = taskService.createTask(token, task);
        return ResponseEntity.ok(createdTask);
    }

    // Get all tasks for the logged in user
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@RequestHeader("Authorization") String token) {
        List<Task> tasks = taskService.getAllTasks(token);
        return ResponseEntity.ok(tasks);
    }

    // Update a task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(token, id, taskDetails);
        return ResponseEntity.ok(updatedTask);
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        taskService.deleteTask(token, id);
        return ResponseEntity.noContent().build();
    }

    // Get all completed tasks (history)
    @GetMapping("/history")
    public ResponseEntity<List<Task>> getHistoryTasks(@RequestHeader("Authorization") String token) {
        List<Task> tasks = taskService.getHistoryTasks(token);
        return ResponseEntity.ok(tasks);
    }

    // Mark a task as completed
    @PutMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        Task completedTask = taskService.completeTask(token, id);
        return ResponseEntity.ok(completedTask);
    }

    // Delete all history tasks
    @DeleteMapping("/history")
    public ResponseEntity<Void> deleteAllHistory(@RequestHeader("Authorization") String token) {
        taskService.deleteAllHistory(token);
        return ResponseEntity.noContent().build();
    }
}