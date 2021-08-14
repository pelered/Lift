import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-ispis-zgrada',
  templateUrl: './ispis-zgrada.component.html',
  styleUrls: ['./ispis-zgrada.component.css']
})
export class IspisZgradaComponent implements OnInit {

  selectedValue: string | undefined;

  zgrade?:Zgrada[];
  currentZgrada?:Zgrada;
  currentIndex = -1;
  title = '';
  dataSource!: MatTableDataSource<Zgrada>;
  paginator!: MatPaginator;
  @ViewChild(MatPaginator)
  ZgradaData: any = [];
  LiftData: any = [];
  PodZgrada: any=[];
  userData!:  User;
  SpecificPodZg :any=[];
  //

  //items: Observable<any[]>;

  //

  displayedColumns: any[] = [
    'key',
    'ime' ,
    'podzgrade',
    'action'
  ];

  
  constructor(private zgrada_service: ZgradaService) { 
    
  }


  ngOnInit(): void {
    this.retrieveZgrade();
    
  }
  refreshList(): void {
    this.currentZgrada = undefined;
    this.currentIndex = -1;
    this.retrieveZgrade();
  }

  retrieveZgrade(): void {
    
    //console.log("Ispis0:",this.zgrada_service.getAll().query.orderByKey.);
    this.userData=JSON.parse(localStorage.getItem("user")!);
    this.zgrada_service.getAllPodZg().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()
            
          })
          
        )
      )
    ).subscribe(data=>{
      
      data.forEach(items => {
        //todo izmjeniti da je query a ne da ih sve dohvati
        if(items.u_uid==this.userData.uid){    
          //console.log("Ispispodzgrada0:",this.PodZgrada);    
          this.PodZgrada.push(items as Zgrada)
        }
      })

    });
    console.log("Ispispodzgrada:",this.PodZgrada);

    this.zgrada_service.getAllZgrade().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()
            
          })
          
        )
      )
    ).subscribe(data => {
      console.log("Ispis0.25:",data);
      data.forEach(item => {
        //todo izmjeniti da je query a ne da ih sve dohvati
        if(item.u_uid==this.userData.uid){        
          this.LiftData.push(item as Zgrada)
        }
      })
      
      console.log("Ispis1:",this.LiftData);
      this.zgrade = data;

     
        this.dataSource = new MatTableDataSource(this.LiftData);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    });
  }

  setActiveZgrada(zgrada: Zgrada, index: number): void {
    this.currentZgrada = zgrada;
    this.currentIndex = index;
  }
  getSpecificPodZg(zg_idd:String){
    //const Pod= this.PodZgrada;
    //console.log("Specific0:",zg_idd);

    this.SpecificPodZg=[];
    this.PodZgrada.forEach((element: any) => {
      if(element.zg_id==zg_idd){
      this.SpecificPodZg.push(element);
      }

    });
    console.log("Specific00:",this.SpecificPodZg);
    return this.SpecificPodZg;
  }

  removeZgrada():void{

  }
  removeAllZgrade(): void {
    this.zgrada_service.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }

}
