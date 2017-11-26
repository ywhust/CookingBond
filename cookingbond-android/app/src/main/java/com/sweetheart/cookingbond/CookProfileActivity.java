package com.sweetheart.cookingbond;

import android.content.Intent;
import android.support.design.widget.CollapsingToolbarLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.firebase.ui.storage.images.FirebaseImageLoader;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.sweetheart.cookingbond.adapters.CookDishAdapter;
import com.sweetheart.cookingbond.classes.Dish;

import java.util.ArrayList;
import java.util.List;

public class CookProfileActivity extends AppCompatActivity {
    private String mCookId;
    private String mCookName;
    private String mCookPhoto;

    private FirebaseUser mUser;
    private DatabaseReference mCookRef;

    private List<Dish> mDishList;
    private CookDishAdapter mAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cook_profile);

        Intent intent = getIntent();
        mCookId = intent.getStringExtra("cookId");
        mCookName = intent.getStringExtra("cookName");
        mCookPhoto = intent.getStringExtra("cookPhoto");

        Toolbar toolbar = (Toolbar) findViewById(R.id.cook_profile_toolbar);
        CollapsingToolbarLayout collapsingToolbar = (CollapsingToolbarLayout) findViewById(R.id.cook_profile_collapsing_toolbar);

        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
        collapsingToolbar.setTitle(mCookName);

        ImageView cookImage = (ImageView) findViewById(R.id.cook_profile_image_view);
        StorageReference imageRef = FirebaseStorage.getInstance().getReference(mCookPhoto);
        Glide.with(this).using(new FirebaseImageLoader()).load(imageRef).into(cookImage);

        mDishList = new ArrayList<>();
        mAdapter = new CookDishAdapter(mDishList);
        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.cook_profile_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        Log.w("CookProfileActivity", mDishList.toString());
        recyclerView.setAdapter(mAdapter);

        mUser = FirebaseAuth.getInstance().getCurrentUser();
        mCookRef = FirebaseDatabase.getInstance().getReference("cooks/" + mCookId + "/availableDishes/");
        mCookRef.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                String dishId = dataSnapshot.getKey();
                DatabaseReference dishRef = FirebaseDatabase.getInstance()
                        .getReference("dishes/" + dishId);
                dishRef.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        Dish dish = dataSnapshot.getValue(Dish.class);
                        mDishList.add(dish);
                        mAdapter.notifyItemInserted(mDishList.size() - 1);
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

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.cook_profile_fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(CookProfileActivity.this, "Request has been sent!", Toast.LENGTH_SHORT).show();
                // send request to cook
                final DatabaseReference conversationRef = FirebaseDatabase.getInstance()
                        .getReference("contacts_eater/" + mUser.getUid() + "/" + mCookId);
                conversationRef.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        String conversationId = dataSnapshot.getValue(String.class);
                        if (conversationId == null) {
                            conversationId = conversationRef.push().getKey();
                            conversationRef.setValue(conversationId);
                        }
                        Intent intent = new Intent(CookProfileActivity.this, ChatActivity.class);
                        intent.putExtra("conversationId", conversationId);
                        intent.putExtra("myId", mUser.getUid());
                        intent.putExtra("contactId", mCookId);
                        intent.putExtra("contactName", mCookName);
                        intent.putExtra("contactPhoto", mCookPhoto);
                        startActivity(intent);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {

                    }
                });
            }
        });
    }
}
