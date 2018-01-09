
$(function(){

    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];
    phoChanged = false;
    photoURL = "123";
    showProfile();

    $("#photo").on("change", function(e){
          //Get file
          file = e.target.files[0];
          phoChanged = true;
          console.log("photo changed!")
    })

    $("#btnBack").click(function(){
      window.location.href = "mySettings.html?user="+uid;
    });

    $("#btnSubmit").click(function(){

      var name = $("#register-form input[name = name]").val();
      var gender = $("#register-form input[type = radio]:checked").val();
      var age = $("#register-form input[name = age]").val();
      var phone = $("#register-form input[name = phone]").val();
      // console.log(name);
      if (! (name && gender && age && phone)) {
        alert("Certain field is missing! Please fill in all the fields in the form");
        return;
      }

      const p1 = firebase.database().ref(`users/${uid}/name`).set(name);
      const p2 = firebase.database().ref(`users/${uid}/gender`).set(gender);
      const p3 = firebase.database().ref(`users/${uid}/age`).set(Number(age));
      const p4 = firebase.database().ref(`users/${uid}/phone`).set(phone);
      if(phoChanged) {
          pictureChanged();
      } else {
        Promise.all([p1, p2, p3, p4]).then(result => {
            alert("User has been modified!");
            location.reload();
        })
      }

    });

})

function showProfile() {
    var userRef = firebase.database().ref("users/"+uid);
    userRef.once("value", function(snapshot) {
        var data = snapshot.val();
        if (data.hasOwnProperty("photo")) {
            photoURL = data["photo"];
            var phoPath = firebase.storage().ref(photoURL);
                phoPath.getDownloadURL()
                .then(function(url) {
                  $("img").attr("src", url);
                  $("#register-form input[name = name]").attr("value", data["name"]);
                  $("#register-form .specialInput[value = " + data["gender"] + " ] ").attr("checked", true);
                  $("#register-form input[name = age]").attr("value", data["age"]);
                  $("#register-form input[name = phone]").attr("value", data["phone"]);
                  $("#register-form input[name = email]").attr("value", data["email"]);
                  $("#register-form input[name = email]").attr("disabled", true);

                })
                .catch(function(error) {
                    console.log(error);
                });
        } else {
            $("#register-form input[name = name]").attr("value", data["name"]);
            $("#register-form .specialInput[value = " + data["gender"] + " ] ").attr("checked", true);
            $("#register-form input[name = age]").attr("value", data["age"]);
            $("#register-form input[name = phone]").attr("value", data["phone"]);
            $("#register-form input[name = email]").attr("value", data["email"]);
            $("#register-form input[name = email]").attr("disabled", true);
        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function pictureChanged() {

      //Create a storage ref
      console.log(photoURL);
      firebase.storage().ref().child(photoURL).delete()
      .then(function(){
        console.log("Deleted Successfully!");
        var storageRef = firebase.storage().ref("images/users/" + uid + "/" + file.name);
        firebase.database().ref(`users/${uid}/photo`).set("images/users/" + uid + "/" + file.name);
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
                alert("User has been modified!");
                location.reload();
            }

        );
      }).catch(function(error) {
        console.log(error);
      })
}