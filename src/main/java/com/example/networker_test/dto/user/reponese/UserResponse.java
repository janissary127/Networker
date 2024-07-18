package com.example.networker_test.dto.user.reponese;

import com.example.networker_test.domain.user.User;

public class UserResponse {
    private long id;
    private String email;
    private String nationality;
    private String password;

    public UserResponse(long id, String email, String nationality, String password) {
        this.id = id;
        this.email = email;
        this.nationality = nationality;
        this.password = password;
    }

    public UserResponse(int id, User user) {
        this.id = id;
        this.email = user.getEmail();
        this.nationality = user.getNationality();
        this.password = user.getPassword();
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNationality() {
        return nationality;
    }

    public String getPassword() {
        return password;
    }
}
