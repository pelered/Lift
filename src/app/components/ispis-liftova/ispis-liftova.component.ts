import { Component,  OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiftService } from 'src/app/services/lift/lift.service';
import { map } from 'rxjs/operators';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { Lift } from 'src/app/models/lift/lift';
import { Zgrada } from 'src/app/models/zgrada/zgrada';


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
  zgrada!: Zgrada;
  zgrada2!:Zgrada;
  podzg!: Zgrada;
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
  
  value = 'Clear me';
  is_edit :boolean[]=[];
  is_save :boolean[]=[];
  edit:boolean;
  isti_naziv!:boolean;
  cijelaZgrada:any=[]
  cijelaPod:any=[];
  el:string="-MirRUBFkWUnOvUJt3Bx"
  //size$: BehaviorSubject<string|null>;
  travels$!: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
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
      history.state.data2.forEach((el:any) => {
        if(el.key==history.state.data1){
          this.podzg=el;
        }        
      });
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
          alert("Brisanje");

        } else {
          alert("Odustali ste");
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
      //dosli s druge stranice
      if(localStorage.getItem("Zgrada")!="undefined" ){
        //postoje podaci vec neki o zgradi nekoj
        if(history.state.data.key==JSON.parse(localStorage.getItem("Zgrada")!).key){
          //zgrada nova ista kao zapisana,spremamo nju
          var retrievedObject:any=localStorage.getItem("Zgrada");
          this.zgrada=JSON.parse(retrievedObject);          
        }else{
          //nova zgrada ,zapisujemo ju
          this.zgrada=history.state.data;
          localStorage.setItem("Zgrada",JSON.stringify(this.zgrada));
        }
      }else{
        //ne postoji zapis, zapisujemo ju
        this.zgrada=history.state.data;
        localStorage.setItem("Zgrada",JSON.stringify(this.zgrada));
      }
    }else{
      //refresh se dogodio
      var retrievedObject:any=localStorage.getItem("Zgrada");
      this.zgrada=JSON.parse(retrievedObject);
    }
    
    if(history.state.data!=undefined &&history.state.data2!=undefined){
      //dosli smo s prethodne stranice
      if(localStorage.getItem("Pod")!=null){
        //postoji zapis u local storage
        if(history.state.data1==JSON.parse(localStorage.getItem("Pod")!).key){
          //dobiveni podatak je jednak onom u local storage,prekopiraj ga
          this.podzg=JSON.parse(localStorage.getItem("Pod")!);
        }else{
          //dobiveni podatak nije isti onom u local storage
          history.state.data2.forEach((el:any) => {
            if(el.key==history.state.data1){
              this.podzg=el;
              localStorage.setItem("Pod",JSON.stringify(this.podzg));
            }        
          });
        }
      }else{
        //ne postoji zapis u local storage
        history.state.data2.forEach((el:any) => {
          if(el.key==history.state.data1){
            this.podzg=el;
            localStorage.setItem("Pod",JSON.stringify(this.podzg));
          }        
        });
      }
    }else if(history.state.data!=undefined &&history.state.data2==undefined){      
      // ne postoji podzgrada
      if(localStorage.getItem("Pod")!=null){
        localStorage.removeItem("Pod");
      }     
    }else{
       //ako nema nijednoga onda je refresh  
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
                
        //todo izmjeniti da je query a ne da ih sve dohvati
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
    console.log("Zg",this.zgrada);
    console.log("Pod",this.podzg);
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
  check(ime:any):void{
    for(let a of this.LiftData) {
      if(a.ime==ime) {
        this.isti_naziv=true;
        //console.log("Postoji lift s tim nazivom",this.isti_naziv)
        break;
      }else{
        //console.log("Ne Postoji lift s tim nazivom",this.isti_naziv)
        this.isti_naziv=false;
      }
   } 
    
  }

  removeLift(lift:any):void{
    //todo da makne iz liste onoga kojega smo izbrisali
    //this.is_edit.pop;
    console.log("Lift",lift);
    const index = this.zgrada.lifts!.indexOf(lift.key, 0);
    if (index > -1) {
      this.zgrada.lifts!.splice(index, 1);
    }  

    if(this.podzg!=undefined){
      const index1 = this.podzg.lifts!.indexOf(lift.key, 0);
      if (index1 > -1) {
        this.podzg.lifts!.splice(index1, 1);
      } 
    }
     

    console.log("Zg",this.zgrada);
    console.log("Pod",this.podzg);


    this.travels$=this.voznja_service.getListPutovanjaQuery(lift.key);
    this.travels$.forEach(data =>{
         data.forEach((ele)=> { 
           this.voznja_service.delete(ele.payload.key!);
        })
    this.lift_service.delete(lift.key);
    })
    this.zgrada_service.update(lift.zgrada,this.zgrada);
    if(this.podzg!=undefined){
      this.zgrada_service.updateP(lift.pod_zg,this.podzg);

    }

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
