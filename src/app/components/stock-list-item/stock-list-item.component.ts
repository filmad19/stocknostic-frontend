import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Stock} from "../../shared/Stock";
import {ModalController} from "@ionic/angular";
import {StockDetailCardComponent} from "../stock-detail-card/stock-detail-card.component";
import {FavouriteService} from "../../services/favourite.service";

@Component({
  selector: 'app-stock-list-item',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],

})

export class StockListItemComponent implements OnInit {
  @Input() stock: Stock | any;

  constructor(private router: Router,
              private modalController: ModalController,
              private favouriteService: FavouriteService) { }

  ngOnInit() {

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
        stock: this.stock
      }
    });
    return await modal.present();
  }
}
