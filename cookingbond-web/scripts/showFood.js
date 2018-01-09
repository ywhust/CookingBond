
$(function() {

    //var user = firebase.auth().currentUser;
    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];

    prepareNav(uid);
    refreshData(uid);

    //alert(uid);
    var availableDishes = {};
    var labelSet = new Set();

    $("#btnAvailable").click(function(){
        $("#foodWindow input[type=checkbox]:checked").each(function(){
            availableDishes[this.id] = this.name;
            labelSet.add(this.value);
        });
        console.log(labelSet);
        var label = Array.from(labelSet);
        console.log(label);
        firebase.database().ref("cooks/"+ uid + "/availableStatus").set("true");
        firebase.database().ref("cooks/"+ uid + "/label").set(label);
        firebase.database().ref("cooks/"+ uid + "/availableDishes").set(availableDishes);
        setTimeout(directToMap, 1000);
        //alert("Data has been updated!");
    });

    $("#btnAddDish").click(function(){
        window.location.href = "cookAddFood.html?user=" + uid;
    });
})

function directToMap() {
    window.location.href = "cookMap.html?user=" + uid;
}

function refreshData(uid) {
    var ref = firebase.database().ref("cooks/"+ uid + "/allDishes");
    ref.once("value", function(snapshot) {
        if (snapshot.val() == null) {
            console.log("No dishes for this cook!");
        } else {
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                getDishInfo(childKey);
            });
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return true;
}

function getDishInfo(did) {
    //alert(typeof(did));
    var dishRef = firebase.database().ref("dishes/"+did);
    dishRef.once("value", function(snapshot) {
        var data = snapshot.val();
        var name = data["name"];
        var picture = data["picture"];
        var flavor = data["flavor"];
        var price = data["price"];
        var picPath = firebase.storage().ref(picture);
        //console.log(picPath);
        picPath.getDownloadURL()
        .then(function(url) {
            addDish(name, url, flavor, price, did);
        })
        .catch(function(error) {
            console.log(error);
        });

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function addDish(name, pictureURL, flavor, price, did) {
    //console.log(pictureURL);
    // $("#foodWindow").append("<div class = row>");
    // $("div:last").attr("id", did+"Dish");
    // $("div[class=row]:last").append("<div class = column left thumbnail></div>");
    // $("div[class=column]:last").append("<img src = " + pictureURL +" id = " + did + " height = 100% width = 140px verticalAlign = middle/>");
    // $("div[class=row]:last").append("<div class = column right></div>");
    // $("div[class=column]:last").append("Name: " + name + "<br/>");
    // $("div[class=column]:last").append("Price: " + price + "<br/>");
    // $("div[class=column]:last").append("Flavor: " + flavor + "<br/>");
    // $("div[class=column]:last").append("Add this one? <input class = specialInput type = 'checkbox' value = " + flavor + " name =" + name + " id =" + did + "><br/>");
    // $("div[class=column]:last").append("<button type='button' class='btn btn-info btnDeleteDish' value = " + did +"> Delete" + "</button>");
    // $("div[class=column]:last").append("<button type='button' class='btn btn-info btnModifyDish' value = " + did +"> Modify" + "</button>");

    $("#foodWindow").append(`<div class= "row rowShowDish" id=${did}Dish></div>`);
    $(".row:last").append(`<div class=col-5><img src=${pictureURL} id=${did} height=100% width=130px/></div>`);
    $(".row:last").append(`<div class='col-7 textLeft yellow'></div>`);
    $(".col-7:last").append(`<div class = 'row darkyellow'> <h5> ${name} </h5> </div>`);
    $(".col-7:last").append(`<div class = 'row'> Add to menu? <br/> Price: ${price} <br/> Flavor: ${flavor} <br/> </div>`);
    $(".row:last").append(`<input class=specialInput type = checkbox value = ${flavor} name = ${name} id =${did}>`);
    $(".col-7:last").append(`<div class = "row"> </div>`);
    $(".row:last").append(`<button type='button' class='btn btn-info btnDeleteDish' value = ${did}> Delete </button>`);
    $(".row:last").append(`<button type='button' class='btn btn-info btnModifyDish' value = ${did}> Modify </button>`);

    $(".btnDeleteDish[value = " + did +"]").click(function(){
        deleteDish(name, did);
        //location.reload();
    });

    $(".btnModifyDish[value = " + did + "]").click(function(){
        window.location.href = "cookModifyFood.html?user=" + uid +"=" + did;
    })

}

function deleteDish(name, did) {
    var tempRef = firebase.database().ref("dishes/"+did);
    tempRef.once("value", function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childKey == "picture") {
            picURL = childData;
            firebase.storage().ref().child(picURL).delete()
            .then(function(){
                console.log("Deleted Successfully!");
                firebase.database().ref("cooks/" + uid + "/allDishes/" + did).remove();
                firebase.database().ref("dishes/" + did).remove();
                location.reload();
            }).catch(function(error) {
                console.log(error);
            });
        }
      });
    });
}