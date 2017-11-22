package com.sweetheart.cookingbond;

import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
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
import com.sweetheart.cookingbond.models.Dish;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ywu on 11/20/17.
 */

public class CookKitchenFragment extends Fragment {
    private List<Dish> mDishList;

    private DishAdapter mAdapter;

    private FirebaseUser mUser;
    private DatabaseReference mCookRef;
    private DatabaseReference mDishRef;

    public CookKitchenFragment() {}

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mDishList = new ArrayList<>();
        mAdapter = new DishAdapter(mDishList);

        mUser = FirebaseAuth.getInstance().getCurrentUser();
        if (mUser != null) {
            mCookRef = FirebaseDatabase.getInstance().getReference("cooks/" + mUser.getUid() + "/allDishes/");
            mDishRef = FirebaseDatabase.getInstance().getReference("dishes/");
            mCookRef.addChildEventListener(new ChildEventListener() {
                @Override
                public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                    String dishId = dataSnapshot.getValue(String.class);
                    mDishRef.child(dishId).addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(DataSnapshot dataSnapshot) {
                            Dish dish = dataSnapshot.getValue(Dish.class);
                            mDishList.add(dish);
                            mAdapter.notifyDataSetChanged();
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
        View rootView = inflater.inflate(R.layout.fragment_cook_kitchen, container, false);
        RecyclerView recyclerView = (RecyclerView) rootView.findViewById(R.id.kitchen_content);
        GridLayoutManager layoutManager = new GridLayoutManager(getActivity(), 2);
        recyclerView.setLayoutManager(layoutManager);
//        DishAdapter adapter = new DishAdapter(mDishList);
//        recyclerView.setAdapter(adapter);
        recyclerView.setAdapter(mAdapter);
        return rootView;
    }
}
