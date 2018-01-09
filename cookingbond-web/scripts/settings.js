$(function(){
    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];

    prepareNav(uid);
    changeStatus();

    var userRef = firebase.database().ref("users/"+uid);
    userRef.once("value", function(snapshot) {
        var name, age, email, gender, phone, photo;
        data = snapshot.val();
        name = data["name"];
        age = data["age"];
        email = data["email"];
        gender = data["gender"];
        phone = data["phone"];
        if (data.hasOwnProperty("photo")) {
            //console.log(picture);
            var phoPath = firebase.storage().ref(data["photo"]);
            //console.log(picPath);
            phoPath.getDownloadURL()
            .then(function(url) {
              $("img").attr("src", url);
            })
            .catch(function(error) {
                console.log(error);
            });
        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    $("#modifyProfile").click(function() {
         window.location.href = "changeProfile.html?user=" + uid;
    });

    $("#btnSignOut").click(function(){
       var statusRef = firebase.database().ref("users/" + uid + "/lastStatus");
       statusRef.once("value", function(snapshot) {
           status = snapshot.val();
           if (status == "cook") {
                    const p1 = firebase.database().ref("cooks/" + uid + "/availableDishes").remove();
                    const p2 = firebase.database().ref("cooks/" + uid + "/label").remove();
                    const p3 = firebase.database().ref("cooks/" + uid + "/location").remove();
                    const p4 = firebase.database().ref("cooks/" + uid + "/availableStatus").set("false");
                    Promise.all([p1, p2, p3, p4]).then(result=>{
                        logOut();
                    })
            }

            if (status == "eater") {
                logOut();
            }
        });
    });

})

function logOut() {
    firebase.auth().signOut().then(function() {
          console.log('Signed Out');
          window.location.href = "index.html";
    }, function(error) {
          console.error('Sign Out Error', error);
    })
}

function changeStatus(){
    var statusRef = firebase.database().ref("users/" + uid + "/lastStatus");
    statusRef.once("value", function(snapshot) {
        status = snapshot.val();
        if (status == "cook") {
            $("#changeStatus").html("Wanna Eat?");
            $("#changeStatus").click(function(){
                const p1 = firebase.database().ref("cooks/" + uid + "/availableDishes").remove();
                const p2 = firebase.database().ref("cooks/" + uid + "/label").remove();
                const p3 = firebase.database().ref("cooks/" + uid + "/location").remove();
                const p4 = firebase.database().ref("cooks/" + uid + "/availableStatus").set("false");
                const p5 = firebase.database().ref("users/" + uid + "/lastStatus").set("eater");
                Promise.all([p1, p2, p3, p4, p5]).then(result =>{
                    window.location.href = "FilterPage.html?user=" + uid;
                })
            });
        }
        if (status == "eater") {
            $("#changeStatus").html("Wanna Cook?");
            $("#changeStatus").click(function(){
                firebase.database().ref("users/" + uid + "/lastStatus").set("cook")
                .then(function() {
                    window.location.href = "cookShowFood.html?user=" + uid;
                })
            });
        }
    });
}