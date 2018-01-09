$(function(){

    urlSecPart = location.search;
    var splitResult = urlSecPart.split("=");
    myuid = splitResult[1];
    oppouid = splitResult[2];
    cid = splitResult[3];
    myStatus = "123";

    // prepareNav(myuid);

    hasMyPhoto = false;
    myURL = "123";
    hasOppoPhoto = false;
    oppoURL = "123";
    chatRef = firebase.database().ref("messages/" + cid);

    var oppoRef = firebase.database().ref("users/" + oppouid);
    oppoRef.once("value", function(snapshot) {
        var key = snapshot.key;
        var data = snapshot.val();
        if (data["lastStatus"] == "eater") {
            myStatus = "cook";
            $(".title").html("<button type='button' id='btnBack' class='btn btn-light'> Back </button>" + data["name"] + "<button type='button' id='btnEat' class='btn btn-light'> Let's eat! </button>");
        } else {
            myStatus = "eater";
            $(".title").html("<button type='button' id='btnBack' class='btn btn-light'> Back </button>" + data["name"]);
            startPaymentMonitor();
        }

        $("#btnBack").click(function() {
            window.location.href = "chattingPage.html?user=" + myuid;
        });

        $("#btnEat").click(function(){
            window.location.href = "transaction.html?user=" + myuid + "=" + oppouid;
        })

        if (data.hasOwnProperty("photo")) {
            var phoPath = firebase.storage().ref(data["photo"]);
            phoPath.getDownloadURL()
            .then(function(url) {
                hasOppoPhoto = true;
                oppoURL = url;
                getMyInfo();
            })
            .catch(function(error) {
                console.log(error);
            });
        } else {
            getMyInfo();
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    $("#btnMessage").click(function(){
        var message = $(".container input[name = content]").val();
        var newPostKey = firebase.database().ref("messages/" + cid).push().key;
        var postData = {
            to: oppouid,
            from: myuid,
            message: message,
            timestamp: ""
        };
        firebase.database().ref("messages/" + cid + "/" + newPostKey).set(postData);
        $(".container input[name = content]").val("");
    })

})

function getMyInfo() {
    //console.log(oppouid);
    var myRef = firebase.database().ref("users/" + myuid);
    myRef.once("value", function(snapshot) {
        var key = snapshot.key;
        var data = snapshot.val();
        if (data.hasOwnProperty("photo")) {
            var phoPath = firebase.storage().ref(data["photo"]);
            phoPath.getDownloadURL()
            .then(function(url) {
                hasMyPhoto = true;
                myURL = url;
                startChattingMonitor();
            })
            .catch(function(error) {
                console.log(error);
            });
        } else {
            startChattingMonitor();
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function startChattingMonitor() {
    chatRef.on("child_added", function(data) {
        var value = data.val();
        var key = data.key;
        if (value["from"] == myuid) {
            appendMyDiag(value["message"]);
        }
        if (value["from"] == oppouid) {
            appendOppoDiag(value["message"]);
        }

    })
}

function appendMyDiag(message) {
    $("#messageWindow").append("<div class='row rowChatRoom'></div>");
    $(".row:last").append(`<div class='col-2'></div>`);
    $(".row:last").append(`<div class='col-7 textLeft blue'>${message}</div>`);
    $(".row:last").append(`<div class='col-3'></div>`);
    if(hasMyPhoto){
        $(".col-3:last").append("<img src =" + myURL + " height = 40px width = 40px verticalAlign = middle/> </br>");
    } else {
        $(".col-3:last").append("<img src = images/profile.jpg height = 40px width = 40px verticalAlign = middle/> </br>");
    }
}

function appendOppoDiag(message) {
    $("#messageWindow").append("<div class='row rowChatRoom'></div>");
    $(".row:last").append(`<div class='col-3'></div>`);
    if(hasOppoPhoto){
        $(".col-3:last").append("<img src =" + oppoURL + " height = 40px width = 40px verticalAlign = middle/> </br>");
    } else {
        $(".col-3:last").append("<img src = images/profile.jpg height = 40px width = 40px verticalAlign = middle/> </br>");
    }
    $(".row:last").append(`<div class='col-7 textLeft yellow'>${message}</div>`);
    $(".row:last").append(`<div class='col-2'></div>`);
}

function startPaymentMonitor() {
    paymentRef = firebase.database().ref("transactions");
    paymentRef.on("child_added", function(data) {
        var key = data.key;
        var value = data.val();
        if ((value["cook"] == oppouid) && (value["eater"] == myuid) && (value["status"] == "unpaid")) {
            window.location.href = "payment.html?user=" + myuid + "=" + oppouid + "=" + key;
        }
    })
}