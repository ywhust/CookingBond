package com.sweetheart.cookingbond;

import android.content.Intent;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.sweetheart.cookingbond.adapters.MessageAdapter;
import com.sweetheart.cookingbond.classes.Message;

import java.util.ArrayList;
import java.util.List;

public class ChatActivity extends AppCompatActivity {

    private String mConversationId;
    private String mMyId;
    private String mContactId;
    private String mContactName;
    private String mContactPhoto;

    private List<Message> mMessageList;
    private MessageAdapter mAdapter;
    private RecyclerView mRecyclerView;
    private EditText mInputText;
    private Button mSendButton;

    private DatabaseReference mMessageRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cook_chat);

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();

        Intent intent = getIntent();
        mConversationId = intent.getStringExtra("conversationId");
        mMyId = intent.getStringExtra("myId");
        mContactId = intent.getStringExtra("contactId");
        mContactName = intent.getStringExtra("contactName");
        mContactPhoto = intent.getStringExtra("contactPhoto");

        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle(mContactName);
        }

        mMessageRef = FirebaseDatabase.getInstance().getReference("messages/" + mConversationId);

        // display recycler view
        mMessageList = new ArrayList<>();
        mAdapter = new MessageAdapter(mMessageList, mMyId);
        mRecyclerView = (RecyclerView) findViewById(R.id.recycler_view);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        mRecyclerView.setLayoutManager(linearLayoutManager);
        mRecyclerView.setAdapter(mAdapter);

        mInputText = (EditText) findViewById(R.id.input_text);
        mSendButton = (Button) findViewById(R.id.send_button);

        // listen for button click event, and upload message to database
        mSendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String content = mInputText.getText().toString();
                String timestamp = "";
                if (!content.equals("")) {
                    Message msg = new Message(mContactId, mMyId, content, timestamp);
                    mMessageRef.push().setValue(msg);
                }
            }
        });

        // listen for new message
        mMessageRef.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                Message msg = dataSnapshot.getValue(Message.class);
                mMessageList.add(msg);
                mAdapter.notifyItemInserted(mMessageList.size() - 1);
                mRecyclerView.scrollToPosition(mMessageList.size() - 1);
                mInputText.setText("");
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
