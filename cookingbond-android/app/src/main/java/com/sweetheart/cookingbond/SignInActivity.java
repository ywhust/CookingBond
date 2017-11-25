package com.sweetheart.cookingbond;

import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.iid.FirebaseInstanceId;

public class SignInActivity extends AppCompatActivity {
    private static final String TAG = "SignInActivity";

    private EditText mEmail;
    private EditText mPassword;
    private Button mSignIn;
    private TextView mSignUp;

    private FirebaseAuth mAuth;
    private FirebaseAuth.AuthStateListener mAuthListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        mEmail = (EditText) findViewById(R.id.sign_in_email);
        mPassword = (EditText) findViewById(R.id.sign_in_password);
        mSignIn = (Button) findViewById(R.id.sign_in_button);
        mSignUp = (TextView) findViewById(R.id.sign_up_link);

        // Make part of the text in TextView clickable
        SpannableString ss = new SpannableString("Not Registered? Create an account");
        ClickableSpan clickableSpan = new ClickableSpan() {
            @Override
            public void onClick(View widget) {
                // Go to SignUpActivity
                startActivity(new Intent(SignInActivity.this, SignUpActivity.class));
            }

            @Override
            public void updateDrawState(TextPaint ds) {
                super.updateDrawState(ds);
                ds.setUnderlineText(false);
            }
        };
        ss.setSpan(clickableSpan, 16, 33, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        mSignUp.setText(ss);
        mSignUp.setMovementMethod(LinkMovementMethod.getInstance());

        mAuth = FirebaseAuth.getInstance();
        mAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = firebaseAuth.getCurrentUser();
                if (user != null) {
                    // User is signed in
                    Log.d(TAG, "onAuthStateChanged:signed_in:" + user.getUid());
                    // Get token
                    String token = FirebaseInstanceId.getInstance().getToken();
                    DatabaseReference userRef = FirebaseDatabase.getInstance()
                            .getReference("/users/" + user.getUid());
                    if (token != null) {
                        userRef.child("notificationTokens").child(token).setValue(true);
                    }
                    userRef.child("lastStatus").addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(DataSnapshot dataSnapshot) {
                            String status = dataSnapshot.getValue(String.class);
                            if (status.equals("cook")) {
                                startActivity(new Intent(SignInActivity.this, CookMainActivity.class));
                            } else {
                                startActivity(new Intent(SignInActivity.this, EaterMainActivity.class));
                            }
                        }

                        @Override
                        public void onCancelled(DatabaseError databaseError) {

                        }
                    });
                } else {
                    // User is signed out
                    Log.d(TAG, "onAuthStateChanged:signed_out");
                }
            }
        };

        mSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = mEmail.getText().toString();
                String password = mPassword.getText().toString();
                mAuth.signInWithEmailAndPassword(email, password)
                        .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        Log.w(TAG, "signInWithEmail:onComplete:" + task.isSuccessful());
                        // If sign in fails, display a message to the user. If sign in succeeds
                        // the auth state listener will be notified and logic to handle the
                        // signed in user can be handled in the listener.
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "signInWithEmail:failed", task.getException());
                            Toast.makeText(SignInActivity.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        mAuth.addAuthStateListener(mAuthListener);
    }

    @Override
    public void onStop() {
        super.onStop();
        if (mAuthListener != null) {
            mAuth.removeAuthStateListener(mAuthListener);
        }
    }

//    public void signIn(View view) {
//        String email = mEmail.getText().toString();
//        String password = mPassword.getText().toString();
//        mAuth.signInWithEmailAndPassword(email, password)
//                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
//            @Override
//            public void onComplete(@NonNull Task<AuthResult> task) {
//                Log.w(TAG, "signInWithEmail:onComplete:" + task.isSuccessful());
//                // If sign in fails, display a message to the user. If sign in succeeds
//                // the auth state listener will be notified and logic to handle the
//                // signed in user can be handled in the listener.
//                if (!task.isSuccessful()) {
//                    Log.w(TAG, "signInWithEmail:failed", task.getException());
//                    Toast.makeText(SignInActivity.this, "Authentication failed.",
//                            Toast.LENGTH_SHORT).show();
//                }
//            }
//        });
//    }
}
