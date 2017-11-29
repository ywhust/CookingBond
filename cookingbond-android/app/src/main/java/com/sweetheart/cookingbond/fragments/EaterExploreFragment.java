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
import com.sweetheart.cookingbond.adapters.CookAdapter;
import com.sweetheart.cookingbond.classes.Cook;
import com.sweetheart.cookingbond.classes.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ywu on 11/25/17.
 */

public class EaterExploreFragment extends Fragment {

    private List<Cook> mCookList;

    private CookAdapter mAdapter;

    private FirebaseUser mUser;
    private DatabaseReference mCookRef;

    public EaterExploreFragment() {}

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mCookList = new ArrayList<>();
        mAdapter = new CookAdapter(mCookList);

        mUser = FirebaseAuth.getInstance().getCurrentUser();
        if (mUser != null) {
            mCookRef = FirebaseDatabase.getInstance().getReference("cooks/");
            mCookRef.addChildEventListener(new ChildEventListener() {
                @Override
                public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                    final String cookId = dataSnapshot.getKey();
                    HashMap<String, Object> map = (HashMap<String, Object>) dataSnapshot.getValue();
                    if (map.get("availableStatus").equals("true")) {
                        final List<String> dishIdList = new ArrayList<>(((Map) map.get("availableDishes")).keySet());
                        final List<String> temp = (List<String>) map.get("label");
//                        final List<String> labels = new ArrayList<>(temp);
                        DatabaseReference userRef = FirebaseDatabase.getInstance()
                                .getReference("users/" + cookId);
                        userRef.addListenerForSingleValueEvent(new ValueEventListener() {
                            @Override
                            public void onDataChange(DataSnapshot dataSnapshot) {
                                User user = dataSnapshot.getValue(User.class);
                                Cook cook;
                                if (temp == null) {
                                    cook = new Cook(user, cookId, new ArrayList<String>(), dishIdList);
                                } else {
                                    cook = new Cook(user, cookId, new ArrayList<String>(temp), dishIdList);
                                }
//                                Cook cook = new Cook(user, cookId, new ArrayList<String>(), dishIdList);
                                mCookList.add(cook);
                                mAdapter.notifyItemInserted(mCookList.size() - 1);
                            }

                            @Override
                            public void onCancelled(DatabaseError databaseError) {

                            }
                        });
                    }
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
        View rootView = inflater.inflate(R.layout.fragment_eater_explore, container, false);
        RecyclerView recyclerView = (RecyclerView) rootView.findViewById(R.id.explore_content);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.setAdapter(mAdapter);
        return rootView;
    }
}
