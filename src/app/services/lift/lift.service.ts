import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList,AngularFireAction ,AngularFireObject,QueryFn } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lift } from 'src/app/models/lift/lift';
import firebase from 'firebase';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiftService {
  private dbPathLift = '/Liftovi';

  liftRef: AngularFireList<Lift>;
  items$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  size$: BehaviorSubject<string|null>;

  liftovi$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  sizeLift$: BehaviorSubject<string|null>;
  sizeLiftPod$: BehaviorSubject<string | null>;
  liftoviPod$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  constructor(private db: AngularFireDatabase) { 
    this.liftRef = db.list(this.dbPathLift);
    this.size$ = new BehaviorSubject<string|null>(null);
    this.items$ = this.size$.pipe(switchMap((id_lift) => 
         db.list(this.dbPathLift, ref => 
         id_lift ? ref.orderByKey().equalTo(id_lift):ref
         ).snapshotChanges()));

    this.sizeLift$ = new BehaviorSubject<string|null>(null);
    this.liftovi$ = this.size$.pipe(switchMap((id_zg) => 
         db.list(this.dbPathLift, ref => 
         id_zg ? ref.orderByChild("zgrada").equalTo(id_zg):ref
         ).snapshotChanges()));

    this.sizeLiftPod$ = new BehaviorSubject<string|null>(null);
    this.liftoviPod$ = this.size$.pipe(switchMap((id_pod) => 
         db.list(this.dbPathLift, ref => 
         id_pod ? ref.orderByChild("pod_zg").equalTo(id_pod):ref
         ).snapshotChanges()));

  }
  getLiftQuery(key:string){
    console.log("Ispis5Lift",key);
    this.size$.next(key);    
    return this.items$;
  }
  getLiftZg(key:string){
    console.log("Ispis5Lift",key);
    this.sizeLift$.next(key);    
    return this.liftovi$;
  }
  getLiftPod(key:string){
    console.log("Ispis5Lift",key);
    this.sizeLiftPod$.next(key);    
    return this.liftoviPod$;
  }
  getAllLift(): AngularFireList<Lift> {

    return this.liftRef;
  }

  create(lift: Lift): any {
    return this.liftRef.push(lift);
  }

  update(key: string, value: any): Promise<void> {
    return this.liftRef.update(key, {ime:value});
  }

  delete(key: string): Promise<void> {
    return this.liftRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.liftRef.remove();
  }
}
