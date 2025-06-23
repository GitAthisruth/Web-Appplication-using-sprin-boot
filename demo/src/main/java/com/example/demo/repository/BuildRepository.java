package com.example.demo.repository;
import com.example.demo.model.Build;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuildRepository extends JpaRepository<Build, Long> {
    Optional<Build> findByUserAndModelAndColorAndFinishAndWheelAndTrimAndInteriorAndHeadliningAndBrakeCalipers(
            User user,
            String model,
            String color,
            String finish,
            String wheel,
            String trim,
            String interior,
            String headlining,
            String brakeCalipers
    );
}
