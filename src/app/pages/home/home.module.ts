import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {StockDetailCardComponent} from "../../components/stock-detail-card/stock-detail-card.component";
import {NgChartsModule} from "ng2-charts";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgChartsModule
  ],
    exports: [
        StockDetailCardComponent
    ],
    declarations: [HomePage, StockDetailCardComponent]
})
export class HomePageModule {}
