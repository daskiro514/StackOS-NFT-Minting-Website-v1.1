// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC6jEv8lNw2VAP6HsJwuU67850JBS_2eU8",
//   authDomain: "stackos-nft.firebaseapp.com",
//   projectId: "stackos-nft",
//   storageBucket: "stackos-nft.appspot.com",
//   messagingSenderId: "24765306053",
//   appId: "1:24765306053:web:b4cbb986ed40b2a3eb8cac",
//   measurementId: "G-JJ2QB64GW9"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export default db


import firebase from "firebase";
  
const firebaseConfig = {
  apiKey: "AIzaSyC6jEv8lNw2VAP6HsJwuU67850JBS_2eU8",
  authDomain: "stackos-nft.firebaseapp.com",
  projectId: "stackos-nft",
  storageBucket: "stackos-nft.appspot.com",
  messagingSenderId: "24765306053",
  appId: "1:24765306053:web:b4cbb986ed40b2a3eb8cac",
  measurementId: "G-JJ2QB64GW9"
};
  
// const firebaseConfig = {
//   apiKey: "AIzaSyB87EertOdJqYac8UCI8zKQBtQQJ5pajCQ",
//   authDomain: "dfdefafeawf.firebaseapp.com",
//   projectId: "dfdefafeawf",
//   storageBucket: "dfdefafeawf.appspot.com",
//   messagingSenderId: "779331298230",
//   appId: "1:779331298230:web:36b2883f2ecef460c01717",
//   measurementId: "G-0P3X2VY17D"
// }

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
  
export default db;