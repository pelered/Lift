import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from "rxjs";

export class PutovanjeDataSource extends MatTableDataSource<any> {
  private transactions: any[] = [];

  private transactions$: Subscription;

  constructor(transactions: Observable<any>) {
    super();
    this.transactions$ = transactions.subscribe(transactionList => {
      this.transactions.push(transactionList);
      this.data = this.transactions;
    });
  }

  disconnect() {
    this.transactions$.unsubscribe();
    super.disconnect();
  }
}