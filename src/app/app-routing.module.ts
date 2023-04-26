import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {StockDetailCardComponent} from "./components/stock-detail-card/stock-detail-card.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: (
    ) => import('../app/pages/home/home.module').then(m => m.HomePageModule)
  },
  { path: 'app-stock-list-item', component: StockDetailCardComponent },
  { path: 'app-stock-detail-card', component: StockDetailCardComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
