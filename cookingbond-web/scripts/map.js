
function initMap(){
   // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
    urlSecPart = location.search;
    uid = urlSecPart.split("=")[1];

    $("body input[name = address]").val("");
    var map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 33.7490, lng: -84.3880},
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var geocoder = new google.maps.Geocoder;
    var marker = new google.maps.Marker;

    $("input[type=radio]").change(function(){
       if ($(this).val() == "cur") {
        $("body input[name = address]").val("");
        $("body input[name = address]")[0].disabled = true;
       }
       if ($(this).val() == "customize") {
        $("body input[name = address]")[0].disabled = false;
       }
    });

     $("#btnBack").click(function(){
      window.location.href = "cookShowFood.html?user="+uid;
    });

    $("#btnSubmitLoc").click(function(){
      var type = $("body input[type = radio]:checked").val();
      var address = $("body input[name = address]").val();
      if (type == "cur") {
        geolocation(map, marker);
      }
      if (type == "customize") {
        geocodeAddress(geocoder, map, address, marker);
      }
    });

  }

// function to change geolocation to lat & lng with marker
function geocodeAddress(geocoder, map, address, marker) {
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        loc = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};

        firebase.database().ref("cooks/" + uid + "/location").set(loc);
        console.log(loc);
        map.setCenter(loc);

        marker.setMap(null);
        marker.setMap(map);
        marker.setPosition(loc);
        alert("Your location has been updated!");
        }else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

function geolocation(map, marker) {
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          firebase.database().ref("cooks/" + uid + "/location").set(pos);

          map.setCenter(pos);

          marker.setMap(null);
          marker.setMap(map);
          marker.setPosition(pos);
          alert("Your location has been updated!");

        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function getOtherLocation() {
  //console.log("getOtherLocation");
  var latitude, longitude;
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBsdQxZFy7iPQ8afOzzYXR3w7u3Ly75TKA",
    type: "GET",
    success: function(data) {
      $.each(data['results'][0]["geometry"]["location"], function(key, value) {
         if (key == "lat") latitude = value;
         if (key == "lng") longitude = value;
         if (latitude && longitude) {
          var pos = {
            lat : latitude,
            lng : longitude
          };
          map = new google.maps.Map(document.getElementById('map'), {
              zoom: 9,
              center: pos
          });
          var marker = new google.maps.Marker({
            position: pos,
            map: map
          });
          console.log(marker);
         }
      })
    }

  })
}