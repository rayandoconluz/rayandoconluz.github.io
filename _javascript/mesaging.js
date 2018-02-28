import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDLI9S-a0KApieolts6Jm2DAbjfLDZ_vxc",
    authDomain: "rutasdelosandes-174002.firebaseapp.com",
    databaseURL: "https://rutasdelosandes-174002.firebaseio.com",
    projectId: "rutasdelosandes-174002",
    storageBucket: "rutasdelosandes-174002.appspot.com",
    messagingSenderId: "35815877403"
};

firebase.initializeApp(config);

function sendTokenToServer(currentToken) { 
    return fetch('/subscribe', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token:currentToken})
      }).then(res => console.log(res));
}



function requestPermission(){
    let messaging = firebase.messaging();
    let swRegistration = navigator.serviceWorker.getRegistration('/')
        .then((registration) => messaging.useServiceWorker(registration))
    return swRegistration.then(()=>messaging.requestPermission())
    .then(()=>messaging.getToken())
    .then((currentToken)=>{
        if (currentToken) {
            sendTokenToServer(currentToken).then(()=> window.localStorage.setItem('token', currentToken))
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
        }
    })
    .catch(function(err) {
    console.log('Unable to get permission to notify.', err);
    });

}

export default requestPermission
