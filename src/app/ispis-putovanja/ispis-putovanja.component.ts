import { Component, OnInit,ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { ZgradaService } from 'src/app/services/zgrada/zgrada.service';
import { Zgrada } from 'src/app/models/zgrada/zgrada.model';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable , Subscription,} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireAction } from '@angular/fire/database';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { Putovanje } from '../models/putovanje/putovanje';
import { ActivatedRoute } from '@angular/router';
import {PutovanjeDataSource} from '../services/putovanje/putovanje.datasource'
import { PutovanjeService } from '../services/putovanje/putovanje.service';
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-ispis-putovanja',
  templateUrl: './ispis-putovanja.component.html',
  styleUrls: ['./ispis-putovanja.component.css']
})
export class IspisPutovanjaComponent implements OnInit {

  
  id :string|null;
  LiftData: any = [];
  dataSource!: MatTableDataSource<Putovanje>;
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
  constructor(private travel_service: PutovanjeService,private actRoute: ActivatedRoute) {
    this.id = this.actRoute.snapshot.paramMap.get('id'); 
    
   }
  ngOnInit(): void {
    this.LiftData = [];

    this.retrieveLifts();
  }
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
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
        //todo izmjeniti da je query a ne da ih sve dohvati
        if( item.id_lift==this.id){    
          console.log("Ispis0.25:",item);
    
          this.LiftData.push(item as Putovanje)
          //console.log("Ispis0.255:",this.LiftData.push(item as Lift));

        }
      })
      
      console.log("Ispis1:",this.LiftData);

     
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

}
