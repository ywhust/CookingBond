package com.sweetheart.cookingbond;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import com.sweetheart.cookingbond.classes.Dish;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

public class AddDishActivity extends AppCompatActivity {

    private static final String TAG = "AddDishActivity";
    private static final int SELECT_PHOTO = 1;

    private EditText mName;
    private EditText mFlavor;
    private EditText mPrice;
    private EditText mDescription;
    private ImageView mPicture;

    // Firebase related variables
    private FirebaseUser mUser;
    private DatabaseReference mDishRef;
    private DatabaseReference mCookRef;
    private StorageReference mImageRef;

    private Bitmap mSelectImage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_dish);

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        mName = (EditText) findViewById(R.id.add_dish_name);
        mFlavor = (EditText) findViewById(R.id.add_dish_flavor);
        mPrice = (EditText) findViewById(R.id.add_dish_price);
        mDescription = (EditText) findViewById(R.id.add_dish_description);
        mPicture = (ImageView) findViewById(R.id.add_dish_picture);

        mUser = FirebaseAuth.getInstance().getCurrentUser();
        mDishRef = FirebaseDatabase.getInstance().getReference("dishes/");
        mCookRef = FirebaseDatabase.getInstance().getReference("cooks/" + mUser.getUid() + "/allDishes/");
        mImageRef = FirebaseStorage.getInstance().getReference("images/dishes");
    }

    public void selectPicture(View view) {
        Intent pictureSelectIntent = new Intent(Intent.ACTION_PICK);
        pictureSelectIntent.setType("image/*");
        startActivityForResult(pictureSelectIntent, SELECT_PHOTO);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent imageReturnedIntent) {
        super.onActivityResult(requestCode, resultCode, imageReturnedIntent);
        if (requestCode == SELECT_PHOTO && resultCode == RESULT_OK && imageReturnedIntent != null) {
            try {
                Uri imageUri = imageReturnedIntent.getData();
                InputStream imageStream = getContentResolver().openInputStream(imageUri);
                Bitmap selectedImage = BitmapFactory.decodeStream(imageStream);
                mSelectImage = selectedImage;
                mPicture.setImageBitmap(selectedImage);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                Toast.makeText(AddDishActivity.this, "Something went wrong",
                        Toast.LENGTH_LONG).show();
            }
        } else {
            Toast.makeText(AddDishActivity.this, "You haven't picked Image",
                    Toast.LENGTH_SHORT).show();
        }
    }

    public void addDish(View view) {
        if (mUser != null) {
            String userId = mUser.getUid();
            String key = mDishRef.push().getKey();

            if (mSelectImage != null) {
                uploadImage(key);
            }

            // Post the new created dish to Firebase Database
            String pictureUrl = "images/dishes/" + key + "/"
                    + replaceSpace(mName.getText().toString()) + ".jpg" ;
            Dish dish = new Dish(userId,
                                 mName.getText().toString(),
                                 mFlavor.getText().toString(),
                                 mDescription.getText().toString(),
                                 Double.parseDouble(mPrice.getText().toString()),
                                 pictureUrl);
            mDishRef.child(key).setValue(dish.toMap());

            // Add the new dish id to dishes list
            mCookRef.child(key).setValue(mName.getText().toString());
        } else {
            Toast.makeText(AddDishActivity.this, "You need to login first!",
                    Toast.LENGTH_SHORT).show();
        }
    }

    private void uploadImage(String key) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        mSelectImage.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        byte[] data = baos.toByteArray();

        UploadTask uploadTask = mImageRef.child(key + "/" + mName.getText().toString() + ".jpg").putBytes(data);
        uploadTask.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception exception) {
                Log.w(TAG, "Upload image failed!");
                Toast.makeText(AddDishActivity.this, "Failed to upload picture",
                        Toast.LENGTH_SHORT).show();
            }
        }).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                Log.w(TAG, "Upload image succeeds!");
                Toast.makeText(AddDishActivity.this, "Picture already upload",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    private String replaceSpace(String str) {
        String[] sArr = str.split(" ");
        String res = sArr[0];
        for (int i = 1; i < sArr.length; i++) {
            res = res + "_" + sArr[i];
        }
        return res;
    }
}
