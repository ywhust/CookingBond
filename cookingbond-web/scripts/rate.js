
$(function(){
    urlSecPart = location.search;
    var splitResult = urlSecPart.split("=");
    myuid = splitResult[1];
    tid = splitResult[2];
    oppouid = "123";

     view();

     $("#btnBack").click(function(){
      window.location.href = "transactionHistory.html?user=" + myuid;
    });

})

function view() {
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

        if (cookUid == myuid) {
            oppouid = eaterUid;
            star(myuid, oppouid, "eater", tid);
        }

        if (eaterUid == myuid) {
            oppouid = cookUid;
            star(myuid, oppouid, "cook", tid);
        }

    })
}

function star(myuid, oppouid, s, tid) {
     $("ul.rating li a").click(function(){
         var grade = $(this).attr("title");
         var cl = $(this).parent().attr("class");
         //console.log(grade);
         $(this).parent().parent().removeClass().addClass("rating "+cl+"star");
         $(this).blur();
         rate(oppouid, Number(grade), s, tid);
    })
}

function rate(oppouid, grade, s, tid) {
    var ref = firebase.database().ref(`users/${oppouid}`);
    ref.once("value", function(snapshot) {
        var data = snapshot.val();
        if (s == "cook") {
            if (data.hasOwnProperty("ratingCook")) {
                var g = data["ratingCook"];
                var num = data["tCompleteCook"];
                var ave = ((g * num + Number(grade))/(num + 1.0));
                const p1 = firebase.database().ref(`users/${oppouid}/ratingCook`).set(ave);
                const p2 = firebase.database().ref(`users/${oppouid}/tCompleteCook`).set(num + 1);
                const p3 = firebase.database().ref(`transactions/${tid}/rateforcook`).set(grade);
                Promise.all([p1, p2, p3]).then(result=>{
                    changeTidStatus(grade);
                });

            } else {
                const p1 = firebase.database().ref(`users/${oppouid}/ratingCook`).set(grade);
                const p2 = firebase.database().ref(`users/${oppouid}/tCompleteCook`).set(1);
                const p3 = firebase.database().ref(`transactions/${tid}/rateforcook`).set(grade);
                Promise.all([p1, p2, p3]).then(result=>{
                    changeTidStatus(grade);
                });
            }
        }
        if (s == "eater") {
            if (data.hasOwnProperty("ratingEater")) {
                var g = data["ratingEater"];
                var num = data["tCompleteEater"];
                console.log(g);
                console.log(num);
                var ave = (g*num + Number(grade))/(num + 1.0);
                const p1 = firebase.database().ref(`users/${oppouid}/ratingEater`).set(ave);
                const p2 = firebase.database().ref(`users/${oppouid}/tCompleteEater`).set(num + 1);
                const p3 = firebase.database().ref(`transactions/${tid}/rateforeater`).set(grade);
                Promise.all([p1, p2, p3]).then(result=>{
                    changeTidStatus(grade);
                });

            } else {
                const p1 = firebase.database().ref(`users/${oppouid}/ratingEater`).set(grade);
                const p2 = firebase.database().ref(`users/${oppouid}/tCompleteEater`).set(1);
                const p3 = firebase.database().ref(`transactions/${tid}/rateforeater`).set(grade);
                Promise.all([p1, p2, p3]).then(result=>{
                    changeTidStatus(grade);
                });
            }
        }
    })
}

function changeTidStatus(grade) {
    var tempR = firebase.database().ref(`transactions/${tid}`);
    tempR.once("value", function(snapshot){
        var data = snapshot.val();
        if (data.hasOwnProperty("rateforcook") && data.hasOwnProperty("rateforeater")) {
            firebase.database().ref(`transactions/${tid}/status`).set("complete")
            .then(result => {
                alert("Your rating for him/her is :" + grade);
            })
        } else {
            alert("Your rating for him/her is :" + grade);
        }
    })
}