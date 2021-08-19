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
@Component({
  selector: 'app-ispis-voznji',
  templateUrl: './ispis-voznji.component.html',
  styleUrls: ['./ispis-voznji.component.css']
})
export class IspisVoznjiComponent implements OnInit {


  
  id :string|null;
  LiftData: any = [];
  dataSource!: MatTableDataSource<Voznja>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;
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
   

   }
  ngOnInit(): void {
    this.LiftData = [];

    this.retrieveLifts();
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
      data.forEach(item => {
        if( item.id_lift==this.id){        
          this.LiftData.push(item as Voznja)
        }
      })
      

     
        this.dataSource = new MatTableDataSource(this.LiftData);
        setTimeout(() => {
          this.dataSource.sort = this.sort;

          this.dataSource.paginator = this.paginator;
        }, 0);
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

  this.dataSource.data=this.LiftData.filter( (data: { start_time: string | number | Date; end_time: string | number | Date; })=>{

    if (this.fromDate && this.toDate) {
      return this.pipe.transform(data.start_time,'shortDate')! >= this.pipe.transform(this.fromDate,'shortDate')! && this.pipe.transform(data.end_time,'shortDate')! <=  this.pipe.transform(this.toDate,'shortDate')!;
      }
  return true;
   }
  );
 
}
clearFromDate() 
{
  //this.filterForm.reset();
  console.log("Date0",this.filterForm.reset());

  console.log("Date",this.fromDate,'+++++',this.toDate)
  //this.fromDate=null;

}
clearToDate(){
  this.dataSource.data=this.LiftData;
  

}

}
