import { Injectable } from '@angular/core';
import { Zgrada } from 'src/app/models/zgrada/zgrada';
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

  zgradaRef: AngularFireList<Zgrada>;
  podzgradaRef: AngularFireList<Zgrada>;



  constructor(private db: AngularFireDatabase) { 
    this.zgradaRef = db.list(this.dbPathZg);
    this.podzgradaRef=db.list(this.dbPathPodZg);

   
  

  }
  
    

  
  
  getAllZgrade(): AngularFireList<Zgrada> {
  
    
 
    return this.zgradaRef;
  }
  getAllPodZg(): AngularFireList<Zgrada>{
    return this.podzgradaRef;

  }
  create(zgrada: Zgrada): any {
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
