import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { Zgrada } from 'src/app/models/zgrada/zgrada';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';

import {AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LiftService } from 'src/app/services/lift/lift.service';
import { PutovanjeService } from 'src/app/services/putovanje/putovanje.service';

//
import { Injectable } from '@angular/core';
//import { Zgrada } from 'src/app/models/zgrada/zgrada.model';
import { AngularFireAction, AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase';
import { Subscription, timer } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-ispis-zgrada',
  templateUrl: './ispis-zgrada.component.html',
  styleUrls: ['./ispis-zgrada.component.css']
})
export class IspisZgradaComponent implements OnInit {


  zgrade?:Zgrada[];

  dataSource!: MatTableDataSource<Zgrada>;
  paginator!: MatPaginator;
  @ViewChild(MatPaginator)
  ZgradaData: any = [];
  LiftData: any = [];
  PodZgrada: any=[];
  userData!:  User;
  SpecificPodZg :any=[];
  listLifts:any=[];
  listVoznji:any=[];
  
  privremeni!: Zgrada;
  value = 'Clear me';
  value2='Clear me';
  edit:boolean;
  is_edit :boolean[]=[];
  is_save :boolean[]=[];
  is_selected:string[]=[];
  is_selected_ob:string[]=[];

  size$: BehaviorSubject<string|null>;
  travels$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  isti_naziv!:boolean;

  broj!:number;

  zgrada_cijela!:any;
  list_lifts!:[];
  podzglist_lifts!:[];
  zglist_lifts!:[];
  podzg!:string;
  zg_list_podzg!:[];
  zg!:string;
  subscription!: Subscription;

  zgradaFormControl = new FormControl('', [
    Validators.required,
    Validators.nullValidator,
    
    
  ],);
  podzgradaFormControl = new FormControl('', [
    Validators.required,
    Validators.nullValidator
    
  ]);

  displayedColumns: any[] = [
    'ime' ,
    'podzgrade',
    'action'
  ];

  
  constructor(private zgrada_service: ZgradaService
   ,private lift_service:LiftService,private voznja_service:PutovanjeService) { 
    this.is_edit=[];
    this.is_save=[];
    this.is_selected=[];
    this.edit=false;
    this.size$ = new BehaviorSubject<string|null>(null);   
    this.isti_naziv=false;

    }


  ngOnInit(): void {

    this.retrieveZgrade();
    
  }

