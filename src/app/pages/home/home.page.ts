import { Component, OnInit } from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {Stock} from "../../shared/Stock";
import {UserService} from "../../services/user.service";



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
    // this.stockDataService.webSocket();

    const access_token = localStorage.getItem('access_token');

    if (access_token == null || access_token == "null") {
      this.userService.fetchAccessToken().subscribe(token => {
        localStorage.setItem('access_token', token.value);
        this.loadList();
        return;
      })
    } else {
      this.loadList();
    }
  }

  searchStock($event: any) {
    this.stockDataService.searchStocks($event.target.value).subscribe(response => {
        this.stockList = response;
    })
  }

  loadList() {
    this.stockDataService.searchStocks("").subscribe(response => {
      this.stockList = response;
    })
  }
}
