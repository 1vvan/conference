import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqJGdAM0Ni4iZ5QMEUiALnQO-se4gznrk",
  authDomain: "conferense-registration.firebaseapp.com",
  databaseURL: "https://conferense-registration-default-rtdb.firebaseio.com",
  projectId: "conferense-registration",
  storageBucket: "conferense-registration.appspot.com",
  messagingSenderId: "9081970886",
  appId: "1:9081970886:web:6843eef48117f2874537c7"
};

    firebase.initializeApp(firebaseConfig);
    
export const collectionRef = firebase.firestore().collection("members");

export const getDataFromFirestore = async () => {
    try {
        const querySnapshot = await collectionRef.get();
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

