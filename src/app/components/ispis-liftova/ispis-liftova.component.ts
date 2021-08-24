import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiftService } from 'src/app/services/lift/lift.service';

import { map } from 'rxjs/operators';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { Lift } from 'src/app/models/lift/lift';
import { Zgrada } from 'src/app/models/zgrada/zgrada';

@Component({
  selector: 'app-ispis-liftova',
  templateUrl: './ispis-liftova.component.html',
  styleUrls: ['./ispis-liftova.component.css']
})
export class IspisLiftovaComponent implements OnInit {
  zgrada!: Zgrada;
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


  displayedColumns: any[] = [
    'ime' ,
    'najnizi kat',
    'najvisi kat',
    'action'
  ];
  constructor(private lift_service: LiftService,private actRoute: ActivatedRoute) {
      this.id = this.actRoute.snapshot.paramMap.get('id');
      //console.log("Podaci",history.state);
      this.zgrada=history.state.data;
      //console.log("Podaci2",this.zgrada.ime);
      if(history.state.data2!=undefined){
      history.state.data2.forEach((el:any) => {
       // console.log("Podaci0",el);
        if(el.key==history.state.data1){
          this.podzg=el;
        }        
      });
    }
      //console.log("Podaci1",this.podzg);

     // console.log("Podaci2",this.zgrada);
      this.is_edit=[];
      this.is_save=[];
      this.edit=false;

    
   }

  ngOnInit(): void {
    this.LiftData = [];

    this.retrieveLifts();
  }
  retrieveLifts(): void {
    
    //console.log("Ispis0:",JSON.parse(localStorage.getItem("user")!));
    //this.userData=JSON.parse(localStorage.getItem("user")!);
    
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
          //console.log("Ispis0.25:",item);    
          this.LiftData.push(item as Lift);
          this.is_edit.push(false);
          //console.log("Ispis0.255:",this.LiftData.push(item as Lift));
        }
      })     
      //console.log("Ispis1:",this.LiftData);
     // console.log("Edit",this.is_edit);

      this.liftovi = data;     
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
    this.LiftData.forEach((element: any) => {
      if(element.ime==ime){
        this.isti_naziv=true;
        console.log("Postoji lift s tim nazivom")

      }else if(this.value!=""){
        this.lift_service.update(lift_key,this.value);

      }
    });

    console.log("Save:",this.LiftData[i]);


  }

  removeLift():void{

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
