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
import com.sweetheart.cookingbond.classes.Contact;

import java.util.List;

/**
 * Created by ywu on 11/23/17.
 */

public class ContactAdapter extends RecyclerView.Adapter<ContactAdapter.ViewHolder> {
    private Context mContext;
    private List<Contact> mContactList;

    static class ViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView photo;
        TextView name;
        TextView message;
        TextView time;

        public ViewHolder(View view) {
            super(view);
            cardView = (CardView) view;
            photo = view.findViewById(R.id.photo);
            name = view.findViewById(R.id.name);
            message = view.findViewById(R.id.message);
            time = view.findViewById(R.id.time);
        }
    }

    public ContactAdapter(List<Contact> contactList) {
        mContactList = contactList;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (mContext == null) {
            mContext = parent.getContext();
        }
        View view = LayoutInflater.from(mContext).inflate(R.layout.cardview_contact, parent, false);
        final ViewHolder holder = new ViewHolder(view);
        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = holder.getAdapterPosition();
                Contact contact = mContactList.get(position);
            }
        });
        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Contact contact = mContactList.get(position);
        holder.name.setText(contact.name);
        holder.message.setText(contact.lastMessage);
        holder.time.setText(contact.lastContactTime);
//        StorageReference imageRef = FirebaseStorage.getInstance().getReference(contact.photo);
//        Glide.with(mContext).using(new FirebaseImageLoader()).load(imageRef).into(holder.photo);
    }

    @Override
    public int getItemCount() {
        return mContactList.size();
    }
}
