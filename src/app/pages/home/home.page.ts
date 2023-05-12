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
              private userService: UserService,) { }

  ngOnInit() {
    // this.stockDataService.webSocket();
    this.userService.login()
    this.displayFavourites();
  }

  searchStock($event: any) {
    this.stockDataService.searchStocks($event.target.value).subscribe(response => {
        this.stockList = response;
    })
  }

  displayFavourites(){
    this.stockDataService.getFavouriteStocks().subscribe(response => {
      this.stockList = response;
    });
  }
}
