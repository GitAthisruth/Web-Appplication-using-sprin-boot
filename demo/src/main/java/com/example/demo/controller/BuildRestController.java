package com.example.demo.controller;

import com.example.demo.model.Build;
import com.example.demo.model.User;
import com.example.demo.service.BuildUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("test")
public class BuildRestController {

    @Autowired
    private BuildUserService buildUserService;

    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkIfBuildExists(
            @RequestParam String model,
            @RequestParam String color,
            @RequestParam String finish,
            @RequestParam String wheel,
            @RequestParam String trim,
            @RequestParam String interior,
            @RequestParam String headlining,
            Authentication authentication
    ) {
        User user = buildUserService.getCurrentUser(authentication);
        Build buildRequest = new Build();
        buildRequest.setModel(model);
        buildRequest.setColor(color);
        buildRequest.setFinish(finish);
        buildRequest.setWheel(wheel);
        buildRequest.setTrim(trim);
        buildRequest.setInterior(interior);
        buildRequest.setHeadlining(headlining);

        boolean exists = buildUserService.checkIfBuildExists(user, buildRequest);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/sample")
    public ResponseEntity<String> toggleBuild(@RequestBody Build buildRequest, Authentication authentication) {
        User user = buildUserService.getCurrentUser(authentication);
        String message = buildUserService.toggleBuild(user, buildRequest);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/save-build")
    public ResponseEntity<String> saveOnly(@RequestBody Build buildRequest, Authentication authentication) {
        User user = buildUserService.getCurrentUser(authentication);

        boolean exists = buildUserService.checkIfBuildExists(user, buildRequest);
        if (exists) {
            return ResponseEntity.badRequest().body("Build already exists.");
        }

        buildRequest.setUser(user);
        buildUserService.saveBuild(buildRequest);
        return ResponseEntity.ok("Build saved.");
    }

    @PutMapping("/sample")
    public ResponseEntity<String> updateBuild(@RequestBody Build buildRequest, Authentication authentication) {
        try {
            User user = buildUserService.getCurrentUser(authentication);
            String msg = buildUserService.updateBuild(user, buildRequest);
            return ResponseEntity.ok(msg);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Build>> getAllBuilds(Authentication authentication) {
        User user = buildUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(buildUserService.getAllBuilds(user));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteBuild(@RequestBody Build buildRequest, Authentication authentication) {
        if (buildRequest == null || authentication == null) {
            return ResponseEntity.badRequest().body("Invalid request data.");
        }
    
        try {
            User user = buildUserService.getCurrentUser(authentication);
            boolean deleted = buildUserService.deleteBuild(user, buildRequest);
    
            if (deleted) {
                return ResponseEntity.ok("Build deleted successfully.");
            } else {
                return ResponseEntity.status(404).body("Build not found.");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error deleting build: " + ex.getMessage());
        }
    }
    
}
