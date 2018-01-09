importScripts("https://www.gstatic.com/firebasejs/4.6.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.6.0/firebase-messaging.js");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBIDMqC6vofhu5kyBxBgllrvR9sQ2hmS3M",
    authDomain: "toycookingbond.firebaseapp.com",
    databaseURL: "https://toycookingbond.firebaseio.com",
    projectId: "toycookingbond",
    storageBucket: "toycookingbond.appspot.com",
    messagingSenderId: "409633326218"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    const title ="Hello World";
    const options = {
        body:payload.data.status
    };
    return self.registration.showNotification(title, options);
})