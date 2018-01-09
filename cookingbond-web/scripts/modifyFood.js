
$(function(){

    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];
    did = urlSecPart.split("=")[2];
    flagPic = true;

    var dishRef = firebase.database().ref("dishes/"+did);
    dishRef.once("value", function(snapshot) {
        var data = snapshot.val();
        var name = data["name"];
        var picture = data["picture"];
        var flavor = data["flavor"];
        var price = data["price"];
        var description = data["description"];
        var material = data["material"];

        var picPath = firebase.storage().ref(picture);

        picPath.getDownloadURL()
        .then(function(url) {

          //show info on webpage
          $("img").attr("src", url);
          $("#food-form input[name = name]").attr("value", name);
          $("#food-form input[name = price]").attr("value", price);
          $("#flavor option[value = " + flavor + " ] ").attr("selected", "selected");
          $("textarea[name = material]").text(material);
          $("textarea[name = description]").text(description);

        })
        .catch(function(error) {
            console.log(error);
        });
    })

    $("#picture").on("change", function(e){
          //Get file
          file = e.target.files[0];
          flagPic = false;
    })

    $("#btnBack").click(function(){
      window.location.href = "cookShowFood.html?user="+uid;
    });

    $("#btnSubmit").click(function(){
      name = $("#food-form input[name = name]").val();
      price = $("#food-form input[name = price]").val();
      flavor = $("#flavor").val();
      material =$("textarea[name = material]").val();
      description =$("textarea[name = description]").val();

      if (! (name && price && flavor && material && description)) {
        alert("Certain field is missing! Please fill in all the fields in the form");
        return;
      }

      var tempRef = firebase.database().ref("dishes/"+did);
      tempRef.once("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            if (childKey == "picture") {
                picURL = childData;
                if (flagPic) {
                pictureNotChanged(did, name, price, material, description, flavor, uid, picURL);
              } else {
                pictureChanged(did, name, price, material, description, flavor, uid, picURL);
              }
            }
          });
        });
    });

})

function pictureNotChanged(did, name, price, material, description, flavor, uid, picURL) {

  var postData = {
        name: name,
        picture: picURL,
        price: Number(price),
        material: material,
        description: description,
        flavor: flavor,
        cook: uid
      };

      firebase.database().ref("dishes/" + did).set(postData);
      firebase.database().ref("cooks/" + uid + "/allDishes/" + did).set(name);
      alert("Dish has been modified!");
      setTimeout(function(){location.reload();}, 0);

}

function pictureChanged(did, name, price, material, description, flavor, uid, picURL) {

    var postData = {
        name: name,
        picture: "images/dishes/" + did + "/" + file.name,
        price: Number(price),
        material: material,
        description: description,
        flavor: flavor,
        cook: uid
      };


      firebase.database().ref("dishes/" + did).set(postData);
      firebase.database().ref("cooks/" + uid + "/allDishes/" + did).set(name);

      //Create a storage ref
      firebase.storage().ref().child(picURL).delete()
      .then(function(){
        console.log("Deleted Successfully!");
        var storageRef = firebase.storage().ref("images/dishes/" + did + "/" + file.name);

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
                alert("Dish has been modified!");
                location.reload();
            }

        );
      }).catch(function(error) {
        console.log(error);
      })
}