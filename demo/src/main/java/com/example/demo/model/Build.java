package com.example.demo.model;
import jakarta.persistence.*;

@Entity
@Table(name ="builds")
public class Build {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String model;
    private String color;
    private String finish;
    private String wheel;
    private String trim;
    private String interior;
    private String headlining;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Build(Long id, String model, String color, String finish, String wheel, String trim, String interior, String headlining, User user) {
        this.id = id;
        this.model = model;
        this.color = color;
        this.finish = finish;
        this.wheel = wheel;
        this.trim = trim;
        this.interior = interior;
        this.headlining = headlining;
        this.user = user;
    }
    public Build() {}
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getFinish() {
        return finish;
    }

    public void setFinish(String finish) {
        this.finish = finish;
    }

    public String getWheel() {
        return wheel;
    }

    public void setWheel(String wheel) {
        this.wheel = wheel;
    }

    public String getTrim() {
        return trim;
    }

    public void setTrim(String trim) {
        this.trim = trim;
    }

    public String getInterior() {
        return interior;
    }

    public void setInterior(String interior) {
        this.interior = interior;
    }

    public String getHeadlining() {
        return headlining;
    }

    public void setHeadlining(String headlining) {
        this.headlining = headlining;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Column(name = "brake_calipers")
private String brakeCalipers;

public String getBrakeCalipers() {
    return brakeCalipers;
}

public void setBrakeCalipers(String brakeCalipers) {
    this.brakeCalipers = brakeCalipers;
}


}
