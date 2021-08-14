import { Injectable } from '@angular/core';
import { Zgrada } from 'src/app/models/zgrada/zgrada.model';
import { AngularFireDatabase, AngularFireList,AngularFireAction ,AngularFireObject,QueryFn } from '@angular/fire/database';
import { User } from 'src/app/models/user';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class ZgradaService {
  private dbPathZg = '/Projekti/Zgrade';
  private dbPathPodZg = '/Projekti/Podzgrade';

  zgradaRef: AngularFireList<Zgrada>;
  podzgradaRef: AngularFireList<Zgrada>;

  //user !:User;


  constructor(private db: AngularFireDatabase) { 
    this.zgradaRef = db.list(this.dbPathZg);
    this.podzgradaRef=db.list(this.dbPathPodZg);
    

  }
  getAllZgrade(): AngularFireList<Zgrada> {
    //todo samo odredene zgrade na temelju u_uid usera
    //this.user=JSON.parse(localStorage.getItem("user")!);
    /*const size$ = new Subject<string>();
    const queryObservable = size$.pipe(
      switchMap(size => 
        this.db.list('/Projekti/Zgrade', ref => ref.orderByChild('ime')).valueChanges()
      )
    );
    console.log("Ispisget0: ",queryObservable);
    queryObservable.subscribe(queriedItems => {
      console.log("Ispisget: ",queriedItems);  
    });*/
    /*var playersRef = firebase.database().ref("Putovanja/");

    playersRef.orderByChild("n_k").on("value", function(data) {
       console.log(data);
    });
    console.log("Ispisget: ",playersRef);  */
    
    return this.zgradaRef;
  }
  getAllPodZg(): AngularFireList<Zgrada>{
    return this.podzgradaRef;

  }
  create(zgrada: Zgrada): any {
    return this.zgradaRef.push(zgrada);
  }

  update(key: string, value: any): Promise<void> {
    return this.zgradaRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.zgradaRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.zgradaRef.remove();
  }
}
