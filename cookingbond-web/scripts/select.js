$(function(){

    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];

    $("#btnCook").click(function() {
        firebase.database().ref("users/" + uid + "/lastStatus").set("cook")
        .then(result=>{
            window.location.href = "cookShowFood.html?user="+uid;
        });
    });

    $("#btnEater").click(function() {
        firebase.database().ref("users/" + uid + "/lastStatus").set("eater")
        .then(result => {
            window.location.href = "FilterPage.html?user=" + uid;
        })
    });

     $("#btnBack").click(function(){
      window.location.href = "index.html";
    });

})

