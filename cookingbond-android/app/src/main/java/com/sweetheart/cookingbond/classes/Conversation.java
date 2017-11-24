package com.sweetheart.cookingbond.classes;

import com.google.firebase.database.Exclude;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ywu on 11/23/17.
 */

public class Conversation {
    public String cid;
    public String myId;
    public String contactId;
    public String contactName;
    public String contactPhoto;
    public String lastMessage;
    public String lastContactTime;

    public Conversation() {}

    public Conversation(String cid, String myId, String contactId, String contactName,
                        String contactPhoto, String lastMessage, String lastContactTime) {
        this.cid = cid;
        this.myId = myId;
        this.contactId = contactId;
        this.contactName = contactName;
        this.contactPhoto = contactPhoto;
        this.lastMessage = lastMessage;
        this.lastContactTime = lastContactTime;
    }

    @Exclude
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        return result;
    }
}
