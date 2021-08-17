import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList,AngularFireAction ,AngularFireObject,QueryFn } from '@angular/fire/database';
import {Lift} from 'src/app/models/lift.model';

@Injectable({
  providedIn: 'root'
})
export class LiftService {
  private dbPathLift = '/Liftovi';

  liftRef: AngularFireList<Lift>;
  constructor(private db: AngularFireDatabase) { 
    this.liftRef = db.list(this.dbPathLift);
    

  }
  getAllLift(): AngularFireList<Lift> {
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
    
    return this.liftRef;
  }

  create(lift: Lift): any {
    return this.liftRef.push(lift);
  }

  update(key: string, value: any): Promise<void> {
    return this.liftRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.liftRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.liftRef.remove();
  }
}
