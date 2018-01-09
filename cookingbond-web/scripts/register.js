$(function(){

    var noPhoto = true;
    $("#photo").on("change", function(e){
          //Get file
          file = e.target.files[0];
          noPhoto = false;
    })

    $("#btnRegister").click(function(){
      var photo = $("#register-form input[name = photo]").val();
      var email = $("#register-form input[name = email]").val();
      var pswrd = $("#register-form input[name = pswrd]").val();
      var name = $("#register-form input[name = name]").val();
      var gender = $("#register-form input[type = radio]:checked").val();
      var age = $("#register-form input[name = age]").val();
      var phone = $("#register-form input[name = phone]").val();

      //verify Gatech email address
      // var host = email.split("@");
      // if (! (host[1] == "gatech.edu")) {
      //     alert("Please use your gatech.edu email! Thank you!");
      //     return;
      // }

      if(!(email && pswrd && name && gender && age && phone)) {
        alert("Certain field is missing! Please fill in all the fields in the form");
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(email, pswrd)
      .then(function() {
        var user = firebase.auth().currentUser;
        if (user) {

          if (! noPhoto) {

             //Create a storage ref
            phoURL = "images/users/" + user.uid + "/" + file.name;
            var storageRef = firebase.storage().ref(phoURL);

            //Upload file
            var task = storageRef.put(file);

            //Update progress bar
            task.on("state_changed",

                function progress(snapshot) {
                    var percentage = snapshot.bytesTransferred/snapshot.totalBytes*100;
                    uploader.value = percentage;
                },

                function error(err) {
                    console.log(err);
                },

                function complete() {
                    phoPath = firebase.storage().ref(phoURL);
                    //console.log(picPath);
                    phoPath.getDownloadURL()
                    .then(function(url) {

                    // Update the default user profile in firebase
                    user.updateProfile({
                      displayName: name,
                      photoURL: url
                    });

                    $(".container img").attr("src", url);

                    alert("New Account has been created!");

                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                }

            );
          }

          if (noPhoto) {
             // Update the default user profile in firebase
              user.updateProfile({
                displayName: name,
                photoURL: "images/profile.jpg"
              });
              phoURL = null;
          }


            // Store the detail of user profile
            firebase.database().ref('users/' + user.uid).set({
              photo:phoURL,
              name: name,
              age: Number(age),
              email: email,
              phone: phone,
              gender: gender
            });

          // Email Verification
          user.sendEmailVerification().then(function() {
            alert('Email Verification Sent!');
          });

        } else {
          alert('Fail to create the account!')
        }
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });

    });

    $("#btnBack").click(function(){
      window.location.href = "index.html";
    });
})