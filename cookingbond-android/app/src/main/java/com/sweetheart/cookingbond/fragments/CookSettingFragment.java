package com.sweetheart.cookingbond.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v7.widget.CardView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.firebase.ui.storage.images.FirebaseImageLoader;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.sweetheart.cookingbond.EaterMainActivity;
import com.sweetheart.cookingbond.R;
import com.sweetheart.cookingbond.SignInActivity;
import com.sweetheart.cookingbond.classes.User;

import java.util.HashMap;

/**
 * Created by ywu on 11/24/17.
 */

public class CookSettingFragment extends Fragment {
    private static final String TAG = "CookSettingFragment";

    private FirebaseAuth mAuth;
    private FirebaseAuth.AuthStateListener mAuthListener;
    private FirebaseUser mUser;
    private DatabaseReference mUserRef;

    public CookSettingFragment() {}

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mAuth = FirebaseAuth.getInstance();
        mAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = firebaseAuth.getCurrentUser();
                if (user != null) {
                    // User is signed in
                    Log.d(TAG, "onAuthStateChanged:signed_in:" + user.getUid());
                } else {
                    // User is signed out
                    Log.d(TAG, "onAuthStateChanged:signed_out");
                    startActivity(new Intent(getActivity(), SignInActivity.class));
                }
            }
        };
    }

    @Override
    public void onStart() {
        super.onStart();
        mAuth.addAuthStateListener(mAuthListener);
    }

    @Override
    public void onStop() {
        super.onStop();
        if (mAuth != null) {
            mAuth.removeAuthStateListener(mAuthListener);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_cook_setting, container, false);

        // display user name and photo
        final ImageView photo = (ImageView) rootView.findViewById(R.id.photo);
        final TextView name = (TextView) rootView.findViewById(R.id.name);
        mUser = FirebaseAuth.getInstance().getCurrentUser();
        mUserRef = FirebaseDatabase.getInstance().getReference("users/" + mUser.getUid());
        mUserRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                User user = dataSnapshot.getValue(User.class);
                name.setText(user.name);
                if (user.photo != null) {
                    StorageReference imageRef = FirebaseStorage.getInstance().getReference(user.photo);
                    Glide.with(getActivity()).using(new FirebaseImageLoader()).load(imageRef).into(photo);
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });

        // set go to eater event
        CardView cardView = (CardView) rootView.findViewById(R.id.to_eater);
        cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mUserRef.child("lastStatus").setValue("eater");
                startActivity(new Intent(getActivity(), EaterMainActivity.class));
            }
        });

        // sign out event
        Button button  = (Button) rootView.findViewById(R.id.sign_out_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mAuth.signOut();
            }
        });
        return rootView;
    }
}
