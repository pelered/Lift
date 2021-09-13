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
  userData: any; 
  private dbPath = '/Users';
  liftsRef!: AngularFireList<User>;
  constructor( 
    public afs: AngularFirestore,   
    public afAuth: AngularFireAuth, 
    public router: Router,  
    public ngZone: NgZone, 
    private db: AngularFireDatabase
    )
    {

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

  SignIn(email:any, password:any) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result:any) => {
        this.ngZone.run(() => {
          this.router.navigate(['ispis-zgrada']);
        });
        this.SetUserData(result.user);
      }).catch((error:any) => {
        window.alert(error.message)
      })
  }

  SignUp(email:any, password:any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result:any) => {

        this.SendVerificationMail();
        this.SetUserData(result.user);
      }).catch((error:any) => {
        window.alert(error.message)
      })
  }



   SendVerificationMail() {
    return this.afAuth.currentUser.then(u => u!.sendEmailVerification())
    .then(() => {
      this.router.navigate(['verify-email']);
    })
  }
  ForgotPassword(passwordResetEmail:any) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error:any) => {
      window.alert(error)
    })
  }
  

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  AuthLogin(provider:any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result:any) => {
       this.ngZone.run(() => {
          this.router.navigate(['ispis-zgrada']);
        })
      this.SetUserData(result.user);
    }).catch((error:any) => {
      window.alert(error)
    })
  }

  
  SetUserData(user:any) {
    
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }


    return this.db.list(this.dbPath).set(userData.uid,userData);
  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {

      localStorage.removeItem('user');
      localStorage.clear;
      this.router.navigate(['sign-in']);
    })
  }
}
