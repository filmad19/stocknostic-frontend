import { Component, OnInit } from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  stocks: number[] = [1, 2, 3, 4, 5, 6, 7];

  constructor(private stockDataService: StockDataService) { }

  ngOnInit() {
    this.stockDataService.getAllStocks().subscribe(stocks => {
      console.log(stocks)
    })
  }

}
