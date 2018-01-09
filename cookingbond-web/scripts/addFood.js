
$(function(){

    //var user = firebase.auth().currentUser;
    //console.log(user);
    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];

     $("#picture").on("change", function(e){
          //Get file
          file = e.target.files[0];
          //console.log(file);
    })

    $("#btnBack").click(function(){
      window.location.href = "cookShowFood.html?user="+uid;
    });

    $("#btnSubmit").click(function(){


      //get dish info from webpage
      var picture = $("#food-form input[name = picture]").val();
      var name = $("#food-form input[name = name]").val();
      var price = $("#food-form input[name = price]").val();
      var flavor = $("#flavor").val();
      var material =$("textarea[name = material]").val();
      var description =$("textarea[name = description]").val();


      if (! (picture && name && price && flavor && material && description)) {
        alert("Certain field is missing! Please fill in all the fields in the form");
        return;
      }

      //upload info to firebase
      var newPostKey = firebase.database().ref().child('dishes').push().key;
      var postData = {
        name: name,
        picture: "images/dishes/" + newPostKey + "/" + file.name,
        price: Number(price),
        material: material,
        description: description,
        flavor: flavor,
        cook: uid
      };
      const p1 = firebase.database().ref("dishes/"+newPostKey).set(postData);

      var ref = firebase.database().ref("cooks/"+ uid +"/allDishes");
      const p2 = ref.once("value", function(snapshot) {
        if (snapshot.val() == null) {
           var temp = {};
           temp[newPostKey] = name;
           ref.set(temp);
        } else {
          var dishList = snapshot.val();
          dishList[newPostKey] = name;
          ref.set(dishList);
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

      //Create a storage ref
      var storageRef = firebase.storage().ref("images/dishes/" + newPostKey + "/" + file.name);

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
            Promise.all([p1, p2]).then(result => {
                alert("Dish has been added!");
                location.reload();
            })
          }

      );

    });

})
