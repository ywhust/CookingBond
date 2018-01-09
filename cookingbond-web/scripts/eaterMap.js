function initMap(){
    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];

    //set init map
    var map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 33.7490, lng: -84.3880},
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    geocoder = new google.maps.Geocoder;
    marker = new google.maps.Marker;
    infoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds;

    $("#btnBack").click(function(){
      window.location.href = "FilterPage.html?user="+uid;
    });

    //get user current geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here');
            infoWindow.open(map);
            map.setCenter(pos);

           cooksRef = firebase.database().ref("cooks");
           cooksRef.once("value", function(snapshot) {
              if (snapshot.val() == null) {
                  console.log("No available cooks now!");
                }else{
                    snapshot.forEach(function(childSnapshot) {
                        var uid = childSnapshot.key;
                        var childData = childSnapshot.val();
                        if (childData["availableStatus"]) {

                          //get locations of available cooks
                          var uidFind = uid;
                          var locationFind = childData["location"];
                          marker = new google.maps.Marker({
                              position: new google.maps.LatLng(locationFind),
                              map: map
                          });

                        }
                  });

                }
            },function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });


        }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
// function to handle loctaion error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}