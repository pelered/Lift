import { Component, OnInit,ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { LitKomService } from '../services/lit-kom.service';
import Lift from '../models/lift.model';
import { MatPaginator} from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-ispis-putovanja',
  templateUrl: './ispis-putovanja.component.html',
  styleUrls: ['./ispis-putovanja.component.css']
})
export class IspisPutovanjaComponent implements OnInit {
  lifts?: Lift[];
  currentLift?: Lift;
  currentIndex = -1;
  title = '';
  dataSource!: MatTableDataSource<Lift>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  LiftData: any = [];
  displayedColumns: any[] = [
    '$key',
    'ime',
    
    'action'
  ];
  
  constructor(private litkomservice: LitKomService) { }


  ngOnInit(): void {
    this.retrieveLifts();
  }
  refreshList(): void {
    this.currentLift = undefined;
    this.currentIndex = -1;
    this.retrieveLifts();
  }

  retrieveLifts(): void {
    this.litkomservice.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      data.forEach(item => {
           
        this.LiftData.push(item as Lift)
      })
      
      console.log("Ispis1:",this.LiftData);
      this.lifts = data;
      this.dataSource = new MatTableDataSource(this.LiftData);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    });
  }

  setActiveLift(lift: Lift, index: number): void {
    this.currentLift = lift;
    this.currentIndex = index;
  }

  removeAllLifts(): void {
    this.litkomservice.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }
}
