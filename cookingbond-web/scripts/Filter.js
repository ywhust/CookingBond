var $Name = $('#Name'),
	$Age = $('#Age'),
	$Distance = $('#Distance'),
	$Gender = $('#Gender'),
	$Flavor = $('#Flavor'),
	$Price = $('#Price'),
	$result = $('#result');
var myLocation = {};

$(function(){
    getCurrentLocation();
    urlSecPart = location.search;
    myuid = urlSecPart.split("=")[1];
    $("#btnMap").click(function(){
        window.location.href = "map.html?user=" + myuid;
    });
});

function onChange(){
	$('#result').html("");
	getPos();
}
// Get position of available cooks
function getPos(){
	var pos_result = [];
	var cooks = firebase.database().ref("cooks");
    cooks.once("value", function(snapshot) {
    	if (snapshot.val() == null) {
        	console.log("No available cooks now!");
        }else{
           	snapshot.forEach(function(childSnapshot) {
                var uid = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData["availableStatus"]) {
                	var uidFind = uid;
                	var locationFind = childData["location"];
                	findCooks(uidFind,locationFind);
                	//console.log(result);
                	//return showCooks(result);
                }
        	});

        }
    },function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function findCooks(uid, location){
	$age_result = $('#Age').find('option:selected').val();
	$gender_result = $('#Gender').find('option:selected').val();
	$flavor_result = $('#Flavor').find('option:selected').val();
	$transportation_result  = $('#Transportation').find('option:selected').val();
	$distance_result = $('#Distance').find('option:selected').val();
	$price_result = $('#Price').find('option:selected').val();
	//console.log($gender_result);
	return filter($age_result,$gender_result,$flavor_result,$distance_result,$price_result, location, uid);
}
// function to change real price to $.
function priceChange(price){
	if(price <=8){
		return "$";
	}else if (price >8 && price <=16){
		return "$$";
	}else{
		return "$$$";
	}
}

function getCurrentLocation(){
    urlSecPart = location.search;
    eateruid = urlSecPart.split("=")[1];
    prepareNav(eateruid);
	var LatLng_eater;
	if (navigator.geolocation){
	  	navigator.geolocation.getCurrentPosition(function(position) {
	        LatLng_eater = {
	        	lat: position.coords.latitude,
	        	lng: position.coords.longitude
	    	};
	    	myLocation["lat"] = LatLng_eater["lat"];
	    	myLocation["lng"] = LatLng_eater["lng"];
	    	//console.log(myLocation);
	    });
	}
}
//input latlng of cook, calculate distance between cook and eater
function calculateDistance(LatLng_cook,myLocation){
	var LatLng_eater = new google.maps.LatLng(myLocation);
	var LatLng_cook = new google.maps.LatLng(LatLng_cook);
	//console.log(typeof LatLng_cook);
	//console.log(LatLng_cook);
    if(LatLng_cook && LatLng_eater)	{
    	var distance = google.maps.geometry.spherical.computeDistanceBetween(LatLng_cook,LatLng_eater);
    	//console.log(distance);
    	return distance;
    }
}

// fiter function
function filter(Age, Gender, Flavor, Distance, Price, location, uid){
	var filter_result={};
	var cookRef = firebase.database().ref("users/"+uid);
	var dishRef = firebase.database().ref("cooks/"+uid+"/availableDishes/");
	//console.log(Age);
	cookRef.once("value", function(snapshot) {
		var cookuid = snapshot.key;
		//console.log(key);
		var data = snapshot.val();
		//console.log(data["age"]);
		if (">".indexOf(Age) > -1){
			//console.log(data["age"]);
			var age_filter = (data["age"] > Age.split(">")[0]);
		}else{
			var age_filter = (data["age"] >= Age.split("-")[0]) && (data["age"] <= Age.split("-")[1]);
			//console.log(age_filter);
		}
		//calculate distance and change it into mile.
		var dis = calculateDistance(location,myLocation)/ 1609.34;
		//console.log(Distance.split("-")[0]);
		if (">".indexOf(Distance) > -1){
			var distance_filter = (dis > Distance.split(">")[0]);
		} else{
			//console.log(123);
			var distance_filter = (dis >= Distance.split("-")[0]) && (dis <= Distance.split("-")[1]);
			//console.log(distance_filter);
		}
		dishRef.once("value", function(newsnapshot){
			if (newsnapshot.val() == null) {
         		console.log("No available dishes now!");
         	}else{
         		//var did = newsnapshot.key;
         		//console.log(did);
         		var dishes = newsnapshot.val();
         		var did = Object.keys(dishes);
         		var dishPriceRef = firebase.database().ref("dishes/"+did[0]+"/price");
         		//console.log(did[1]);
         		dishPriceRef.once("value", function(dishsnapshot){
         			if (dishsnapshot.val() == null){
         				console.log("No dishes price available now!");
         			}else{
         				var dishPrice = dishsnapshot.val();
         				var price = priceChange(dishPrice);
         				var cookFoundRef = firebase.database().ref("cooks/"+uid);
         				cookFoundRef.once("value", function(cooksnapshot){
         					if(cooksnapshot.val() == null){
         						console.log("No available cooks now!");
         					}else{
         						var flavor = cooksnapshot.val()["label"];
         						var flavor_filter = (flavor.includes(Flavor));
         						//console.log(flavor);
         						//console.log(flavor_filter);
								if((!Age || age_filter) && (!Gender || data["gender"] === Gender) && (!Distance|| distance_filter)
									&& (!Price|| price === Price) && (!Flavor || flavor_filter) ){
									filter_result[cookuid] = data["name"];
								}
								return showCooks(filter_result);
         					}
         				});

         			}
         		});

         	}
		});
	});
}

function photoURL(uid,cook){
	//console.log(uid);
	var dataRef = firebase.database().ref("users/" + uid);
	dataRef.once("value", function(snapshot){
		var data = snapshot.val();
		var uid = snapshot.key;
    	if (data.hasOwnProperty("photo")) {
            var phoPath = firebase.storage().ref(data["photo"]);
            phoPath.getDownloadURL()
            .then(function(url) {
                myURL = url;
                appendResult(uid, cook, myURL);
            })
            .catch(function(error) {
                console.log(error);
            });
        }else{
        	//console.log(uid);
        	appendResult(uid, cook);
        }
	});
}

function showCooks(filter_result){
	var cooks = Object.values(filter_result);
	var uids = Object.keys(filter_result);
	for(i=0; i<cooks.length; i++){
		//console.log(uids[i]);
		photoURL(uids[i],cooks[i]);
	}
}

// function appendResult(uid,cook,url){
// 	console.log(uid);
// 	console.log(cook);
// 	$result.append("<div class = row>");
// 	$("div:last").attr("id", uid);
// 	$("div[class=row]:last").append("<div class = column left thumbnail></div>");
// 	if (url){
// 		$("div[class=column]:last").append("<img src = " + url + " height = 100% width = 140px verticalAlign = middle/>");
// 	}else{
// 		$("div[class=column]:last").append("<img src = images/profile.jpg height = 80% width = 100px verticalAlign = middle/>");
// 	}
// 	$("div[class=row]:last").append("<div class = column right></div>");
// 	$("div[class=column]:last").append("Name: " + cook + "<br/>");
// 	$("div[class=column]:last").append("<button type='button' class='btn btn-info btnMoreInfo' value = " + uid +"> More Informatin" + "</button>");
// 	$(".btnMoreInfo").click(function(){
// 		cookuid = $(this).val();
// 		//console.log(cookuid);
//         window.location.href = "cookProfile.html?user=" + myuid + "=" + cookuid;
//     });
// }

function appendResult(uid, cook, url) {
    $result.append(`<div class = "row rowShowCook" id = ${uid}></div>`);
    $(".row:last").append(`<div class='col-5'></div>`);
    if (url) {
        $(".col-5:last").append(`<img src = ${url} height = 100% width = 130px/>`);
    } else {
        $(".col-5:last").append(`<img src = images/profile.jpg height = 100px width = 130px/>`);
    }
    $(".row:last").append(`<div class = 'col-7 textLeft yellow'></div>`);
    $(".col-7:last").append(`<div class = 'row darkyellow'><h5>${cook}</h5></div><br/>`);
    $(".col-7:last").append(`<button type='button' class='btn btn-info btnMoreInfo' value = ${uid} center> More Information </button>`);
    $(".btnMoreInfo").click(function(){
        cookuid = $(this).val();
        //console.log(cookuid);
        window.location.href = "cookProfile.html?user=" + myuid + "=" + cookuid;
    });

}
