import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Stock} from "../../shared/Stock";
import {ModalController} from "@ionic/angular";
import {StockDetailCardComponent} from "../stock-detail-card/stock-detail-card.component";
import {StockDataService} from "../../services/stock-data.service";
import {PricePoint} from "../../shared/PricePoint";
import {Interval} from "../../shared/Interval";
import {FavouriteService} from "../../services/favourite.service";

@Component({
  selector: 'app-stock-list-item',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],

})

export class StockListItemComponent implements OnInit {
  stockPercentageGain: string = '';
  percentageStyle: string = 'font-bold text-right'

  @Input() stock: Stock | any;

  constructor(private router: Router,
              private modalController: ModalController,
              private stockDataService: StockDataService,
              private favouriteService: FavouriteService) { }


  ngOnInit() {
    this.calcPercentage()
  }

  calcPercentage(){

      this.stockDataService.getStockPriceHistory(this.stock.symbol, Interval.day).subscribe(response => {
        let data = response.map((entry: PricePoint) => entry.close);
        // console.log("All Data: ", data)
        // console.log("Last Price: ", data[0])
        // console.log("current Price: ", data[data.length - 1])

        this.stock.previousClosePrice = data[data.length - 1].toFixed(2);
        let difference: number = (data[data.length - 1] - data[0]);
        let percent: number =  (difference / data[0] ) * 100;
        this.stockPercentageGain = percent.toFixed(3);

        if (percent < 0){
          this.percentageStyle =  'font-bold text-right '
          this.percentageStyle += 'text-red-700'
        }else {
          this.percentageStyle =  'font-bold text-right '
          this.percentageStyle += 'text-green-500'
        }
      });
  }
  toggleLike() {
    this.favouriteService.toggleLiked(this.stock);
    this.stock.liked = !this.stock.liked;
  }

  async openModal() {
    console.log(this.stock)
    const modal = await this.modalController.create({
      component: StockDetailCardComponent,
      componentProps: {
        stock: this.stock,
        stockPercentageGain: this.stockPercentageGain
      }
    });
    return await modal.present();
  }
}
