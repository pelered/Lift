import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { map } from 'rxjs/operators';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { Zgrada } from 'src/app/models/zgrada/zgrada.model';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable , Subscription,} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireAction } from '@angular/fire/database';
import { DataSnapshot } from '@angular/fire/database/interfaces';

@Component({
  selector: 'app-ispis-liftova',
  templateUrl: './ispis-liftova.component.html',
  styleUrls: ['./ispis-liftova.component.css']
})
export class IspisLiftovaComponent implements OnInit {

  selectedValue: string | undefined;

  zgrade?:Zgrada[];
  currentZgrada?:Zgrada;
  currentIndex = -1;
  title = '';
  dataSource!: MatTableDataSource<Zgrada>;
  paginator!: MatPaginator;
  ZgradaData: any = [];
  LiftData: any = [];
  PodZgrada: any=[];
  userData!:  User;
  SpecificPodZg :any=[];
  //

  //items: Observable<any[]>;
  items$: Observable<AngularFireAction<DataSnapshot>[]>;
  ime$: BehaviorSubject<string|null>;
  //

 

  
  constructor(private zgrada_service: ZgradaService,private db: AngularFireDatabase) { 
    this.ime$ = new BehaviorSubject<string| null>(null);
    this.items$ = this.ime$.pipe(
      switchMap(ime_od => 
        db.list('/Projekti/Zgrade', ref =>
          ime_od ? ref.orderByChild('ime').equalTo(ime_od) : ref
        ).snapshotChanges()
      )
    );
  }


  ngOnInit(): void {
    
  }
    filterBy(size: string|null) {
    this.ime$.next(size); 
    this.items$.forEach(itemm => {
      //todo izmjeniti da je query a ne da ih sve dohvati
      itemm.forEach(
        it=>{
          console.log("Filter",it.payload.val());

        }
      )

    })
  }

  /*constructor(    private actRoute: ActivatedRoute) {
    var id = this.actRoute.snapshot.paramMap.get('id');
    console.log("id_pod",id);
   }

  ngOnInit(): void {
  }*/

}
