import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { Building } from 'src/app/models/zgrada/zgrada';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import {MatSort} from '@angular/material/sort';
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LiftService } from 'src/app/services/lift/lift.service';
import { PutovanjeService } from 'src/app/services/putovanje/putovanje.service';

//
import { Injectable } from '@angular/core';
import { AngularFireAction, AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase';
import { Subscription, timer } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DialogoConfirmacionComponent } from 'src/app/dialog/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ispis-zgrada',
  templateUrl: './ispis-zgrada.component.html',
  styleUrls: ['./ispis-zgrada.component.css']
})
export class IspisZgradaComponent implements OnInit {


  zgrade?:Building[];

  dataSource!: MatTableDataSource<Building>;
  @ViewChild(MatPaginator,{static: true})
  paginator!: MatPaginator;
 
  ZgradaData: any = [];
  LiftData: any = [];
  PodZgrada: any=[];
  userData!:  User;
  SpecificPodZg :any=[];
  listLifts:any=[];
  listVoznji:any=[];
  
  privremeni!: Building;
  value = 'Clear me';
  value2='Clear me';
  edit:boolean;


  is_edit :boolean[]=[];
  is_save :boolean[]=[];
  is_selected:string[]=[];
  is_selected_ob:string[]=[];

  travels$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  isti_naziv!:boolean;
  zgrade$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  podzgrade$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  

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
    Validators.nullValidator,
    
  ]);

  displayedColumns: any[] = [
    'ime' ,
    'podzgrade',
    'action'
  ];

  pageEvent!: PageEvent;
  constructor(private zgrada_service: ZgradaService
   ,private lift_service:LiftService,private voznja_service:PutovanjeService,
   public dialogo: MatDialog) { 

    this.is_edit=[];
    this.is_save=[];
    this.is_selected=[];

    this.edit=false;
    this.isti_naziv=false;

    }


  ngOnInit(): void {

    this.retrieveZgrade();
    
  }
  ngAfterViewInit() {

    

  }
  ngOnChanges():void{
    this.dataSource.paginator = this.paginator;
   }
  retrieveZgrade(): void {
    
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
      
      
      data.forEach(items => {
        
        if(items.u_uid==this.userData.uid){    
          this.PodZgrada.push(items as Building); 

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
      this.is_edit=[];

      data.forEach(item => {
        if(item.u_uid==this.userData.uid){        
          this.LiftData.push(item as Building)

          this.is_edit.push(false);
          this.is_save.push(false);
          
        }
      })
      this.LiftData.forEach((el:any) => {        
        if(el.podzg!=undefined){
          this.is_selected.push(el.podzg[0]);
        }else{
          this.is_selected.push("");
        }
      });
      this.zgrade = data;


        this.dataSource = new MatTableDataSource(this.LiftData);
        console.log("Datas",this.LiftData);

        setTimeout(() => this.dataSource.paginator = this.paginator);

    });

  }


  Dialog(key_zg:string,key_pod:string): void {

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Sigurno želite obrisati sve podatke ?`
      })
      .afterClosed()
      .subscribe((confirm: Boolean) => {
        if (confirm) {
          if(key_pod=="false"){
            this.removeZgrada(key_zg);
          }else{
            this.removeZgrada_Pod(key_zg,key_pod);


          }
 

        } else {
        }
      });
  }

 
  getSpecificPodZg(zg_idd:String){
    
    this.SpecificPodZg=[];
    this.PodZgrada.forEach((element: any) => {
      if(element.zg_id==zg_idd){
      this.SpecificPodZg.push(element);
      }

    });

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
  checkZg(ime:any,podzg:any):void{
    for(let el of this.LiftData){
      if(el.ime==ime && el.key!=podzg){
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
    if(pod!=""){
      this.zgrada_service.updatePodzg(pod,this.value2);
    }

  }

  
  removeZgrada_Pod(key_zg:string,key_podzg:string):void{

    this.listLifts=[];
    this.PodZgrada.forEach((element:any) => {
      if(element.key==key_podzg){

        if(element.lifts!=undefined){
          element.lifts.forEach((l:string)=>{
            this.listLifts.push(l);
          })
        }
        
      }      
    });
    this.LiftData.forEach((element:any) => {
      if(element.key==key_zg){

        const index = element.podzg.indexOf(key_podzg, 0);
        if (index > -1) {
          element.podzg.splice(index, 1);
        }      
        if(this.listLifts!=null || this.listLifts!=undefined){
          this.listLifts.forEach((lift:string) => {
            const index1 = element.lifts.indexOf(lift, 0);
            if (index1 > -1) {
              element.lifts.splice(index1, 1);
            }  
          });   
        }

               
      
        this.zgrada_cijela=element;

        

      }      
    });
    this.zg=key_zg;

    this.podzg=key_podzg;


    this.broj=0;
    this.startTimer();
  }
  startTimer(){
    const source = timer(0, 1000);
    if(this.broj<this.listLifts.length){
      this.travels$=this.voznja_service.getListPutovanjaQuery(this.listLifts[this.broj]);
      this.travels$.forEach((data) =>{
        if(data.length!=0){
          data.forEach((ele)=> { 
            this.voznja_service.delete(ele.payload.key!);
            this.listVoznji.push(ele.payload.key);
         })  
        }
        
      }); 
      
      this.subscription = source.subscribe(val => {
         if(val==2){
           this.stopTimer();
           this.broj++;
           this.startTimer();
         }
      });
    }else if(this.broj==this.listLifts.length){
      if(this.listLifts!=undefined){
        this.listLifts.forEach((element: string) => {
          this.lift_service.delete(element);
          this.voznja_service.updateMjeri(element,false);  
          this.voznja_service.deleteStanje(element);
          this.voznja_service.deleteMj(element);

               
        });
      }
     
      if(this.podzg!=null ){
        if(this.zgrada_cijela.podzg==undefined || this.zgrada_cijela.podzg==null ||this.zgrada_cijela.podzg.length==0){
          this.zgrada_service.delete(this.zg);

        }else{
        this.zgrada_service.update(this.zg,this.zgrada_cijela);

        }
        this.zgrada_service.deletePod(this.podzg); 
        this.is_selected=[]
        this.is_edit=[]
        this.is_save=[]
        this.LiftData.forEach((el:any) => {    
          this.is_edit.push(false);
          this.is_save.push(false);    
          if(el.podzg!=undefined){
            this.is_selected.push(el.podzg[0]);
          }else{
            this.is_selected.push("");
          }
        });

        


      }else if(this.podzg==null){
        this.zgrada_service.delete(this.zg);
      }
    }else if(this.listLifts.length==undefined){
      this.zgrada_service.update(this.zg,this.zgrada_cijela);
      this.zgrada_service.deletePod(this.podzg);        

    }
    
  }

  stopTimer(){
    this.subscription.unsubscribe();
  }


 
  removeZgrada(key_zg:string):void{
    this.listLifts=[];
    this.LiftData.forEach((element:any) => {
      if(element.key==key_zg){
        if(element.lifts !=undefined || element.lifts!=null){
          for(let i=0;i<element.lifts.length;i++){
            this.listLifts.push(element.lifts[i]);
          }
        }
        
        this.zglist_lifts=element.lifts;    
        this.zgrada_cijela=element;  
      }      
    });

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
    var filteredData = this.dataSource.filteredData;

    this.is_selected=[];
    this.is_save=[];
    this.is_edit=[];

    var filteredData = this.dataSource.filteredData;
    filteredData.forEach(item => {
      if(item.u_uid==this.userData.uid){     

        this.is_edit.push(false);
        this.is_save.push(false);
        if(item.podzg!=undefined){

          this.is_selected.push(item.podzg![0].valueOf());
        }else{
          this.is_selected.push("");
        }
            
      }
    })
     
  }

  onPaginateChange(event: any){
    const skip = this.paginator.pageSize * this.paginator.pageIndex;
   const paged = this.LiftData.filter((u: any, i: number) => i >= skip)
   .filter((u: any, i: number) => i <this.paginator.pageSize);


   this.is_selected=[];
    this.is_save=[];
    this.is_edit=[];
  
    paged.forEach((item: { u_uid: string; podzg: undefined; }) => {
      if(item.u_uid==this.userData.uid){     

        this.is_edit.push(false);
        this.is_save.push(false);
        if(item.podzg!=undefined){

          this.is_selected.push(item.podzg![0]);
        }else{
          this.is_selected.push("");
        }
            
      }
    })

  }
}
