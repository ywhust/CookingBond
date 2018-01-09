$(function(){

  urlSecPart = location.search;
  var splitResult = urlSecPart.split("=");
  cookuid = splitResult[1];
  eateruid = splitResult[2];

  setAvailableDishes();
  setName(cookuid);
  setName(eateruid);

  $("#btnBack").click(function(){
      window.location.href = "chattingPage.html?user=" + cookuid;
  })


  $("#btnConfirm").click(function(){
    var cookName = $("#transaction-form input[name = cookName]").val();
    var eaterName = $("#transaction-form input[name = eaterName]").val();
    var dish= $("#did").val();
    var amount = $("#transaction-form input[name = amount]").val();
    var time = $("#transaction-form input[name = time]").val();
    console.log(time);
    var status = "unpaid";
    if (!(cookName && eaterName && dish && amount && time)) {
      alert("Certain field is missing! Please fill in all the fields in the form");
        return;
    }
    var newPostKey = firebase.database().ref().child("transactions").push().key;

    var postData = {
      "cook": cookuid,
      "eater": eateruid,
      "dish": dish,
      "amount": Number(amount),
      "time": time,
      "status": status,
    }

    firebase.database().ref("transactions/" + newPostKey).set(postData);

    updateTid(cookuid, eateruid, newPostKey);

  })

})

function setAvailableDishes() {
  var ref = firebase.database().ref("cooks/" + cookuid + "/availableDishes");
  ref.once("value", function(snapshot) {
        if (snapshot.val() == null) {
            console.log("No available dishes now!");
        } else {
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log(childKey);
                $("#did").append("<option value = " + childKey + ">" + childData + "</option>");
            });
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function setName(uid) {
  var uidRef = firebase.database().ref("users/" + uid);
  uidRef.once("value", function(snapshot) {
      var key = snapshot.key;
      var data = snapshot.val();
      if (data["lastStatus"] == "cook") {
        $("#transaction-form input[name = cookName]").val(data["name"]);
      }
      if (data["lastStatus"] == "eater") {
        $("#transaction-form input[name = eaterName]").val(data["name"]);
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });
}

function updateTid(cookuid, eateruid, newPostKey) {
  var tidCookref = firebase.database().ref("users/"+ cookuid +"/transactions");
  const t1 = tidCookref.once("value", function(snapshot) {
              if (snapshot.val() == null) {
                 var transList = [];
                 transList = [newPostKey];
                 tidCookref.set(transList);
              } else {
                var transList = snapshot.val();
                console.log(transList);
                transList.push(newPostKey);
                tidCookref.set(transList);
              }
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });

  var tidEaterref = firebase.database().ref("users/"+ eateruid +"/transactions");
  const t2 = tidEaterref.once("value", function(snapshot) {
              if (snapshot.val() == null) {
                 var transList = [];
                 transList = [newPostKey];
                 tidEaterref.set(transList);
              } else {
                var transList = snapshot.val();
                console.log(transList);
                transList.push(newPostKey);
                tidEaterref.set(transList);
              }
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
  //alert("Your transaction has been sent!");
  Promise.all([t1, t2]).then(result => {
    window.location.href = "transactionHistory.html?user="+cookuid
  });

}