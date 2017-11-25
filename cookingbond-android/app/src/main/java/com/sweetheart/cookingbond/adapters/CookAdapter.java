package com.sweetheart.cookingbond.adapters;

import android.content.Context;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

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
        RecyclerView recyclerView;
        ImageView imageView;
        TextView cookName;
        TextView cookLabel;

        public ViewHolder(View view) {
            super(view);
            cardView = (CardView) view;
            imageView = (ImageView) view.findViewById(R.id.cook_photo);
            cookName = (TextView) view.findViewById(R.id.cook_name);
            cookLabel = (TextView) view.findViewById(R.id.cook_label);
            recyclerView = (RecyclerView) view.findViewById(R.id.recycler_view);
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
        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Cook cook = mCookList.get(position);
        holder.cookName.setText(cook.name);
        String labels = cook.labels.toString();
        holder.cookLabel.setText(labels.substring(1, labels.length() - 1));
        // StorageReference photoRef = FirebaseStorage.getInstance().getReference(cook.photo);
        // Glide.with(mContext).using(new FirebaseImageLoader()).load(photoRef).into(holder.imageView);
    }

    @Override
    public int getItemCount() {
        return mCookList.size();
    }
}
