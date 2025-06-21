package com.example.demo.controller;

import com.example.demo.model.Build;
import com.example.demo.model.User;
import com.example.demo.repository.BuildRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
public class BuildController {

    // ✅ Serve sample.html when GET /sample is called
    @GetMapping("/sample")
    public String sample() {
        return "sample"; // Make sure sample.html exists in `src/main/resources/templates/`
    }
}

@RestController
@RequestMapping("/api/builds")
class BuildRestController {

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔐 Get authenticated user from Spring Security context
    private User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }


    @PostMapping("/toggle")
    public ResponseEntity<String> toggleBuild(@RequestBody Build buildRequest, Authentication authentication) {
        User user = getCurrentUser(authentication);

        Optional<Build> existingBuild = buildRepository.findByUserAndModelAndColorAndFinishAndWheelAndTrimAndInteriorAndHeadlining(
                user,
                buildRequest.getModel(),
                buildRequest.getColor(),
                buildRequest.getFinish(),
                buildRequest.getWheel(),
                buildRequest.getTrim(),
                buildRequest.getInterior(),
                buildRequest.getHeadlining()
        );

        if (existingBuild.isPresent()) {
            buildRepository.delete(existingBuild.get());
            return ResponseEntity.ok("Build deleted successfully.");
        } else {
            buildRequest.setUser(user);
            buildRepository.save(buildRequest);
            return ResponseEntity.ok("Build saved successfully.");
        }
    }


    @GetMapping
    public ResponseEntity<List<Build>> getAllBuilds(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Build> builds = buildRepository.findAll().stream()
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .toList();
        return ResponseEntity.ok(builds);
    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteBuild(@RequestBody Build buildRequest, Authentication authentication) {
        User user = getCurrentUser(authentication);

        Optional<Build> build = buildRepository.findByUserAndModelAndColorAndFinishAndWheelAndTrimAndInteriorAndHeadlining(
                user,
                buildRequest.getModel(),
                buildRequest.getColor(),
                buildRequest.getFinish(),
                buildRequest.getWheel(),
                buildRequest.getTrim(),
                buildRequest.getInterior(),
                buildRequest.getHeadlining()
        );

        if (build.isPresent()) {
            buildRepository.delete(build.get());
            return ResponseEntity.ok("Build deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Build not found.");
        }
    }
}
