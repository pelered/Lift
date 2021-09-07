import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { Zgrada } from 'src/app/models/zgrada/zgrada';
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
//import { Zgrada } from 'src/app/models/zgrada/zgrada.model';
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


  zgrade?:Zgrada[];

  dataSource!: MatTableDataSource<Zgrada>;
  @ViewChild(MatPaginator,{static: true})
  paginator!: MatPaginator;
 
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
    this.size$ = new BehaviorSubject<string|null>(null);   
    this.isti_naziv=false;

    }


  ngOnInit(): void {

    this.retrieveZgrade();
    
  }
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;

 
   // console.log("Sort",this.sort);
    

  }
  ngOnChanges():void{
    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
      
      
      data.forEach(items => {
        
        if(items.u_uid==this.userData.uid){    
          this.PodZgrada.push(items as Zgrada);          
          //this.is_edit.push(false);     
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
      //console.log("Zgrade:",data);

      data.forEach(item => {
        //todo izmjeniti da je query a ne da ih sve dohvati
        if(item.u_uid==this.userData.uid){        
          this.LiftData.push(item as Zgrada)

          this.is_edit.push(false);
          this.is_save.push(false);
          
        }
      })
     // console.log("Selected",this.LiftData);
      this.LiftData.forEach((el:any) => {        
        if(el.podzg!=undefined){
          //nece raditi ako nisu zaredom s selectom
          this.is_selected.push(el.podzg[0]);
        }else{
          this.is_selected.push("");
        }
      });
      this.zgrade = data;

     // console.log("Is_selected",this.is_selected);
      //console.log("Is_edit",this.is_edit);
     //console.log("Zgrada:",this.LiftData);
     //console.log("Podzgrada:",this.PodZgrada);
     //console.log("Sve zgrade:",this.zgrade);
        this.dataSource = new MatTableDataSource(this.LiftData);
        console.log("Datas",this.LiftData);
        /*setTimeout(() => {
          //this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }, 1000);*/
        setTimeout(() => this.dataSource.paginator = this.paginator);

    });

  }

  /*getPodzg(pod_id:String){
     
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
  }*/
  Dialog(key_zg:string,key_pod:string): void {

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Sigurno želite obrisati sve podatke ?`
      })
      .afterClosed()
      .subscribe((confirm: Boolean) => {
        if (confirm) {
          if(key_pod=="false"){
            //console.log("False",key_zg);
            this.removeZgrada(key_zg);
          }else{
            this.removeZgrada_Pod(key_zg,key_pod);

            //console.log("True",key_zg,key_pod)

          }
          //this.removeLift(key);
          //alert("Brisanje");

        } else {
          //alert("Odustali ste");
        }
      });
  }

 
  getSpecificPodZg(zg_idd:String){
    
    //console.log("Podzg_is_selected",this.is_selected);
    this.SpecificPodZg=[];
    this.PodZgrada.forEach((element: any) => {
      if(element.zg_id==zg_idd){
      this.SpecificPodZg.push(element);
      }

    });
    //console.log("SpecificPodZg",this.SpecificPodZg);

    return this.SpecificPodZg;
  }


  editZgrada(zg_key:string,ime:string,i:number,podzg_key:string):void{
    this.is_edit[i]=true;
    this.is_save[i]=true;
    this.value=ime;
    this.edit=true;
    //console.log("Is_selected",this.is_selected);
      //console.log("Is_edit",this.is_edit);
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
    if(pod!=""){
      this.zgrada_service.updatePodzg(pod,this.value2);
    }
    //todo edit gumb nestaje ako se samo podz promjeni naziv

  }
  onPaginateChange(event: any){
    console.log("Event",event)
  }
  
  removeZgrada_Pod(key_zg:string,key_podzg:string):void{
    //console.log("Delete:",key_podzg,key_zg);
    //pregledavamo listu svih podzgrada
    this.listLifts=[];
    this.PodZgrada.forEach((element:any) => {
      if(element.key==key_podzg){
        //console.log("Kljucevi1",element.key,key_podzg);
        //ako je podzgrada u listi istog kljuca kao zadana
        //console.log("Podzgprije",element);
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
        //console.log("Kljucevi2",element.key,key_zg);
        //zgrada istog kljuca kao zadana
        //console.log("Zgradaprije",element.podzg,key_podzg)
        //trebalo bi izbacit podzgradu s idem podzgrade koja se brise
        const index = element.podzg.indexOf(key_podzg, 0);
        //console.log("Zgradaprije2",index)
        if (index > -1) {
          element.podzg.splice(index, 1);
        }      
        //console.log("Provjeraliftovizabrisanje:",this.listLifts);
        if(this.listLifts!=null || this.listLifts!=undefined){
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
    //console.log("Zgrada",this.zgrada_cijela);

    this.podzg=key_podzg;
    //console.log("Delete1:",key_zg);
    //console.log("Listaliftovazaizbacit:",this.listLifts);
    //console.log("Novalistaliftovazgrade:",this.zglist_lifts);
    //console.log("Novalistapodzg:",this.zg_list_podzg);

    this.broj=0;
    this.startTimer();
  }
  startTimer(){
    const source = timer(0, 1000);
    //console.log("Lista_liftova",this.listLifts,this.broj,this.listLifts.length);
    if(this.broj<this.listLifts.length){
      this.travels$=this.voznja_service.getListPutovanjaQuery(this.listLifts[this.broj]);
      this.travels$.forEach((data) =>{
        //console.log("Voznja",data)
        data.forEach((ele)=> { 
          this.voznja_service.delete(ele.payload.key!);
          //delete voznju kako ju nades
          //this.listVoznji.push(ele.payload.key);
       })  
      }); 

      
      this.subscription = source.subscribe(val => {
         // do stuff you want when the interval ticks
         //console.log("Tik",val);
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
        });
      }
     
      if(this.podzg!=null ){
       // console.log("Tu brisem podzgradu",this.zg,this.zgrada_cijela.podzg,this.podzg);
        if(this.zgrada_cijela.podzg==undefined || this.zgrada_cijela.podzg==null ||this.zgrada_cijela.podzg.length==0){
          this.zgrada_service.delete(this.zg);

        }else{
        this.zgrada_service.update(this.zg,this.zgrada_cijela);

        }
        this.zgrada_service.deletePod(this.podzg); 
        this.is_selected=[]
        //console.log("is_edit",this.is_edit);
        this.is_edit=[]
        this.is_save=[]
        this.LiftData.forEach((el:any) => {    
          this.is_edit.push(false);
          this.is_save.push(false);    
          if(el.podzg!=undefined){
            //nece raditi ako nisu zaredom s selectom
            this.is_selected.push(el.podzg[0]);
          }else{
            this.is_selected.push("");
          }
        });
        //console.log("is_edit2",this.is_edit);

        


      }else if(this.podzg==null){
        //console.log("Ako nema podzg")
        this.zgrada_service.delete(this.zg);
      }
    }else if(this.listLifts.length==undefined){
      //console.log("AKo ne postojji listLifts");
      this.zgrada_service.update(this.zg,this.zgrada_cijela);
      this.zgrada_service.deletePod(this.podzg);        

    }
    
  }

  stopTimer(){
    this.subscription.unsubscribe();
  }


 
  removeZgrada(key_zg:string):void{
    this.listLifts=[];
    //console.log("Zgrade_lista:",this.LiftData);
    this.LiftData.forEach((element:any) => {
      if(element.key==key_zg){
        //console.log("Zgrada za brisanje",element);
        if(element.lifts !=undefined || element.lifts!=null){
          for(let i=0;i<element.lifts.length;i++){
            this.listLifts.push(element.lifts[i]);
          }
        }
        
        ///this.listLifts=element.lifts; 
        /*this.listLifts.forEach((lift:string)=>{
          const index1 = element.lifts.indexOf(lift, 0);
          if (index1 > -1) {
            element.lifts.splice(index1, 1);
          }   

        })*/
        this.zglist_lifts=element.lifts;    
        this.zgrada_cijela=element;  
      }      
    });

    

    //console.log("Delete:",key_zg);
    //console.log("Del0:",this.listLifts.length);
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
