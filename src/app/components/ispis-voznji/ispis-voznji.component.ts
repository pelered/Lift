import { Component, OnInit,ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { Voznja } from '../../models/voznja/voznja';
import { ActivatedRoute } from '@angular/router';
import { PutovanjeService } from '../../services/putovanje/putovanje.service';
import {MatSort, Sort} from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Zgrada } from 'src/app/models/zgrada/zgrada';
import { Lift } from 'src/app/models/lift.model';
import { LiftState } from 'src/app/models/lift/lift-state';
@Component({
  selector: 'app-ispis-voznji',
  templateUrl: './ispis-voznji.component.html',
  styleUrls: ['./ispis-voznji.component.css']
})
export class IspisVoznjiComponent implements OnInit {

  zgrada!: Zgrada;
  podzg!: Zgrada;
  lift!: Lift;
  lift_state!:LiftState;
  
  id :string|null;
  TravelData: any = [];
  LiftState :any;
  dataSource!: MatTableDataSource<Voznja>;
  @ViewChild(MatPaginator,{static: true})
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  /*@ViewChild(MatSort)
  sort!: MatSort;*/
  displayedColumns: any[] = [
    'n_k',
    'v_k',
    'p_k',
    'z_k',
    'start_time',
    'end_time',
    'count_p'
  ];
  //
  pipe: DatePipe;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
});
  datepipe: any;



  get fromDate() { return this.filterForm.get('fromDate')!.value; }
   get toDate() { return this.filterForm.get('toDate')!.value; }

  constructor(private travel_service: PutovanjeService,private actRoute: ActivatedRoute) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.dataSource= new MatTableDataSource();
    this.pipe = new DatePipe('en');
    this.lift=history.state.data;
    this.zgrada=history.state.data1;
    

      //console.log("Podaci2",this.zgrada.ime);
      if(history.state.data2!=undefined){
          this.podzg=history.state.data2;
        
    }
   

    
   }
   ngOnChanges():void{
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   }
  ngOnInit(): void {
    this.TravelData = [];

    this.setValues();
    
    this.retrieveLifts();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   // console.log("Sort",this.sort);
   
     
   
  
    
  }






  setValues():void{
    if(history.state.data1!=undefined){
      //dosli s druge stranice
      if(localStorage.getItem("Zgrada")!="undefined" &&localStorage.getItem("Zgrada")!=null ){
        //postoje podaci vec neki o zgradi nekoj
        if(history.state.data1.key==JSON.parse(localStorage.getItem("Zgrada")!).key){
          //zgrada nova ista kao zapisana,spremamo nju
          var retrievedObject:any=localStorage.getItem("Zgrada");
          this.zgrada=JSON.parse(retrievedObject);          
        }else{
          //nova zgrada ,zapisujemo ju
          this.zgrada=history.state.data1;
          localStorage.setItem("Zgrada",JSON.stringify(this.zgrada));
        }
      }else{
        //ne postoji zapis, zapisujemo ju
        this.zgrada=history.state.data1;
        localStorage.setItem("Zgrada",JSON.stringify(this.zgrada));
      }
    }else{
      //refresh se dogodio
      var retrievedObject:any=localStorage.getItem("Zgrada");
      this.zgrada=JSON.parse(retrievedObject);
    }
    
    if(history.state.data1!=undefined &&history.state.data2!=undefined){
      //dosli smo s prethodne stranice
      if(localStorage.getItem("Pod")!=null){
        //postoji zapis u local storage
        if(history.state.data2.key==JSON.parse(localStorage.getItem("Pod")!).key){
          //dobiveni podatak je jednak onom u local storage,prekopiraj ga
          this.podzg=JSON.parse(localStorage.getItem("Pod")!);
        }else{
          //dobiveni podatak nije isti onom u local storage
          this.podzg=history.state.data2;
          localStorage.setItem("Pod",JSON.stringify(this.podzg));
        }
      }else{
        //ne postoji zapis u local storage
        this.podzg=history.state.data2;
        localStorage.setItem("Pod",JSON.stringify(this.podzg));
      }
    }else if(history.state.data1!=undefined &&history.state.data2==undefined){      
      // ne postoji podzgrada
      if(localStorage.getItem("Pod")!=null){
        localStorage.removeItem("Pod");
      }     
    }else{
       //ako nema nijednoga onda je refresh  
       this.podzg=JSON.parse(localStorage.getItem("Pod")!);
    }

    if(history.state.data!=undefined){
      //dosli s druge stranice
      if(localStorage.getItem("Lift")!="undefined" && localStorage.getItem("Lift")!=null){
        //postoje podaci vec neki o lift nekoj
        if(history.state.data.key==JSON.parse(localStorage.getItem("Lift")!).key){
          //lift nova ista kao zapisana,spremamo nju
          var retrievedObject:any=localStorage.getItem("Lift");
          this.lift=JSON.parse(retrievedObject);          
        }else{
          //nova lift ,zapisujemo ju
          this.lift=history.state.data;
          localStorage.setItem("Lift",JSON.stringify(this.lift));
        }
      }else{
        //ne postoji zapis, zapisujemo ju
        this.lift=history.state.data;
        localStorage.setItem("Lift",JSON.stringify(this.lift));
      }
    }else{
      //refresh se dogodio
      var retrievedObject:any=localStorage.getItem("Lift");
      this.lift=JSON.parse(retrievedObject);
    }
    

  }
  retrieveLifts() {
   
    this.travel_service.getAllTravels().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()
            
          })
          
        )
      )
    ).subscribe(data => {
      this.TravelData=[];
    
      /*for(let i=0;data.length-1;i++){
        this.TravelData.push(data[i] as Voznja);
        console.log("Test",this.TravelData);

      }*/
      data.forEach(item => {
        if( item.id_lift==this.id){        
          this.TravelData.push(item as Voznja)         

          


        }
      })   
      //console.log("Test",this.TravelData);

      for(let i=0; i<this.TravelData.length;i++){
        this.TravelData[i].start_time=this.pipe.transform(this.TravelData[i].start_time, 'MM/d/yyyy, HH:mm:ss')
        this.TravelData[i].end_time=this.pipe.transform(this.TravelData[i].end_time, 'MM/d/yyyy, HH:mm:ss')
        //console.log("Test2:",this.TravelData);

      }
      

     
        this.dataSource = new MatTableDataSource(this.TravelData);
        setTimeout(() => {
          this.dataSource.sort = this.sort;

          this.dataSource.paginator = this.paginator;
        }, 0);
    });  

    this.travel_service.getStateLift().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val()
            
          })
          
        )
      )
    ).subscribe(
      data => {
        data.forEach(item=>{
          if(item.key==this.id){
            this.lift_state=item;
          }
        })
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //

applyFilterDate() {

  this.dataSource.data=this.TravelData.filter( (data: { start_time: string | number | Date; end_time: string | number | Date; })=>{

    if (this.fromDate && !this.toDate){
      return this.pipe.transform(data.start_time,'shortDate')! >= this.pipe.transform(this.fromDate,'shortDate')! ;
    }else if(!this.fromDate && this.toDate){
      return  this.pipe.transform(data.end_time,'shortDate')! <=  this.pipe.transform(this.toDate,'shortDate')!;
    }
    else if (this.fromDate && this.toDate) {
      return this.pipe.transform(data.start_time,'shortDate')! >= this.pipe.transform(this.fromDate,'shortDate')! && this.pipe.transform(data.end_time,'shortDate')! <=  this.pipe.transform(this.toDate,'shortDate')!;
      }
  return true;
   }
  );
 
}
clearFromDate() 
{
  this.filterForm.reset();
  this.dataSource.data=this.TravelData;
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}
clearToDate(){
  this.dataSource.data=this.TravelData;
  

}

}


