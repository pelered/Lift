import { Component,  OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiftService } from 'src/app/services/lift/lift.service';
import { map } from 'rxjs/operators';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { Lift } from 'src/app/models/lift/lift';
import { Building } from 'src/app/models/zgrada/zgrada';


import { AngularFireAction } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase';
import { PutovanjeService } from 'src/app/services/putovanje/putovanje.service';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { MatDialog } from "@angular/material/dialog";

import { DialogoConfirmacionComponent } from 'src/app/dialog/dialogo-confirmacion.component';
@Component({
  selector: 'app-ispis-liftova',
  templateUrl: './ispis-liftova.component.html',
  styleUrls: ['./ispis-liftova.component.css']
})
export class IspisLiftovaComponent implements OnInit {
  zgrada!: Building;
  zgrada2!:Building;
  podzg!: Building;
  LiftData: any = [];
  id :string|null;
  liftovi?:Lift[];
  currentLift?:Lift;
  currentIndex = -1;
  title = '';
  dataSource!: MatTableDataSource<Lift>;
  paginator!: MatPaginator;
  @ViewChild(MatPaginator)
  userData!:  User;
  liftDelete!:Lift;
  
  value = 'Clear me';
  is_edit :boolean[]=[];
  is_save :boolean[]=[];
  edit:boolean;
  isti_naziv!:boolean;
  cijelaZgrada:any=[]
  cijelaPod:any=[];
  travels$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  pod$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  zg$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  lifts$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;


