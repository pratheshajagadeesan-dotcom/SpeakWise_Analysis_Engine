package com.speakwise.speakwise.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private com.speakwise.speakwise.model.Role role = com.speakwise.speakwise.model.Role.USER;

    public User(String name, String email, String password, com.speakwise.speakwise.model.Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}