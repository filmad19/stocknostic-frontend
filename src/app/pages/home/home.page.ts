import { Component, OnInit } from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {Stock} from "../../shared/Stock";
import {UserService} from "../../services/user.service";
import {UpdateStockListService} from "../../services/update-stock-list.service";

/*
* Matthias Filzmaier
* 21.04.2023
* stocknostic
*/

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  stockList: Stock[] = [];

  constructor(private stockDataService: StockDataService,
              private userService: UserService,
              private updateStockListService: UpdateStockListService,) { }

  ngOnInit() {
    this.userService.login().subscribe(token => {
      localStorage.setItem('access_token', token.value)
      this.loadList();
    });

    this.updateStockListService.likedEvent.subscribe(selectedStock => {
      if(!selectedStock.liked){
        this.stockList = this.stockList.filter(stock => stock.symbol != selectedStock.symbol)
      }
    });
  }

  searchStock($event: any) {
    this.stockDataService.searchStocks($event.target.value).subscribe(response => {
      this.stockList = response;
      this.stockDataService.openWebSocket(this.stockList);
    })
  }

  loadList() {
    this.stockDataService.searchStocks("").subscribe(response => {
      this.stockList = response;
      this.stockDataService.openWebSocket(this.stockList);
    })
  }
}
