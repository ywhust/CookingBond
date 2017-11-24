package com.sweetheart.cookingbond.adapters;

import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.sweetheart.cookingbond.CookChatActivity;
import com.sweetheart.cookingbond.R;
import com.sweetheart.cookingbond.classes.Conversation;

import java.util.List;

/**
 * Created by ywu on 11/23/17.
 */

public class ConversationAdapter extends RecyclerView.Adapter<ConversationAdapter.ViewHolder> {
    private Context mContext;
    private List<Conversation> mConversationList;

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

    public ConversationAdapter(List<Conversation> conversationList) {
        mConversationList = conversationList;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (mContext == null) {
            mContext = parent.getContext();
        }
        View view = LayoutInflater.from(mContext).inflate(R.layout.cardview_conversation, parent, false);
        final ViewHolder holder = new ViewHolder(view);
        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = holder.getAdapterPosition();
                Conversation conversation = mConversationList.get(position);
                Intent intent = new Intent(mContext, CookChatActivity.class);
                intent.putExtra("conversationId", conversation.cid);
                intent.putExtra("myId", conversation.myId);
                intent.putExtra("contactId", conversation.contactId);
                intent.putExtra("contactName", conversation.contactName);
                intent.putExtra("contactPhoto", conversation.contactPhoto);
                mContext.startActivity(intent);
            }
        });
        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Conversation conversation = mConversationList.get(position);
        holder.name.setText(conversation.contactName);
        holder.message.setText(conversation.lastMessage);
        holder.time.setText(conversation.lastContactTime);
//        StorageReference imageRef = FirebaseStorage.getInstance().getReference(contact.photo);
//        Glide.with(mContext).using(new FirebaseImageLoader()).load(imageRef).into(holder.photo);
    }

    @Override
    public int getItemCount() {
        return mConversationList.size();
    }
}
