
$(function(){
    urlSecPart = location.search;
    var splitResult = urlSecPart.split("=");
    myuid = splitResult[1];
    tid = splitResult[2];

    var tidRef = firebase.database().ref(`transactions/${tid}`);
    tidRef.once("value", function(snapshot){
        var key = snapshot.key;
        var data = snapshot.val();
        $("#transaction-form input[name = amount]").attr("value", data["amount"]);
        $("#transaction-form input[name = time]").attr("value", data["time"]);
        var did = data["dish"];
        var dishRef = firebase.database().ref(`dishes/${did}/name`);
        dishRef.once("value", function(snapshot) {
            dishName = snapshot.val();
             $("#transaction-form input[name = dish]").attr("value", dishName);
        })

        var cookUid = data["cook"];
        var cookRef = firebase.database().ref(`users/${cookUid}/name`);
        cookRef.once("value", function(snapshot) {
            cookName = snapshot.val();
            $("#transaction-form input[name = cookName]").attr("value", cookName);
        })

        var eaterUid = data["eater"];
        var eaterRef = firebase.database().ref(`users/${eaterUid}/name`);
        eaterRef.once("value", function(snapshot) {
            eaterName = snapshot.val();
            $("#transaction-form input[name = eaterName]").attr("value", eaterName);
        })

    })

     $("#btnBack").click(function(){
      window.location.href = "transactionHistory.html?user=" + myuid;
    });

})