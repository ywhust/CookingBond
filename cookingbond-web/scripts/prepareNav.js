function prepareNav(uid) {
    var statusRef = firebase.database().ref("users/" + uid + "/lastStatus");
     statusRef.once("value", function(snapshot) {
        status = snapshot.val();
        if (status == "cook") {
            $("a:first").html("DISH");
            $("li a").eq(0).attr("href", "cookShowFood.html?user=" + uid);
        }
        if (status == "eater") {
            console.log("here");
            $("a:first").html("EXPLORE");
            $("li a").eq(0).attr("href", "FilterPage.html?user=" + uid);
        }

    });
    $("li a").eq(1).attr("href", "chattingPage.html?user=" + uid);
    $("li a").eq(2).attr("href", "transactionHistory.html?user="+uid);
    $("li a").eq(3).attr("href", "mySettings.html?user=" + uid);

    //$("li a").find("[href $=" + window.location.href +"]").addClass('here');

    var $links = $("header nav li a");
    for (var i=0; i<$links.length; i++) {
        var linkurl;
        for (var i=0; i<$links.length; i++) {
            linkurl = $($links.get(i)).attr("href");
            //alert(linkurl);
            if (window.location.href.indexOf(linkurl) != -1) {
            $($links.get(i)).addClass("here");
            $($links.get(i)).removeAttr("href");
            }
        }
    }

    return true;
}