$(function() {
	urlSecPart = location.search;
	//splitResult = urlSecPart.split("=");
	eateruid = urlSecPart.split("=")[1];
    cookuid = urlSecPart.split("=")[2];
    did = [];
    prepareNav(eateruid);
	$("#btnBack").click(function(){
        window.location.href = "FilterPage.html?user=" + eateruid;
    });

	userRef = firebase.database().ref("users/" + cookuid);
	cookRef = firebase.database().ref("cooks/" + cookuid);
	userRef.once("value", function(snapshot){
		var name,gender,rating;
		uid = snapshot.key;
		data = snapshot.val();
		name = data["name"];
		gender = data["gender"];
		//console.log(gender);
		if (name && cookuid && gender) {
			var dataRef = firebase.database().ref("users/" + uid);
			dataRef.once("value", function(snapshot){
				var data = snapshot.val();
				var uid = snapshot.key;
				//console.log(uid);
		    	if (data.hasOwnProperty("photo")) {
		            var phoPath = firebase.storage().ref(data["photo"]);
		            //console.log(photoPath);
		            phoPath.getDownloadURL()
		            .then(function(url) {
		                myURL = url;
		                showCooks(cookuid, name, gender,url);
		                getFoods();
		            })
		            .catch(function(error) {
		                console.log(error);
		            });
		        }else{
		        	showCooks(cookuid, name, gender);
		        	getFoods();
		        }
			});
        }
	});
});

// function showCooks(uid, name, gender, url){
// 	$("#cookWindow").append("<div class = row></div>");
// 	$("div:last").attr("id", uid);
// 	$("div[class=row]:last").append("<div class = column left thumbnail></div>");
// 	if (url){
// 		$("div[class=column]:last").append("<img src = " + url + " height = 80% width = 100px verticalAlign = middle/>");
// 	}else{
// 		$("div[class=column]:last").append("<img src = images/profile.jpg height = 80% width = 100px verticalAlign = middle/>");
// 	}
// 	$("div[class=row]:last").append("<div class = column right></div>");
// 	$("div[class=column]:last").append("Name: " + name + "<br/>");
// 	$("div[class=column]:last").append("Gender: " + gender + "<br/>");
// 	$("div[class=column]:last").append("Rating: " +"'NaN'" + "<br/>");
// 	$("div[class=column]:last").append("<button type='button' class='btn btn-info btnSendRequest' value = " + uid +"> Chatting" + "</button>");
//     //console.log(123);
//     //getFoods();
//     $(".btnSendRequest").click(function(){
//        var searchRef = firebase.database().ref("contacts_eater/" + eateruid);
//        searchRef.once("value", function(snapshot) {
//         if (snapshot.val() == null) {
//             createChattingRoom();
//         } else {
//             var data = snapshot.val();

//              if (data.hasOwnProperty(cookuid)) {
//                 cid = data[cookuid];
//                 gotoChattingRoom(cid);

//             } else {
//                 createChattingRoom();
//             }
//         }

//        }, function (errorObject) {
//           console.log("The read failed: " + errorObject.code);
//        });

//     })
// }

function showCooks(uid, name, gender, url) {
    $("#cookWindow").append(`<div class = row id = ${uid}>`);
    $("#cookWindow .row:last").append(`<div class='col-12 textLeft darkyellow'><h5>${name}</h5></div>`);
    $("#cookWindow .row:last").append(`<div class='col-5'></div>`);
    if(url){
        $("#cookWindow .col-5:last").append(`<img src =${url} height = 100% width = 130px verticalAlign = middle/>`);
    } else {
        $("#cookWindow .col-5:last").append("<img src = images/profile.jpg height = 100% width = 130px verticalAlign = middle/>");
    }
    $("#cookWindow .row:last").append(`<div class ='col-7 textLeft'></div>`);
    $("#cookWindow .col-7:last").append(`<div class = 'row'>Gender: ${gender}</div>`);
    $("#cookWindow .col-7:last").append("<div class = 'row' id=fixture></div>");
    //$("#cookWindow .col-7:last").append(`<div class = 'row'>rating: "NaN"</div>`);
    getStar();
    $("#cookWindow .col-7:last").append(`<div class = 'row'></div>`);
    $("#cookWindow .row:last").append(`<button type='button' class='btn btn-info btnSendRequest' value = ${uid}> Chatting </button>`);
    $(".btnSendRequest").click(function(){
       var searchRef = firebase.database().ref("contacts_eater/" + eateruid);
       searchRef.once("value", function(snapshot) {
        if (snapshot.val() == null) {
            createChattingRoom();
        } else {
            var data = snapshot.val();

             if (data.hasOwnProperty(cookuid)) {
                cid = data[cookuid];
                gotoChattingRoom(cid);

            } else {
                createChattingRoom();
            }
        }

       }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
       });

    })
}


