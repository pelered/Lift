import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList,AngularFireAction ,AngularFireObject,QueryFn } from '@angular/fire/database';
import { Putovanje } from 'src/app/models/putovanje/putovanje';
@Injectable({
  providedIn: 'root'
})
export class PutovanjeService {
  private dbPathLift = '/Putovanja';

  putoRef: AngularFireList<Putovanje>;
  constructor(private db: AngularFireDatabase) { 
    this.putoRef = db.list(this.dbPathLift);
    

  }
  getAllTravels(): AngularFireList<Putovanje> {
    
    
    return this.putoRef;
  }

  create(travel: Putovanje): any {
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
