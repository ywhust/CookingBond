package com.sweetheart.cookingbond.adapters;

import android.content.Context;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.firebase.ui.storage.images.FirebaseImageLoader;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.sweetheart.cookingbond.R;
import com.sweetheart.cookingbond.classes.Dish;

import java.util.List;

/**
 * Created by ywu on 11/26/17.
 */

public class CookDishAdapter extends RecyclerView.Adapter<CookDishAdapter.ViewHolder> {
    private Context mContext;
    private List<Dish> mDishList;

    static class ViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView dishImage;
        TextView dishName;
        TextView dishPrice;
        TextView dishFlavor;

        public ViewHolder(View view) {
            super(view);
            cardView = (CardView) view;
            dishImage = (ImageView) view.findViewById(R.id.cook_dish_image);
            dishName = (TextView) view.findViewById(R.id.cook_dish_name);
            dishPrice = (TextView) view.findViewById(R.id.cook_dish_price);
            dishFlavor = (TextView) view.findViewById(R.id.cook_dish_flavor);
        }
    }

    public CookDishAdapter(List<Dish> dishList) {
        mDishList = dishList;
    }

    @Override
    public CookDishAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (mContext == null) {
            mContext = parent.getContext();
        }
        View view = LayoutInflater.from(mContext).inflate(R.layout.cardview_cook_dish, parent, false);
        return new CookDishAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(CookDishAdapter.ViewHolder holder, int position) {
        Dish dish = mDishList.get(position);
        Log.w("CookDishAdapter", String.valueOf(position));
        holder.dishName.setText("Dish name: " + dish.name);
        holder.dishPrice.setText("Price: $" + String.valueOf(dish.price));
        holder.dishFlavor.setText("Flavor: " + dish.flavor);
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