function getFoods() {
	cookRef.once("value", function(newsnapshot){
		cookInfo = newsnapshot.val();
		did = Object.keys(cookInfo["availableDishes"]);
		console.log(did);
		for (i=0; i<did.length; i++){
			var dishRef = firebase.database().ref("dishes/"+did[i]);
			dishRef.once("value", function(snapshot){
		        var name, picture, flavor, price;
		        //snapshot.forEach(function(childSnapshot) {
		        //var childKey = childSnapshot.key;
		        var childData = snapshot.val();
		        console.log(childData);
		        name = childData["name"];
		        console.log(name);
		        flavor = childData["flavor"];
		        price  = childData["price"];
		        picture = childData["picture"];
		        description = childData["description"];
		        if (name && picture && flavor && price && description) {
		            //console.log(picture);
		            var picPath = firebase.storage().ref(picture);
		            //console.log(picPath);
		            picPath.getDownloadURL()
		            .then(function(url) {
		                showFoods(name, url, flavor, price, did[i]);
		            })
		            .catch(function(error) {
		                console.log(error);
		            });
		        }
		        //});
		      }, function (errorObject) {
		        console.log("The read failed: " + errorObject.code);
		    });
		}
	});
}

// function showFoods(name, pictureURL, flavor, price, did){
//     $("#foodWindow").append("<div class = row>");
//     $("div:last").attr("id", did+"Dish");
//     $("div[class=row]:last").append("<div class = column left thumbnail></div>");
//     $("div[class=column]:last").append("<img src = " + pictureURL +" id = " + did + " height = 100% width = 140px verticalAlign = middle/>");
//     $("div[class=row]:last").append("<div class = column right></div>");
//     $("div[class=column]:last").append("Name: " + name + "<br/>");
//     $("div[class=column]:last").append("Price: " + price + "<br/>");
//     $("div[class=column]:last").append("Flavor: " + flavor + "<br/>");
// }

function showFoods(name, pictureURL, flavor, price, did) {

    $("#foodWindow").append(`<div class= "row rowShowDish" id=${did}Dish></div>`);
    $("#foodWindow .row:last").append(`<div class=col-5><img src=${pictureURL} id=${did} height=100% width=130px/></div>`);
    $("#foodWindow .row:last").append(`<div class='col-7 textLeft yellow'></div>`);
    $("#foodWindow .col-7:last").append(`<div class = 'row darkyellow'> <h5> ${name} </h5> </div>`);
    $("#foodWindow .col-7:last").append(`<div class = 'row'> Price: ${price} <br/> Flavor: ${flavor} <br/> </div>`);

}

function createChattingRoom() {
    cid = firebase.database().ref("messages").push().key;
    console.log(cid);
    var mid = firebase.database().ref("messages/" + cid).push().key;
    console.log(mid);

    var postData = {
        to: cookuid,
        from: eateruid,
        message: "Hello, may I talk with you?",
        timestamp:""
    }

    const p1 = firebase.database().ref("messages/" + cid + "/" + mid).set(postData);
    const p2 = firebase.database().ref("contacts_eater/" + eateruid + "/" + cookuid).set(cid);
    const p3 = firebase.database().ref("contacts_cook/" + cookuid + "/" + eateruid).set(cid);
    var array = [];
    array.push(p1);
    array.push(p2);
    array.push(p3);
    return Promise.all(array).then(result =>{
        gotoChattingRoom();
    });

}

function gotoChattingRoom() {
    window.location.href = "chattingRoom.html? user=" + eateruid + "=" + cookuid + "=" + cid;
}
function getStar () {
	var star;
    starRef = firebase.database().ref("users/"+uid+"/ratingCook");
    starRef.once("value", function(snapshot){
    	if (snapshot.val() == null){
    		$("<span class='stars-container'>")
	      	.addClass("stars-" + 0)
	      	.text("Rating: No Rating Yet")
	      	.appendTo($("#fixture"));
    	}else{
    		star = snapshot.val();
    		star = Math.round(star);
    		var starstring="";
	    	for (i=0;i<star;i++){
	    		starstring = starstring+"★";
	    	}
		    $("<span class='stars-container'>")
		      .addClass("stars-" + starstring.toString())
		      .text("Rating: " + starstring)
		      .appendTo($("#fixture"));
    	}
    });
}