  displayedColumns: any[] = [
    'ime' ,
    'najnizi kat',
    'najvisi kat',
    'spojen',
    'action'
  ];
  constructor(private lift_service: LiftService,private actRoute: ActivatedRoute,
    private voznja_service:PutovanjeService,private zgrada_service: ZgradaService,
    public dialogo: MatDialog) {
      this.id = this.actRoute.snapshot.paramMap.get('id');
      this.zgrada=history.state.data;       
      if(history.state.data2!=undefined){
        this.pod$=zgrada_service.getPodQuery(history.state.data1)
        this.pod$.forEach(data =>{
          data.forEach((ele)=> { 
            this.podzg=ele.payload.val();
            if(localStorage.getItem("Pod")!=null || localStorage.getItem("Pod")!=undefined){
              localStorage.removeItem("Pod");

            }
            localStorage.setItem("Pod",JSON.stringify(this.podzg));
          })
          })
      
    }
    if(history.state.data!=undefined){
      this.zg$=zgrada_service.getZgQuery(history.state.data.key)
      this.zg$.forEach(data =>{
        data.forEach((ele)=> { 
          this.zgrada=ele.payload.val();
          if(localStorage.getItem("Zgrada")!=null || localStorage.getItem("Zgrada")!=undefined){
            localStorage.removeItem("Zgrada");

          }
          localStorage.setItem("Zgrada",JSON.stringify(this.zgrada));
        })
        })
    }
  
      this.is_edit=[];
      this.is_save=[];
      this.edit=false;
      this.isti_naziv=false;

    
   }
   Dialog(key:string): void {

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Sigurno želite obrisati ovaj lift i sve njegove izmjerene podatke?`
      })
      .afterClosed()
      .subscribe((confirm: Boolean) => {
        if (confirm) {
          this.removeLift(key);

        } else {
        }
      });
  }
 

  ngOnInit(): void {
    this.setValues();

    this.LiftData = [];

    this.retrieveLifts();
  }
  setValues():void{
    if(history.state.data!=undefined){

      if(localStorage.getItem("Zgrada")!="undefined" ){
        if(history.state.data.key==JSON.parse(localStorage.getItem("Zgrada")!).key){
          var retrievedObject:any=localStorage.getItem("Zgrada");
          this.zgrada=JSON.parse(retrievedObject);          
        }else{
          this.zgrada=history.state.data;
          localStorage.setItem("Zgrada",JSON.stringify(this.zgrada));
        }
      }else{
        this.zgrada=history.state.data;
        localStorage.setItem("Zgrada",JSON.stringify(this.zgrada));
      }
    }else{
      var retrievedObject:any=localStorage.getItem("Zgrada");
      this.zgrada=JSON.parse(retrievedObject);
    }
    
    if(history.state.data!=undefined &&history.state.data2!=undefined){
      if(localStorage.getItem("Pod")!=null){
        if(history.state.data1==JSON.parse(localStorage.getItem("Pod")!).key){
          this.podzg=JSON.parse(localStorage.getItem("Pod")!);
        }else{
          history.state.data2.forEach((el:any) => {
            if(el.key==history.state.data1){
              this.podzg=el;
              localStorage.setItem("Pod",JSON.stringify(this.podzg));
            }        
          });
        }
      }else{
        history.state.data2.forEach((el:any) => {
          if(el.key==history.state.data1){
            this.podzg=el;
            localStorage.setItem("Pod",JSON.stringify(this.podzg));
          }        
        });
      }
    }else if(history.state.data!=undefined &&history.state.data2==undefined){      
      if(localStorage.getItem("Pod")!=null){
        localStorage.removeItem("Pod");
      }     
    }else{
       this.podzg=JSON.parse(localStorage.getItem("Pod")!);
    }


  }
 
  retrieveLifts(): void {  
    
     
    this.lift_service.getAllLift().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()            
          })
          
        )
      )
    ).subscribe(data => {
      this.LiftData=[];
      this.is_edit=[];
      data.forEach(item => {
                
        if(item.pod_zg==this.id || item.zgrada==this.id){    
          this.LiftData.push(item as Lift);
          this.is_edit.push(false);
        }
      })     
  

      this.liftovi != data;     
        this.dataSource = new MatTableDataSource(this.LiftData);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    });
  
  }

  editLift(lift_key:string,ime:string,i:number):void{
    this.is_edit[i]=true;
    this.is_save[i]=true;
    this.value=ime;
    this.edit=true; 

  }
  saveLift(lift_key:string,ime:string,i:number):void{
    this.is_edit[i]=false;
    this.is_save[i]=false;
    this.edit=false;

    this.lift_service.update(lift_key,this.value);

  }
  check(ime:string,key:string):void{
    for(let a of this.LiftData) {
      if(a.ime==ime &&a.key!=key) {
        this.isti_naziv=true;
        break;
      }else{
        this.isti_naziv=false;
      }
   } 
    
  }

  removeLift(lift:any):void{

    var liftobject:Lift;
    this.LiftData.forEach((element:any) => {

      if(element.key==lift){
        this.liftDelete=element;
        liftobject=element.value;
      }
    });

    const index = this.zgrada.lifts!.indexOf(lift, 0);
    if (index > -1) {
      this.zgrada.lifts!.splice(index, 1);
    }  

    if(this.podzg!=undefined){
      const index1 = this.podzg.lifts!.indexOf(lift, 0);
      if (index1 > -1) {
        this.podzg.lifts!.splice(index1, 1);
      } 
    }
     

    this.travels$=this.voznja_service.getListPutovanjaQuery(lift);
    this.travels$.forEach(data =>{
      if(data.length!=0){
        data.forEach((ele)=> { 
          this.voznja_service.delete(ele.payload.key!);
       })
      }
    //    
    this.zgrada_service.update(this.liftDelete.zgrada!,this.zgrada);
    localStorage.setItem("Zgrada",JSON.stringify(this.zgrada))

    if(this.liftDelete.pod_zg!=undefined && this.liftDelete.pod_zg!=null){


     this.zgrada_service.updateP(this.liftDelete.pod_zg,this.podzg);
     localStorage.setItem("Pod",JSON.stringify(this.podzg))

    }
    
    this.lift_service.delete(lift);
    this.voznja_service.updateMjeri(lift,false);  
    this.voznja_service.deleteStanje(lift);
    this.voznja_service.deleteMj(lift);

    })
    

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
