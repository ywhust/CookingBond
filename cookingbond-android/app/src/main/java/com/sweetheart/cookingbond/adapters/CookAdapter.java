package com.sweetheart.cookingbond.adapters;

import android.content.Context;
import android.content.Intent;
import android.media.Image;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.firebase.ui.storage.images.FirebaseImageLoader;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.sweetheart.cookingbond.CookProfileActivity;
import com.sweetheart.cookingbond.R;
import com.sweetheart.cookingbond.classes.Cook;

import java.util.List;

/**
 * Created by ywu on 11/25/17.
 */

public class CookAdapter extends RecyclerView.Adapter<CookAdapter.ViewHolder> {
    private Context mContext;
    private List<Cook> mCookList;

    static class ViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView imageView;
        TextView cookName;
        TextView cookLabel;

        ImageView[] imageArr = new ImageView[5];

        public ViewHolder(View view) {
            super(view);
            cardView = (CardView) view;
            imageView = (ImageView) view.findViewById(R.id.cook_photo);
            cookName = (TextView) view.findViewById(R.id.cook_name);
            cookLabel = (TextView) view.findViewById(R.id.cook_label);
            imageArr[0] = (ImageView) view.findViewById(R.id.dish_1);
            imageArr[1] = (ImageView) view.findViewById(R.id.dish_2);
            imageArr[2] = (ImageView) view.findViewById(R.id.dish_3);
            imageArr[3] = (ImageView) view.findViewById(R.id.dish_4);
            imageArr[4] = (ImageView) view.findViewById(R.id.dish_5);
        }
    }

    public CookAdapter(List<Cook> cookList) {
        mCookList = cookList;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (mContext == null) {
            mContext = parent.getContext();
        }
        View view = LayoutInflater.from(mContext).inflate(R.layout.cardview_cook, parent, false);
        final ViewHolder holder = new ViewHolder(view);
        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = holder.getAdapterPosition();
                Cook cook = mCookList.get(position);
                Intent intent = new Intent(mContext, CookProfileActivity.class);
                intent.putExtra("cookId", cook.cookId);
                intent.putExtra("cookName", cook.name);
                intent.putExtra("cookPhoto", cook.photo);
                mContext.startActivity(intent);
            }
        });
        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Cook cook = mCookList.get(position);
        holder.cookName.setText(cook.name);
        String labels = cook.labels.toString();
        holder.cookLabel.setText(labels.substring(1, labels.length() - 1));
        StorageReference photoRef = FirebaseStorage.getInstance().getReference(cook.photo);
        Glide.with(mContext).using(new FirebaseImageLoader()).load(photoRef).into(holder.imageView);

        // set the dish pictures
        final ViewHolder h = holder;
        for (int i = 0; i < cook.dishes.size() && i < 5; i++) {
            final ImageView image = h.imageArr[i];
            DatabaseReference dishRef = FirebaseDatabase.getInstance().getReference("dishes/");
            dishRef.child(cook.dishes.get(i)).child("picture").addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    String imagePath = dataSnapshot.getValue(String.class);
                    StorageReference photoRef = FirebaseStorage.getInstance().getReference(imagePath);
                    Glide.with(mContext).using(new FirebaseImageLoader()).load(photoRef).into(image);
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {

                }
            });
        }
    }

    @Override
    public int getItemCount() {
        return mCookList.size();
    }
}
