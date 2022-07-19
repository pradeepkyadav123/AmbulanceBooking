import Firebase from 'firebase';  

// var config = {
//     apiKey: "**********************",
//     authDomain: "**********************",
//     databaseURL: "**********************",
//     projectId: "**********************",
//     storageBucket: "**********************",
//     messagingSenderId: "**********************",
//     appId: "**********************"
//   };
  var config = {
    apiKey: "AIzaSyCitxHrEk8-f53f5Pg0gGiONXIFmsMcUJs",
    // apiKey: "AIzaSyCitxHrEk8-f53f5Pg0gGiONXIFmsMcUJs",
    authDomain: "ambulance-66c4b.firebaseapp.com",
    // authDomain: "ambulance-3a529.firebaseapp.com",
    databaseURL: "https://ambulance-66c4b-default-rtdb.firebaseio.com/",
    // databaseURL: "https://ambulance-3a529-default-rtdb.firebaseio.com",
    projectId: "ambulance-66c4b",
    // projectId: "ambulance-3a529",
    storageBucket: "ambulance-66c4b.appspot.com",
    // storageBucket: "ambulance-3a529.appspot.com",
    messagingSenderId: "1069938079627",
    // messagingSenderId: "267187590852",
    appId: "1:1069938079627:android:a84b3c9b338099571ca18e",
    // appId: "1:267187590852:web:c37f265c1ab1326e349b91",
  };

let app = Firebase.initializeApp(config);  
export const fb = app.database(); 