  retrieveZgrade(): void {
    
    //console.log("Ispis0:",this.zgrada_service.getAll().query.orderByKey.);
    this.userData=JSON.parse(localStorage.getItem("user")!);
    this.is_edit=[];

    this.zgrada_service.getAllPodZg().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()
            
          })
          
        )
      )
    ).subscribe(data=>{
      this.PodZgrada=[];
      this.is_edit=[];
      
      data.forEach(items => {
        
        if(items.u_uid==this.userData.uid){    
          this.PodZgrada.push(items as Zgrada);          
          this.is_edit.push(false);     
        }
      })

    });

    this.zgrada_service.getAllZgrade().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()
            
          })
          
        )
      )
    ).subscribe(data => {
      this.LiftData=[];
      this.is_selected=[];
      this.is_save=[];
      //console.log("Zgrade:",data);

      data.forEach(item => {
        //todo izmjeniti da je query a ne da ih sve dohvati
        if(item.u_uid==this.userData.uid){        
          this.LiftData.push(item as Zgrada)
          this.is_edit.push(false);
          this.is_save.push(false);
          
        }
      })
      console.log("Selected",this.LiftData);
      this.LiftData.forEach((el:any) => {
        
        if(el.podzg!=undefined){
          //nece raditi ako nisu zaredom s selectom
          this.is_selected.push(el.podzg[0]);
        }else{
          this.is_selected.push("");
        }
      });
      this.zgrade = data;

     console.log("Zgrada:",this.LiftData);
     console.log("Podzgrada:",this.PodZgrada);
        this.dataSource = new MatTableDataSource(this.LiftData);
        //console.log("Datas",this.dataSource);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    });

  }


  getPodzg(pod_id:String){
     
    this.PodZgrada.forEach((element: any) => {
      if(element.key==pod_id){
      //this.SpecificPodZg.push(element);
      //console.log("Podzgrada-selected:",element);
      this.is_selected_ob.push(element);
      this.privremeni=element;

     }else{
      //this.is_selected_ob.push("");
     }
     return this.privremeni;

    });
  }
  getSpecificPodZg(zg_idd:String){
    
    //console.log("Podzg",this.is_selected);
    this.SpecificPodZg=[];
    this.PodZgrada.forEach((element: any) => {
      if(element.zg_id==zg_idd){
      this.SpecificPodZg.push(element);
      }

    });
    //console.log("Podzg2",this.SpecificPodZg);

    return this.SpecificPodZg;
  }


  editZgrada(zg_key:string,ime:string,i:number,podzg_key:string):void{
    this.is_edit[i]=true;
    this.is_save[i]=true;
    this.value=ime;
    this.edit=true;
    if(podzg_key!=undefined){
      this.PodZgrada.forEach((element: any) => {
        if(podzg_key==element.key){
          this.value2=element.ime;
        }


      });
  }
   
    

  }
  check(ime:any,podzg:any):void{
    let list=[];
    for(let k of podzg){
      list.push(k.key)
    }
    for(let a of this.PodZgrada) {
      if(list.includes(a.key) && a.ime==ime) {
        this.isti_naziv=true;
        break;
      }else{
        this.isti_naziv=false;
      }
   } 
    
  }
  saveZgrada(zgrada_key:string,naziv:string,i:number,pod:string):void{
    this.is_edit[i]=false;
    this.is_save[i]=false;
    this.edit=false;
    this.zgrada_service.updateZg(zgrada_key,this.value);
    this.zgrada_service.updatePodzg(pod,this.value2);


  }
  
  removeZgrada_Pod(key_zg:string,key_podzg:string):void{
    console.log("Delete:",key_podzg,key_zg);
    //pregledavamo listu svih podzgrada
    this.PodZgrada.forEach((element:any) => {
      if(element.key==key_podzg){
        console.log("Kljucevi1",element.key,key_podzg);
        //ako je podzgrada u listi istog kljuca kao zadana
        console.log("Podzgprije",element);
        if(element.lifts!=undefined){
          //ako postoji lista liftova u toj podzgradi
          element.lifts.forEach((l:string)=>{
            //spremamo sve liftove u novu list u za brisanje
            this.listLifts.push(l);
          })
        }
        
      }      
    });
    this.LiftData.forEach((element:any) => {
      //lista svi zgrada
      if(element.key==key_zg){
        console.log("Kljucevi2",element.key,key_zg);
        //zgrada istog kljuca kao zadana
        console.log("Zgradaprije",element.podzg,key_podzg)
        //trebalo bi izbacit podzgradu s idem podzgrade koja se brise
        const index = element.podzg.indexOf(key_podzg, 0);
        console.log("Zgradaprije2",index)
        if (index > -1) {
          element.podzg.splice(index, 1);
        }      
        console.log("Provjeraliftovizabrisanje:",this.listLifts);
        if(this.listLifts!=null && this.listLifts!=undefined){
          //ako postoje liftovi za brisanje
          this.listLifts.forEach((lift:string) => {
            //idemo po listi i izbacujemo liftove koji bi trebali biti obrisani
            const index1 = element.lifts.indexOf(lift, 0);
            if (index1 > -1) {
              element.lifts.splice(index1, 1);
            }  
          });   
        }

               
      
        this.zgrada_cijela=element;

        //this.zglist_lifts=element.lifts;
        

      }      
    });
    this.zg=key_zg;
    console.log("Zgrada",this.zgrada_cijela);

    this.podzg=key_podzg;
    console.log("Delete:",key_zg);
    console.log("Listaliftovazaizbacit:",this.listLifts);
    console.log("Novalistaliftovazgrade:",this.zglist_lifts);
    console.log("Novalistapodzg:",this.zg_list_podzg);

    this.broj=0;
    this.startTimer();
  }
  startTimer(){
    const source = timer(0, 1000);
    if(this.broj<this.listLifts.length){
      this.travels$=this.voznja_service.getListPutovanjaQuery(this.listLifts[this.broj]);
      this.travels$.forEach((data) =>{
        data.forEach((ele)=> { 
          this.listVoznji.push(ele.payload.key);
       })  
      }); 
      this.subscription = source.subscribe(val => {
         // do stuff you want when the interval ticks
         if(val==2){
           this.stopTimer();
           this.broj++;
           this.startTimer();
         }
      });
    }else if(this.broj==this.listLifts.length){
      this.listVoznji.forEach((element: string) => {
        //this.voznja_service.delete(element);        
      });
      this.listLifts.forEach((element: string) => {
        //this.lift_service.delete(element);        
      });
      if(this.podzg!=null ){
        console.log("Tu1");
        //this.zgrada_service.update(this.zg,this.zgrada_cijela);
        //this.zgrada_service.deletePod(this.podzg);        
      }else if(this.podzg==null){
        console.log("Tu2")
        //this.zgrada_service.delete(this.zg);
      }
      console.log("Voznje",this.listVoznji);
    }else if(this.listLifts.length==undefined){
      //this.zgrada_service.update(this.zg,this.zgrada_cijela);
      //this.zgrada_service.deletePod(this.podzg);        

    }
    
  }

  stopTimer(){
    this.subscription.unsubscribe();
  }


 
  removeZgrada(key_zg:string):void{
    this.LiftData.forEach((element:any) => {
      if(element.key==key_zg){
        this.listLifts=element.lifts; 
        this.listLifts.forEach((lift:string)=>{
          const index1 = element.lifts.indexOf(lift, 0);
          if (index1 > -1) {
            element.lifts.splice(index1, 1);
          }   

        })
        this.zglist_lifts=element.lifts;    
        this.zgrada_cijela=element;  
      }      
    });
    console.log("Delete:",key_zg);
    console.log("Del0:",this.listLifts.length);
    this.zg=key_zg;

    this.broj=0;
    this.startTimer();   


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
