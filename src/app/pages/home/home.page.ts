import { Component, OnInit } from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {Stock} from "../../shared/Stock";
import {UserService} from "../../services/user.service";

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
              private userService: UserService) { }

  ngOnInit() {
    this.userService.login().subscribe(token => {
      localStorage.setItem('access_token', token.value)
      this.loadList();
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
