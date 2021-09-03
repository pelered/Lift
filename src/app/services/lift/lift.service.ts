import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList,AngularFireAction ,AngularFireObject,QueryFn } from '@angular/fire/database';
import { Lift } from 'src/app/models/lift/lift';

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
