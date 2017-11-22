package com.sweetheart.cookingbond.models;

import com.google.firebase.database.Exclude;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ywu on 11/20/17.
 */

public class Dish {
    public String cook;
    public String name;
    public String flavor;
    public String description;
    public double price;
    public String picture;

    public Dish() {}

    public Dish(String cook, String name, String flavor, String description, double price, String picture) {
        this.cook = cook;
        this.name = name;
        this.flavor = flavor;
        this.description = description;
        this.price = price;
        this.picture = picture;
    }

    @Exclude
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        result.put("cook", cook);
        result.put("name", name);
        result.put("flavor", flavor);
        result.put("description", description);
        result.put("price", price);
        result.put("picture", picture);
        return result;
    }
}
