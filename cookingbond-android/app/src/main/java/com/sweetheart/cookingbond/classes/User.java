package com.sweetheart.cookingbond.classes;

import com.google.firebase.database.Exclude;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ywu on 11/23/17.
 */

public class User {
    public String name;
    public String gender;
    public int age;
    public String email;
    public String phone;
    public String photo;
    public String lastStatus;
    public double ratingCook;
    public double ratingEater;
    public List<String> transactions;

    public User() {}

    public User(String name, String gender, int age, String email, String phone, String photo,
                String lastStatus, double ratingCook, double ratingEater, List<String> transactions) {
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.email = email;
        this.phone = phone;
        this.photo = photo;
        this.lastStatus = lastStatus;
        this.ratingCook = ratingCook;
        this.ratingEater = ratingEater;
        this.transactions = transactions;
    }

    @Exclude
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        result.put("name", name);
        result.put("gender", gender);
        result.put("age", age);
        result.put("email", email);
        result.put("phone", phone);
        result.put("photo", photo);
        result.put("lastStatus", lastStatus);
        result.put("ratingCook", ratingCook);
        result.put("ratingEater", ratingEater);
        result.put("transactions", transactions);
        return result;
    }
}
