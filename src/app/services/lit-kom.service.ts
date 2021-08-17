import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {Lift} from 'src/app/models/lift.model';
@Injectable({
  providedIn: 'root'
})
export class LitKomService {
  //zamijenit s ulogiranim korisnikom
  private dbPath = '/Liftovi';
  liftsRef: AngularFireList<Lift>;

  constructor(private db: AngularFireDatabase) { 
    this.liftsRef = db.list(this.dbPath);
  }
  getAll(): AngularFireList<Lift> {
    //dodaj samo odredeni 
    return this.liftsRef;
  }

  create(lift: Lift): any {
    return this.liftsRef.push(lift);
  }

  update(key: string, value: any): Promise<void> {
    return this.liftsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.liftsRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.liftsRef.remove();
  }
}
