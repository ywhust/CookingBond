package com.sweetheart.cookingbond.fragments;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.sweetheart.cookingbond.R;
import com.sweetheart.cookingbond.adapters.ConversationAdapter;
import com.sweetheart.cookingbond.classes.Conversation;
import com.sweetheart.cookingbond.classes.Message;
import com.sweetheart.cookingbond.classes.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by ywu on 11/25/17.
 */

public class EaterMessageFragment extends Fragment {
    private List<Conversation> mConversationList;
    private HashMap<String, Conversation> mMap;

    private ConversationAdapter mAdapter;

    private FirebaseUser mUser;
    private DatabaseReference mConversationRef;

    public EaterMessageFragment() {}

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mConversationList = new ArrayList<>();
        mAdapter = new ConversationAdapter(mConversationList);
        mMap = new HashMap<>();

        mUser = FirebaseAuth.getInstance().getCurrentUser();
        if (mUser != null) {
            mConversationRef = FirebaseDatabase.getInstance().getReference("contacts_eater/" + mUser.getUid());
            mConversationRef.addChildEventListener(new ChildEventListener() {
                @Override
                public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                    final String contactId = dataSnapshot.getKey();
                    final String conversationId = dataSnapshot.getValue(String.class);
                    DatabaseReference userRef = FirebaseDatabase.getInstance().getReference("users/" + contactId);
                    userRef.addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(DataSnapshot dataSnapshot) {
                            final User customer = dataSnapshot.getValue(User.class);
                            DatabaseReference msgRef = FirebaseDatabase.getInstance().getReference("messages/" + conversationId);
                            msgRef.orderByKey().limitToLast(1).addValueEventListener(new ValueEventListener() {
                                @Override
                                public void onDataChange(DataSnapshot dataSnapshot) {
                                    HashMap<String, Object> map = (HashMap<String, Object>) dataSnapshot.getValue();
                                    String key = (String) map.keySet().toArray()[0];
                                    map = (HashMap<String, Object>) map.get(key);
                                    if (!mMap.containsKey(conversationId)) {
                                        Conversation conversation = new Conversation(conversationId, mUser.getUid(), contactId,
                                                customer.name, customer.photo, (String) map.get("message"), (String) map.get("timestamp"));
                                        mConversationList.add(conversation);
                                        mMap.put(conversationId, conversation);
                                    } else {
                                        Conversation conversation = mMap.get(conversationId);
                                        conversation.lastMessage = (String) map.get("message");
                                        conversation.lastContactTime = (String) map.get("timestamp");
                                    }
                                    mAdapter.notifyDataSetChanged();
                                }

                                @Override
                                public void onCancelled(DatabaseError databaseError) {

                                }
                            });
                        }

                        @Override
                        public void onCancelled(DatabaseError databaseError) {

                        }
                    });
                }

                @Override
                public void onChildChanged(DataSnapshot dataSnapshot, String s) {

                }

                @Override
                public void onChildRemoved(DataSnapshot dataSnapshot) {

                }

                @Override
                public void onChildMoved(DataSnapshot dataSnapshot, String s) {

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {

                }
            });
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_eater_message, container, false);
        RecyclerView recyclerView = (RecyclerView) rootView.findViewById(R.id.message_content);
        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(mAdapter);
        return rootView;
    }
}
