package com.example.demo.service;

import com.example.demo.model.Build;
import com.example.demo.model.User;
import com.example.demo.repository.BuildRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BuildUserService {

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public boolean checkIfBuildExists(User user, Build buildRequest) {
        return buildRepository.findByUserAndModelAndColorAndFinishAndWheelAndTrimAndInteriorAndHeadlining(
                user,
                buildRequest.getModel(),
                buildRequest.getColor(),
                buildRequest.getFinish(),
                buildRequest.getWheel(),
                buildRequest.getTrim(),
                buildRequest.getInterior(),
                buildRequest.getHeadlining()
        ).isPresent();
    }

    public String toggleBuild(User user, Build buildRequest) {
        Optional<Build> existing = buildRepository.findByUserAndModelAndColorAndFinishAndWheelAndTrimAndInteriorAndHeadlining(
                user,
                buildRequest.getModel(),
                buildRequest.getColor(),
                buildRequest.getFinish(),
                buildRequest.getWheel(),
                buildRequest.getTrim(),
                buildRequest.getInterior(),
                buildRequest.getHeadlining()
        );

        if (existing.isPresent()) {
            buildRepository.delete(existing.get());
            return "Build deleted successfully.";
        } else {
            buildRequest.setUser(user);
            buildRepository.save(buildRequest);
            return "Build saved successfully.";
        }
    }

    public List<Build> getAllBuilds(User user) {
        return buildRepository.findAll().stream()
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .toList();
    }

    public String deleteBuild(User user, Build buildRequest) {
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
            return "Build deleted successfully.";
        } else {
            throw new RuntimeException("Build not found.");
        }
    }


    public String updateBuild(User user, Build updatedBuild) {
        Optional<Build> existing = buildRepository.findByUserAndModelAndColorAndFinishAndWheelAndTrimAndInteriorAndHeadlining(
                user,
                updatedBuild.getModel(),
                updatedBuild.getColor(),
                updatedBuild.getFinish(),
                updatedBuild.getWheel(),
                updatedBuild.getTrim(),
                updatedBuild.getInterior(),
                updatedBuild.getHeadlining()
        );

        if (existing.isPresent()) {
            Build buildToUpdate = existing.get();

            // Optionally, add a helper method in Build entity to update fields
            buildToUpdate.setModel(updatedBuild.getModel());
            buildToUpdate.setColor(updatedBuild.getColor());
            buildToUpdate.setFinish(updatedBuild.getFinish());
            buildToUpdate.setWheel(updatedBuild.getWheel());
            buildToUpdate.setTrim(updatedBuild.getTrim());
            buildToUpdate.setInterior(updatedBuild.getInterior());
            buildToUpdate.setHeadlining(updatedBuild.getHeadlining());

            buildRepository.save(buildToUpdate);
            return "Build updated successfully.";
        } else {
            throw new RuntimeException("Build not found to update.");
        }
    }
    public void saveBuild(Build build) {
        buildRepository.save(build);
    }
}
