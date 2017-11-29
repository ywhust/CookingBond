package com.sweetheart.cookingbond.adapters;

import android.content.Context;
import android.media.Image;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.firebase.ui.storage.images.FirebaseImageLoader;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.sweetheart.cookingbond.R;
import com.sweetheart.cookingbond.classes.Message;

import java.util.List;

/**
 * Created by ywu on 11/24/17.
 */

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.ViewHolder> {
    private Context mContext;
    private List<Message> mMessageList;
    private String mUserId;
    private String mUserPhoto;
    private String mContactPhoto;

    static class ViewHolder extends RecyclerView.ViewHolder {
        LinearLayout leftLayout;
        LinearLayout rightLayout;
        TextView leftMessage;
        TextView rightMessage;
        ImageView leftPhoto;
        ImageView rightPhoto;

        public ViewHolder(View view) {
            super(view);
            leftLayout = (LinearLayout) view.findViewById(R.id.left_layout);
            rightLayout = (LinearLayout) view.findViewById(R.id.right_layout);
            leftMessage = (TextView) view.findViewById(R.id.left_msg);
            rightMessage = (TextView) view.findViewById(R.id.right_msg);
            leftPhoto = (ImageView) view.findViewById(R.id.left_photo);
            rightPhoto = (ImageView) view.findViewById(R.id.right_photo);
        }
    }

    public MessageAdapter(List<Message> messageList, String userId,
                          String userPhoto, String contactPhoto) {
        mMessageList = messageList;
        mUserId = userId;
        mUserPhoto = userPhoto;
        mContactPhoto = contactPhoto;
//        mUserPhoto = FirebaseAuth.getInstance().getCurrentUser().getPhotoUrl().toString();
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (mContext == null) {
            mContext = parent.getContext();
        }
        View view = LayoutInflater.from(mContext).inflate(R.layout.message_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Message message = mMessageList.get(position);
        if (message.from.equals(mUserId)) { // send from myself, use right layout to display
            holder.rightLayout.setVisibility(View.VISIBLE);
            holder.leftLayout.setVisibility(View.GONE);
            holder.rightMessage.setText(message.message);
            DatabaseReference photoRef = FirebaseDatabase.getInstance().getReference("users/" + mUserId + "/photo");
            final ViewHolder h = holder;
            photoRef.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    String photo = dataSnapshot.getValue(String.class);
                    if (photo != null) {
                        StorageReference imageRef = FirebaseStorage.getInstance().getReference(photo);
                        Glide.with(mContext).using(new FirebaseImageLoader()).load(imageRef).into(h.rightPhoto);
                    }
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {

                }
            });
//            if (mUserPhoto != null) {
//                StorageReference imageRef = FirebaseStorage.getInstance().getReference(mUserPhoto);
//                Glide.with(mContext).using(new FirebaseImageLoader()).load(imageRef).into(holder.rightPhoto);
//            }
        } else { // send from others, use left layout to display
            holder.leftLayout.setVisibility(View.VISIBLE);
            holder.rightLayout.setVisibility(View.GONE);
            holder.leftMessage.setText(message.message);
            if (mContactPhoto != null) {
                StorageReference imageRef = FirebaseStorage.getInstance().getReference(mContactPhoto);
                Glide.with(mContext).using(new FirebaseImageLoader()).load(imageRef).into(holder.leftPhoto);
            }
        }
    }

    @Override
    public int getItemCount() {
        return mMessageList.size();
    }
}
