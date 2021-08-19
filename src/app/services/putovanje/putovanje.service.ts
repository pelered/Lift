import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList,AngularFireAction ,AngularFireObject,QueryFn } from '@angular/fire/database';
import {  Voznja } from 'src/app/models/voznja/voznja';
@Injectable({
  providedIn: 'root'
})
export class PutovanjeService {
  private dbPathLift = '/Putovanja';

  putoRef: AngularFireList<Voznja>;
  constructor(private db: AngularFireDatabase) { 
    this.putoRef = db.list(this.dbPathLift);
    

  }
  getAllTravels(): AngularFireList<Voznja> {
    
    
    return this.putoRef;
  }

  create(travel: Voznja): any {
    return this.putoRef.push(travel);
  }

  update(key: string, value: any): Promise<void> {
    return this.putoRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.putoRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.putoRef.remove();
  }
}
