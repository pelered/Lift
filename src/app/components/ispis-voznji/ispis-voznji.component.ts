import { Component, OnInit,ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { Voznja } from '../../models/voznja/voznja';
import { ActivatedRoute } from '@angular/router';
import { PutovanjeService } from '../../services/putovanje/putovanje.service';
import {MatSort} from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Zgrada } from 'src/app/models/zgrada/zgrada';
import { Lift } from 'src/app/models/lift.model';
@Component({
  selector: 'app-ispis-voznji',
  templateUrl: './ispis-voznji.component.html',
  styleUrls: ['./ispis-voznji.component.css']
})
export class IspisVoznjiComponent implements OnInit {

  zgrada!: Zgrada;
  podzg!: Zgrada;
  lift!: Lift;
  
  id :string|null;
  TravelData: any = [];
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

    this.retrieveLifts();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
      data.forEach(item => {
        if( item.id_lift==this.id){        
          this.TravelData.push(item as Voznja)
        }
      })
      

     
        this.dataSource = new MatTableDataSource(this.TravelData);
        setTimeout(() => {
          this.dataSource.sort = this.sort;

          this.dataSource.paginator = this.paginator;
        }, 6000);
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

  //console.log("Date0",this.filterForm.reset());

  //console.log("Date",this.fromDate,'+++++',this.toDate)
  //this.fromDate=null;

}
clearToDate(){
  this.dataSource.data=this.TravelData;
  

}

}
