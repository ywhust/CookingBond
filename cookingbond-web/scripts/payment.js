$(function() {
    urlSecPart = location.search;
    var splitResult = urlSecPart.split("=");
    myuid = splitResult[1];
    cookuid = splitResult[2];
    tid = splitResult[3];

    ref = firebase.database().ref(`users/${cookuid}`);
    ref.once("value", function(snapshot) {
        var key = snapshot.key;
        var data = snapshot.val();
        $("#cookemail").html(`The cook's email is: ${data["email"]}`);
        $("#cookphone").html(`The cook's phone is: ${data["phone"]}`);
    })

    $("#btnSubmit").click(function() {
        firebase.database().ref("transactions/" + tid + "/status").set("ongoing");
        setTimeout(function(){window.location.href = "chattingPage.html?user=" + myuid;}, 1000);
    })

    $("#btnCancel").click(function() {
        firebase.database().ref("transactions/" + tid + "/status").set("cancelled");
        setTimeout(function(){window.location.href = "chattingPage.html?user=" + myuid;}, 1000);
    })
})