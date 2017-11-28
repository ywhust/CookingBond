package com.sweetheart.cookingbond.adapters;

import android.content.Context;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.Switch;
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
import com.sweetheart.cookingbond.R;
import com.sweetheart.cookingbond.classes.Dish;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

/**
 * Created by ywu on 11/20/17.
 */

public class DishAdapter extends RecyclerView.Adapter<DishAdapter.ViewHolder> {
    private Context mContext;
    private List<Dish> mDishList;

    static class ViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView dishImage;
        TextView dishName;
        Switch availableSwitch;

        public ViewHolder(View view) {
            super(view);
            cardView = (CardView) view;
            dishImage = (ImageView) view.findViewById(R.id.dish_image);
            dishName = (TextView) view.findViewById(R.id.dish_name);
            availableSwitch = (Switch) view.findViewById(R.id.dish_available_switch);
        }
    }

    public DishAdapter(List<Dish> dishList) {
        mDishList = dishList;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (mContext == null) {
            mContext = parent.getContext();
        }
        View view = LayoutInflater.from(mContext).inflate(R.layout.cardview_dish, parent, false);
        final ViewHolder holder = new ViewHolder(view);
        final FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        DatabaseReference statusRef = FirebaseDatabase.getInstance()
                .getReference("cooks/" + user.getUid() + "/availableDishes/");
        statusRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() == null) return;
                Set<String> set = ((HashMap<String, String>) dataSnapshot.getValue()).keySet();
                Dish dish = mDishList.get(holder.getAdapterPosition());
                if (set.contains(dish.dishId)) {
                    holder.availableSwitch.setChecked(true);
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });

        holder.availableSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                int position = holder.getAdapterPosition();
                Dish dish = mDishList.get(position);
                if (user != null) {
                    DatabaseReference cookRef = FirebaseDatabase.getInstance()
                            .getReference("cooks/" + user.getUid() + "/availableDishes/");
                    if (isChecked) {
                        cookRef.child(dish.dishId).setValue(dish.name);
                    } else {
                        cookRef.child(dish.dishId).removeValue();
                    }
                }
            }
        });
        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Dish dish = mDishList.get(position);
        holder.dishName.setText(dish.name);
        if (dish.picture != null) {
            StorageReference imageRef = FirebaseStorage.getInstance().getReference(dish.picture);
            Glide.with(mContext).using(new FirebaseImageLoader()).load(imageRef).into(holder.dishImage);
        }
    }

    @Override
    public int getItemCount() {
        return mDishList.size();
    }
}
