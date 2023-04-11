import { Component, OnInit } from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss'],
})
export class StockCardComponent  implements OnInit {

  constructor(
    private stockDataService: StockDataService
  ) { }

  ngOnInit() {
    this.stockDataService.testBackend().subscribe(test => {
      console.log(test)
    });
  }
}
