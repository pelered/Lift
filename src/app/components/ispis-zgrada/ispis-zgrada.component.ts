import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { Zgrada } from 'src/app/models/zgrada/zgrada';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';

import {AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';

//
interface Food {
  value: string;
  viewValue: string;
}
//
//                [routerLink]="['/ispis-liftova/',element.key]" [state]="{ data: {element}}"

@Component({
  selector: 'app-ispis-zgrada',
  templateUrl: './ispis-zgrada.component.html',
  styleUrls: ['./ispis-zgrada.component.css']
})
export class IspisZgradaComponent implements OnInit {

  //selectedValue: string | undefined;

  isti_naziv!:boolean;
  zgrade?:Zgrada[];
  //currentZgrada?:Zgrada;
 // currentIndex = -1;
  //title = '';
  dataSource!: MatTableDataSource<Zgrada>;
  paginator!: MatPaginator;
  @ViewChild(MatPaginator)
  ZgradaData: any = [];
  LiftData: any = [];
  PodZgrada: any=[];
  userData!:  User;
  SpecificPodZg :any=[];
  
  privremeni!: Zgrada;
  value = 'Clear me';
  value2='Clear me';
  edit:boolean;
  is_edit :boolean[]=[];
  is_save :boolean[]=[];
  is_selected:string[]=[];
  is_selected_ob:string[]=[];
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
   ) { 
    this.is_edit=[];
    this.is_save=[];
    this.is_selected=[];
    this.edit=false;

    }


  ngOnInit(): void {

    this.retrieveZgrade();
    
  }
 /* refreshList(): void {
    //this.currentZgrada = undefined;
    //this.currentIndex = -1;
    this.retrieveZgrade();
  }*/

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
        //todo izmjeniti da je query a ne da ih sve dohvati
        console.log("User",this.userData);
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
      console.log("Zgrade:",data);

      data.forEach(item => {
        //todo izmjeniti da je query a ne da ih sve dohvati
        if(item.u_uid==this.userData.uid){        
          this.LiftData.push(item as Zgrada)
          this.is_edit.push(false);
          this.is_save.push(false);
          
        }
      })
      this.LiftData.forEach((el:any) => {
        if(el.podzg!=undefined){
          //nece raditi ako nisu zaredom s selectom
          this.is_selected.push(el.podzg[0]);


        }else{
          this.is_selected.push("");
        }
      });
      this.zgrade = data;

     
        this.dataSource = new MatTableDataSource(this.LiftData);
        //console.log("Datas",this.dataSource);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    });

  }

  setActiveZgrada(zgrada: Zgrada, index: number): void {
    //this.currentZgrada = zgrada;
    //this.currentIndex = index;
  }
  getPodzg(pod_id:String){
     
    this.PodZgrada.forEach((element: any) => {
      if(element.key==pod_id){
      //this.SpecificPodZg.push(element);
      console.log("Podzgrada:",element);
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
  saveZgrada(zgrada_key:string,naziv:string,i:number,pod:string):void{
    this.is_edit[i]=false;
    this.is_save[i]=false;
    this.edit=false;
    this.LiftData.forEach((element: any) => {
      if(this.value==element.ime){
        console.log("Postoji zg s tim nazivom",this.value);
        this.isti_naziv=true;
      }else if(element.key==zgrada_key){
        if(this.value==element.ime){
          console.log("Nisi promjenio naziv zg",this.value);
        }
      }else if(this.value!=""){
        this.zgrada_service.updateZg(zgrada_key,this.value);
      }

      
    });
    this.PodZgrada.forEach((element: any) => {
      if(element.zg_id==zgrada_key){
        if(element.ime==this.value2){
          console.log("SavePod",element.ime,this.value2)
        }
        else if(this.value2!=""){
          this.zgrada_service.updatePodzg(pod,this.value2);
        }

      }


    });
    //console.log("Save:",zgrada_key,naziv,i,pod);

  }
  check_name(){
    console.log("Check:",this.value);

    this.LiftData.forEach((element: any) => {
      if(this.value==element.ime){
        console.log("Check:2",this.value,element.ime);

        return true;
      }
      console.log("Check:3");

      return false;
    });
    console.log("Check:4");

    return false;
  }

  removeZgrada():void{

  }
  /*removeAllZgrade(): void {
    this.zgrada_service.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }*/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
