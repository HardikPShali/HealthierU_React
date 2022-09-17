

importScripts("https://www.gstatic.com/firebasejs/9.8.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.8.3/firebase-messaging-compat.js");

firebase.initializeApp({
  // messagingSenderId: "497531508979"
  apiKey: "AIzaSyAqFn4kqi4cPxYOBwDT5CqRMiPPCqV60u8",
  authDomain: "healthyu-app.firebaseapp.com",
  databaseURL: "https://healthyu-app.firebaseio.com",
  projectId: "healthyu-app",
  storageBucket: "healthyu-app.appspot.com",
  messagingSenderId: "497531508979",
  appId: "1:497531508979:web:0364ed9baeb95a54173f86",
  measurementId: "G-9TC3WY9D1B"
})
const messaging = firebase.messaging();
// firebase.messaging();

// messaging.setBackgroundMessageHandler(function (payload) {
//   const promiseChain = clients
//     .matchAll({
//       type: "window",
//       includeUncontrolled: true
//     })
//     .then(windowClients => {
//       for (let i = 0; i < windowClients.length; i++) {
//         const windowClient = windowClients[i];
//         windowClient.postMessage(payload);
//       }
//     })
//     .then(() => {
//       return registration.showNotification("my notification title");
//     });
//   return promiseChain;
// });

// messaging.setBackgroundMessageHandler((payload) => {
//   console.log("[firebase-messaging-sw.js] Received background message ", payload);
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png"
//   };

//   // postMessage(payload);

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.title,
    data: payload.data,
  }


  self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
    //you can see your main window client in this list.
    clients.forEach((client) => {
      client.postMessage(payload);
    })
  })
  // console.log(payload.data, notificationOptions, "options")

  return self.registration.showNotification(notificationTitle, payload);
})