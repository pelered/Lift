import { Injectable } from '@angular/core';
import { Building } from 'src/app/models/zgrada/zgrada';
//import { Zgrada } from 'src/app/models/zgrada/zgrada.model';
import { AngularFireAction, AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ZgradaService {
  private dbPathZg = '/Projekti/Zgrade';
  private dbPathPodZg = '/Projekti/Podzgrade';

  zgradaRef: AngularFireList<Building>;
  podzgradaRef: AngularFireList<Building>;


  zgQ$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  sizeZg$: BehaviorSubject<string|null>;

  PodZgQ$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  sizePod$: BehaviorSubject<string|null>;


  zgradeQ$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  sizeZgrade$: BehaviorSubject<string|null>;

  PodZgradeQ$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  sizePodzgrade$: BehaviorSubject<string|null>;
  constructor(private db: AngularFireDatabase) { 
    this.zgradaRef = db.list(this.dbPathZg);
    this.podzgradaRef=db.list(this.dbPathPodZg);  
    this.sizeZg$ = new BehaviorSubject<string|null>(null);
    this.zgQ$ = this.sizeZg$.pipe(switchMap((zg_key) => 
         db.list(this.dbPathZg, ref => 
         zg_key ? ref.orderByKey().equalTo(zg_key):ref
         ).snapshotChanges()));
  
    this.sizePod$ = new BehaviorSubject<string|null>(null);
    this.PodZgQ$ = this.sizePod$.pipe(switchMap((pod_key) => 
          db.list(this.dbPathPodZg, ref => 
          pod_key ? ref.orderByKey().equalTo(pod_key):ref
          ).snapshotChanges()));
       

    this.sizeZgrade$ = new BehaviorSubject<string|null>(null);
    this.zgradeQ$ = this.sizeZgrade$.pipe(switchMap((user_key) => 
         db.list(this.dbPathZg, ref => 
         user_key ? ref.orderByChild("u_uid").equalTo(user_key):ref
         ).snapshotChanges()));
  
    this.sizePodzgrade$ = new BehaviorSubject<string|null>(null);
    this.PodZgradeQ$ = this.sizePodzgrade$.pipe(switchMap((user_k) => 
          db.list(this.dbPathPodZg, ref => 
          user_k ? ref.orderByChild("u_uid").equalTo(user_k):ref
          ).snapshotChanges()));
       
     
  }
  
  getZgQuery(key:string){
    this.sizeZg$.next(key);    
    return this.zgQ$;
  }
  getPodQuery(key:string){
    this.sizePod$.next(key);    
    return this.PodZgQ$;
  }
  getZgradeQuery(key:string){
    this.sizeZgrade$.next(key);    
    return this.zgradeQ$;
  }
  getPodzgradeQuery(key:string){
    this.sizePodzgrade$.next(key);    
    return this.PodZgradeQ$;
  }
  
  getAllZgrade(): AngularFireList<Building> {
  
    
 
    return this.zgradaRef;
  }
  getAllPodZg(): AngularFireList<Building>{
    return this.podzgradaRef;

  }
  create(zgrada: Building): any {
    return this.zgradaRef.push(zgrada);
  }
  updateZgLifts(key:string, value: String[]): Promise<void> {
    return this.zgradaRef.update(key, {lifts:value});
  }
  updatePodzgLifts(key: string, value: String[]): Promise<void> {
    return this.podzgradaRef.update(key, {lifts:value});
  }  
  updateZg(key:string, value: string): Promise<void> {
    return this.zgradaRef.update(key, {ime:value});
  }
  updateZgPod(key:string, value: String[]): Promise<void> {
    return this.zgradaRef.update(key, {podzg:value});
  }
  updatePodzg(key: string, value: any): Promise<void> {
    return this.podzgradaRef.update(key, {ime:value});
  }

  update(key:string,zgrada:any):Promise<void>{
    return this.zgradaRef.update(key,zgrada);
  }
  updateP(key:string,zgrada:any):Promise<void>{
    return this.podzgradaRef.update(key,zgrada);
  }
  deletePod(key: string): Promise<void> {
    return this.podzgradaRef.remove(key);
  }
  delete(key: string): Promise<void> {
    return this.zgradaRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.zgradaRef.remove();
  }
}
