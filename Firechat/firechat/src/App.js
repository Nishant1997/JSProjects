import logo from './logo.svg';
import './App.css';
import {useRef, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //config
  apiKey: "AIzaSyDRPuPfxzQDz9bmjInCBvuXEEaZQta9mKE",
  authDomain: "firechat-3d84c.firebaseapp.com",
  projectId: "firechat-3d84c",
  storageBucket: "firechat-3d84c.appspot.com",
  messagingSenderId: "377611536435",
  appId: "1:377611536435:web:f660f53a60491d7467bb46",
  measurementId: "G-RBVCHD5564"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        { user ? <Chatroom /> : <SignIn /> }
      </header>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google </button>
  )
}

function SignOut() {
  return (<button onClick={ () => auth.signOut() } >Sign out</button>)
}

function Chatroom() {

  const dummy = useRef();

  const msgref = firestore.collection('messages');
  const query = msgref.orderBy('createdAt').limit(25);
  const [msgCollections] = useCollectionData(query,{idField  : 'id'});
  const [formValue, setFormValue] = useState(' ');


  const sendMessage = async(e) => {
    e.preventDefault(); // stop page from refreshing
    const { uid, photoURL } = auth.currentUser;
   
    await msgref.add({
       text: formValue,
       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
       uid, 
       photoURL 
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behaviour: 'smooth' });  
  }

console.log(msgCollections);

  return (
<>
    <SignOut />
    <main>
        { msgCollections && msgCollections.map(msg => <Chatmessage key={msg.id} message={msg} /> ) }
    </main>
    <div ref={dummy}>

    </div>
    <form onSubmit = {sendMessage} >
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit">(*)</button>
    </form>
    <div>
    </div>
  </>
  )

}

function Chatmessage (prop){
  const { text, uid, photoURL } = prop.message;
  console.log(prop.message.photoURL);
  const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';
  return (
     <div className = {`message ${messageClass}`} >
       <img src={photoURL}></img>
       <p>{text}</p>
     </div>
    )
}

export default App;
