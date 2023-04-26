import { Component, OnInit } from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  searchResults: any = [];

  constructor(private stockDataService: StockDataService,private http: HttpClient) { }

  ngOnInit() {
    this.stockDataService.webSocket();
  }


  searchStock($event: any) {
    console.log($event.target.value)
    this.http.get('http://localhost:8080/api/stock/search?q=' + $event.target.value)
      .subscribe(response => {
        this.searchResults = response;
        console.log(this.searchResults)
      }, error => {
        console.error(error); // Handle any errors here
      });

  }
}
