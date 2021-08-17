import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { Zgrada } from 'src/app/models/zgrada/zgrada.model';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';

import {FormControl, Validators} from '@angular/forms';
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
  value = 'Clear me';
  value2='Clear me';
  edit:boolean;
  is_edit :boolean[]=[];
  is_save :boolean[]=[];
  is_selected:string[]=[];
  zgradaFormControl = new FormControl('', [
    Validators.required,
    
  ]);
  podzgradaFormControl = new FormControl('', [
    Validators.required,
    
  ]);

  displayedColumns: any[] = [
    'key',
    'ime' ,
    'podzgrade',
    'action'
  ];

  
  constructor(private zgrada_service: ZgradaService) { 
    this.is_edit=[];
    this.is_save=[];
    this.is_selected=[];
    this.edit=false;
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
          this.is_edit.push(false);

        }
      })

    });
    //console.log("Ispispodzgrada:",this.PodZgrada);

    this.zgrada_service.getAllZgrade().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()
            
          })
          
        )
      )
    ).subscribe(data => {
      //console.log("Ispis0.25:",data);
      data.forEach(item => {
        //todo izmjeniti da je query a ne da ih sve dohvati
        if(item.u_uid==this.userData.uid){        
          this.LiftData.push(item as Zgrada)
        }
      })
      
      //console.log("Ispis1:",this.LiftData);
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
    //console.log("Specific00:",this.SpecificPodZg);
    return this.SpecificPodZg;
  }


  editZgrada(zg_key:string,ime:string,i:number,podzg_key:string):void{
    this.is_edit[i]=true;
    this.is_save[i]=true;
    this.value=ime;
    this.edit=true;
    this.value2="Bok";
    if(podzg_key!=undefined){
      this.PodZgrada.forEach((element: any) => {
        if(podzg_key==element.key){
          this.value2=element.ime;
        }
        console.log("Edit:",element.zg_id);   


      });
  }
   
    

  }
  saveZgrada(zgrada_key:string,ime:string,i:number,pod:string):void{
    this.is_edit[i]=false;
    this.is_save[i]=false;
    this.edit=false;
    console.log("Save:",zgrada_key,ime,i,pod);

  }
  check_name(key:string,ime:string,i:number){
    this.LiftData.forEach((element: any) => {
      if(ime==element.ime){
        return true;
      }
      return false;
    });

    return false;
  }

  removeZgrada():void{

  }
  removeAllZgrade(): void {
    this.zgrada_service.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
