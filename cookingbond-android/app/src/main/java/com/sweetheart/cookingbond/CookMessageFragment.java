package com.sweetheart.cookingbond;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
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
import com.sweetheart.cookingbond.models.Contact;
import com.sweetheart.cookingbond.models.Message;
import com.sweetheart.cookingbond.models.User;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ywu on 11/23/17.
 */

public class CookMessageFragment extends Fragment {
    private List<Contact> mContactList;

    private ContactAdapter mAdapter;

    private FirebaseUser mUser;
    private DatabaseReference mContactRef;

    public CookMessageFragment() {}

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mContactList = new ArrayList<>();
        mAdapter = new ContactAdapter(mContactList);

        mUser = FirebaseAuth.getInstance().getCurrentUser();
        if (mUser != null) {
            mContactRef = FirebaseDatabase.getInstance().getReference("contacts_cook/" + mUser.getUid());
            mContactRef.addChildEventListener(new ChildEventListener() {
                @Override
                public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                    final String customerId = dataSnapshot.getKey();
                    final String contactId = dataSnapshot.getValue(String.class);
                    DatabaseReference userRef = FirebaseDatabase.getInstance().getReference("users/" + customerId);
                    userRef.addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(DataSnapshot dataSnapshot) {
                            final User user = dataSnapshot.getValue(User.class);
                            DatabaseReference msgRef = FirebaseDatabase.getInstance().getReference("messages/" + contactId);
                            msgRef.orderByKey().limitToLast(1).addListenerForSingleValueEvent(new ValueEventListener() {
                                @Override
                                public void onDataChange(DataSnapshot dataSnapshot) {
                                    Message msg = dataSnapshot.getValue(Message.class);
                                    Contact contact = new Contact(contactId, mUser.getUid(), customerId,
                                            user.name, user.photo, msg.message, msg.timestamp);
                                    mContactList.add(contact);
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
        View rootView = inflater.inflate(R.layout.fragment_cook_message, container, false);
        RecyclerView recyclerView = (RecyclerView) rootView.findViewById(R.id.message_content);
        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(mAdapter);
        return rootView;
    }
}
