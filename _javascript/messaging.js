
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function askPermission() {
    return new Promise(function(resolve, reject) {
      const permissionResult = Notification.requestPermission(function(result) {
        resolve(result);
      });
  
      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
    .then(function(permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    });
}
function subscribeUserToPush() {
  return new Promise(function (resolve, reject) { 
   navigator.serviceWorker.getRegistration('/')
    .then((registration) => { 
     const subscribeOptions = {
       userVisibleOnly: true,
       applicationServerKey: urlBase64ToUint8Array(
         'BMYgIYpw8jtC_61DQFh9k0rJP-5XUrWIwsUAOOnJmJQOfdS94jSlk0C2q86F1ebI2Yln5yz6v-cTJ2h10GM-vd4'
       )
     };
      registration.pushManager.subscribe(subscribeOptions)
        .then((pushSubscription) => { resolve(pushSubscription) })
        .catch((e) => { reject(e)}) 
      })
  })
    
   
}
function registerTokenOnServer(subscription) {
  return fetch('/api/save-subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
}
export { askPermission, subscribeUserToPush, registerTokenOnServer}