package com.sweetheart.cookingbond.classes;

import com.google.firebase.database.Exclude;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ywu on 11/22/17.
 */

public class Message {
    public String to;
    public String from;
    public String message;
    public String timestamp;

    public Message() {}

    public Message(String to, String from, String message, String timestamp) {
        this.to = to;
        this.from = from;
        this.message = message;
        this.timestamp = timestamp;
    }

    @Exclude
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        result.put("to", to);
        result.put("from", from);
        result.put("message", message);
        result.put("timestamp", timestamp);
        return result;
    }
}
