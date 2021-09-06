import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList,AngularFireAction ,AngularFireObject,QueryFn } from '@angular/fire/database';
import { LiftState } from 'src/app/models/lift/lift-state';
import {  Voznja } from 'src/app/models/voznja/voznja';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase';
import { LiftMjeri } from 'src/app/models/lift/lift-mjeri';
@Injectable({
  providedIn: 'root'
})
export class PutovanjeService {
  private dbPathLift = '/Putovanja';
  private dbPathLiftState='/Stanje';
  private dbPathLiftMjeri='/Mjeri';


  putoRef: AngularFireList<Voznja>;
  stateRef: AngularFireList<LiftState>;
  mjeriRef:AngularFireList<LiftMjeri>
  //
  items$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  size$: BehaviorSubject<string|null>;

  itemsmjeri$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  sizemjeri$: BehaviorSubject<string|null>;
  data:any=[];
  constructor(private db: AngularFireDatabase) { 
    this.putoRef = db.list(this.dbPathLift);
    this.stateRef=db.list(this.dbPathLiftState);
    this.mjeriRef=db.list(this.dbPathLiftMjeri);
    this.size$ = new BehaviorSubject<string|null>(null);
    this.items$ = this.size$.pipe(switchMap((id_lift) => 
         db.list(this.dbPathLift, ref => 
         id_lift ? ref.orderByChild('id_lift').equalTo(id_lift):ref
         ).snapshotChanges()));

  this.sizemjeri$ = new BehaviorSubject<string|null>(null);
  this.itemsmjeri$ = this.sizemjeri$.pipe(switchMap((id_li) => 
       db.list(this.dbPathLiftMjeri, ref => 
       id_li ? ref.orderByKey().equalTo(id_li):ref
       ).snapshotChanges()));
  }
  


  getStateLift(): AngularFireList<LiftState>{
    return this.stateRef;
  }
  getAllTravels(): AngularFireList<Voznja> {   
    
    return this.putoRef;
  }

  getListPutovanjaQuery(key:string){
    console.log("Ispis5",key);
    this.size$.next(key);  
  
    return this.items$;
  }
 
  create(travel: Voznja): any {
    return this.putoRef.push(travel);
  }

  update(key: string, value: any): Promise<void> {
    return this.putoRef.update(key, value);
  }
  updateMjeri(key: string, value: any): Promise<void> {
    return this.mjeriRef.update(key, value);
  }
  getMjeriQ(key:string){
    console.log("Ispis5",key);
    this.sizemjeri$.next(key);   
  
    return this.itemsmjeri$;
  }

  getMjeri(key:string){
    return this.dbPathLiftMjeri;
  }
  delete(key: string): Promise<void> {
    return this.putoRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.putoRef.remove();
  }
}
