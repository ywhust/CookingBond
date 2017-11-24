package com.sweetheart.cookingbond.classes;

import com.google.firebase.database.Exclude;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ywu on 11/23/17.
 */

public class Contact {
    public String id;
    public String cookId;
    public String customerId;
    public String name;
    public String photo;
    public String lastMessage;
    public String lastContactTime;

    public Contact() {}

    public Contact(String id, String cookId, String customerId, String name,
                   String photo, String lastMessage, String lastContactTime) {
        this.id = id;
        this.cookId = cookId;
        this.customerId = customerId;
        this.name = name;
        this.photo = photo;
        this.lastMessage = lastMessage;
        this.lastContactTime = lastContactTime;
    }

    @Exclude
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        return result;
    }
}
