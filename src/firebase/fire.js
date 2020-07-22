import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCjAmL_cKemIJyCl9kX2h5V9DhN4pNDqfg",
  authDomain: "store-finder-3d9d1.firebaseapp.com",
  databaseURL: "https://store-finder-3d9d1.firebaseio.com",
  projectId: "store-finder-3d9d1",
  storageBucket: "store-finder-3d9d1.appspot.com",
  messagingSenderId: "279781132464",
  appId: "1:279781132464:web:821b3463562b863c30d375",
  measurementId: "G-V5BHYGMYGK"
};
const fire = firebase.initializeApp(firebaseConfig);
export default fire;
