import { Injectable, NgZone } from '@angular/core';
import { User } from "../models/user";
import '@firebase/auth';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  private dbPath = '/Users';
  liftsRef!: AngularFireList<User>;
  constructor( 
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone, // NgZone service to remove outside scope warning) { }
    private db: AngularFireDatabase
    )
    {
/* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', "null");
        JSON.parse(localStorage.getItem('user')!);
      }
    })
    this.liftsRef = db.list(this.dbPath);

  }

  // Sign in with email/password
  SignIn(email:any, password:any) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result:any) => {
        this.ngZone.run(() => {
          console.log("Ispis1",result);
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error:any) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email:any, password:any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result:any) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      }).catch((error:any) => {
        window.alert(error.message)
      })
  }



   // Email verification when new user register
   SendVerificationMail() {
    return this.afAuth.currentUser.then(u => u!.sendEmailVerification())
    .then(() => {
      this.router.navigate(['verify-email']);
    })
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail:any) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error:any) => {
      window.alert(error)
    })
  }
  

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    //console.log("Ispis2",(user !== null && user.emailVerified !== false) ? true : false);

    return (user !== null && user.emailVerified !== false) ? true : false;
  }
/*
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
*/
  // Auth logic to run auth providers
  AuthLogin(provider:any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result:any) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.SetUserData(result.user);
    }).catch((error:any) => {
      window.alert(error)
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  //todo: provjera da ako postoji vec ne sprema se
  SetUserData(user:any) {
    //const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    //this.db.list(this.dbPath).set(userData.uid,userData);
    //this.liftsRef.set("key",userData);
    //console.log("Logged1:",this.db.list(this.dbPath+'/'+user.uid).set("key",userData));


    return this.db.list(this.dbPath).set(userData.uid,userData);
  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      console.log("Ispis3",localStorage.getItem('user'));

      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    })
  }
}
