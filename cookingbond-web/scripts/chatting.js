$(function(){
     //var user = firebase.auth().currentUser;
    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];
    console.log(uid);
    prepareNav(uid);
    //alert(uid);

    var statusRef = firebase.database().ref("users/" + uid + "/lastStatus");
    statusRef.once("value", function(snapshot) {
        var status = snapshot.val();
        if (status == "cook") {
            myStatus = "cook";
            var cookContactRef = firebase.database().ref("contacts_cook/" + uid);
            cookContactRef.on("child_added", function(data) {
                if (data.val() == null) {
                    console.log("No Contacts Before!");
                } else {
                    // var chattingMap = data;
                    // var keys = Object.keys(chattingMap);
                    // for (var i = 0; i < keys.length; i++) {
                    //     console.log(keys[i]);
                    //     console.log(chattingMap[keys[i]]);
                    //     getLastMessage(keys[i], chattingMap[keys[i]]);
                    // }
                    getLastMessage(data.key, data.val());
                }
            });
        }
        if(status == "eater") {
            myStatus = "eater";
            var eaterContactRef = firebase.database().ref("contacts_eater/" + uid);
            eaterContactRef.on("child_added", function(data) {
                if (snapshot.val() == null) {
                    console.log("No Contacts Before!");
                } else {
                    // var chattingMap = snapshot.val();
                    // var keys = Object.keys(chattingMap);
                    // for (var i = 0; i < keys.length; i++) {
                    //     getLastMessage(keys[i], chattingMap[keys[i]]);
                    // }
                    getLastMessage(data.key, data.val());
                }
            });
        }
    });

    $("#btnEat").click(function(){
        window.location.href = "transaction.html?user="+uid;
    });
})

function getLastMessage(oppouid, cid) {
    var recentMsgRef = firebase.database().ref('messages/'+ cid).limitToLast(1);
    recentMsgRef.once("value", function(s) {
        // console.log(data.key);
        // console.log(data.val());
        // var final = data.val();
        var msg2Map = s.val();
        var keyM = Object.keys(msg2Map);
        var msgMap = msg2Map[keyM[0]];
        var lastMessage =msgMap["message"];
        getOppoInfo(oppouid, lastMessage, cid);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function getOppoInfo(oppouid, lastMessage, cid) {

    var ref = firebase.database().ref("users/" + oppouid);
    ref.once("value", function(snapshot) {
        var key = snapshot.key;
        var data = snapshot.val();
        if (data.hasOwnProperty("photo")) {
            var phoPath = firebase.storage().ref(data["photo"]);
            phoPath.getDownloadURL()
            .then(function(url) {
                appendOppoDiag(true, url, data["name"], lastMessage, oppouid, cid);
            })
            .catch(function(error) {
                console.log(error);
            });
        } else {
            appendOppoDiag(false, "123", data["name"], lastMessage, oppouid, cid);
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

function appendOppoDiag(hasPhoto, photoURL, name, lastMessage,oppouid, cid) {
    $(".content:first").append("<div class='row' value =" + cid + " id="+ oppouid +"></div>");
    $(".row:last").append(`<div class='col-12 textLeft darkyellow'><h5>${name}</h5></div>`);
    $(".row:last").append(`<div class='col-3'></div>`);
    if(hasPhoto){
        $(".col-3:last").append("<img src =" + photoURL + " height = 40px width = 40px verticalAlign = middle/>");
    } else {
        $(".col-3:last").append("<img src = images/profile.jpg height = 40px width = 40px verticalAlign = middle/>");
    }
    $(".row:last").append(`<div class='col-9 textLeft'> ${lastMessage}</div>`);
    $(".row").click(function(){
        var cidStr = $(this).attr("value");
        var oppoStr = $(this).attr("id");
        enterRoom(oppoStr, cidStr);
    })

}

function enterRoom(oppouid, cid) {
    console.log(oppouid);
    console.log(cid);
    window.location.href = "chattingRoom.html?user=" + uid +"=" + oppouid + "=" + cid;
}