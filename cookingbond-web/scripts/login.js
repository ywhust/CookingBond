$(function(){
    $("#btnLogin").click(function() {
        //get email and password
        var email = $("#login-form input:first").val();
        var pswrd = $("#login-form input:last").val();

        //verify Gatech email address
        // var host = email.split("@");
        // if (! (host[1] == "gatech.edu")) {
        //     alert("Please use your gatech.edu email! Thank you!");
        //     return;
        // }

        //sign in
        firebase.auth().signInWithEmailAndPassword(email, pswrd)
        .then(function() {
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

               redirect(user.uid);

            //   const messaging = firebase.messaging();
            //   messaging.requestPermission()
            //   .then(function(){
            //     console.log("Have permission");
            //     return messaging.getToken();
            //   })
            //   .then(function(token){
            //     console.log(token);
            //     redirect(user.uid);

            // })
            // .catch(function(err) {
            //     console.log(err);
            //     redirect(user.uid);
            // })

            } else {
              alert('Fail to login! Please try again later!');
            }
          });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    });
})

function redirect(uid) {
  var ref = firebase.database().ref("users/"+ uid + "/lastStatus");
  ref.once("value", function(snapshot) {
      if (snapshot.val() == null) {
        window.location.href = "select.html?user=" + uid;
      } else if (snapshot.val() == "cook") {
        window.location.href = "cookShowFood.html?user=" + uid;
      } else if (snapshot.val() == "eater") {
        window.location.href="FilterPage.html?user=" + uid;
      }
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });

}