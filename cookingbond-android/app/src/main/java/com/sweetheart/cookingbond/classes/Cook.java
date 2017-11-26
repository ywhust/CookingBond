package com.sweetheart.cookingbond.classes;

import java.util.List;

/**
 * Created by ywu on 11/25/17.
 */

public class Cook extends User {
    public String cookId;
    public List<String> labels;
    public List<String> dishes;

    public Cook() {}

    public Cook(User user, String cookId, List<String> labels, List<String> dishes) {
        super(user.name, user.gender, user.age, user.email, user.phone, user.photo,
                user.lastStatus, user.ratingCook, user.ratingEater, user.transactions);
        this.cookId = cookId;
        this.labels = labels;
        this.dishes = dishes;
    }
}
