$(function(){
	urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];
    //alert(uid);
    prepareNav(uid);
    var ref = firebase.database().ref("users/" + uid + "/transactions");
    ref.once("value", function(snapshot) {
        if (snapshot.val() == null) {
            console.log("No transaction history for this cook!");
        } else {
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                getTransactionInfo(childData);
            });
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
})

function getTransactionInfo(tid){
    var transRef = firebase.database().ref("transactions/"+ tid);
    transRef.once("value", function(snapshot) {
        var key = snapshot.key;
        var data = snapshot.val();
        var cookuid = data["cook"];
        var eateruid = data["eater"];
        var status = data["status"];
        var amount = data["amount"];
        var time = data["time"];
        var rateStatus = false;
        if (cookuid == uid) {
            oppouid = eateruid;
            if (data.hasOwnProperty("rateforeater")) {
                rateStatus = true;
            }
        } else {
            oppouid = cookuid;
            if (data.hasOwnProperty("rateforcook")) {
                rateStatus = true;
            }
        }

        nameRef = firebase.database().ref("users/" + oppouid);
        nameRef.once("value", function(childSnapshot) {
            var childData = childSnapshot.val();
            var name = childData["name"];
            addTransaction(tid, name, time, amount, status, rateStatus);
        })
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function addTransaction(tid, name, time, amount, status, rateStatus){
    time = time.replace(/-/g,"/");
    time = time.replace("T","\n");
    $("#tbody").append("<tr id = " + tid +"></tr>");
    $("tr:last").append("<th scope = 'row'>" + name +"</th>");
    $("tr:last").append("<td>" + time +"</td>");
    $("tr:last").append("<td>" + amount +"</td>");
    if (status == "cancelled" || status == "complete") {
        $("tr:last").append(`<td> ${status} </br> <button value =${tid} class = 'btnView btn btn-info btn-trans'>View</button> </td>`);
    }
    if (status == "unpaid") {
        $("tr:last").append(`<td> ${status} </br> <button value =${tid} class = 'btnCancel btn btn-info btn-trans'>Cancel</button> </td>`);
    }
    if (status == "ongoing" && (!rateStatus)) {
        $("tr:last").append(`<td> ${status} </br> <button value =${tid} class = 'btnRate btn btn-info btn-trans'>Rate</button> </td>`);
    }

    if (status == "ongoing" && (rateStatus)) {
        $("tr:last").append(`<td> ${status} </br> </td>`);
    }

    $(".btnCancel").click(function() {
        var tid = $(this).attr("value");
        console.log(tid);
        firebase.database().ref("transactions/" + tid + "/status").set("cancelled")
        .then(result => {
            location.reload();
        })
    })

    $(".btnRate").click(function() {
        var tid = $(this).attr("value");
        console.log(tid);
        window.location.href = `rate.html?user=${uid}=${tid}`;
    })

    $(".btnView").click(function() {
        var tid = $(this).attr("value");
        console.log(tid);
        window.location.href = `view.html?user=${uid}=${tid}`;
    })
}