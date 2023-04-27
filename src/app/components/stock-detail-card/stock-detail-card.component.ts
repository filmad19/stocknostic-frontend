import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {ChartConfiguration, ChartOptions} from 'chart.js';
import {Interval} from "../../shared/Interval";
import {Router} from "@angular/router";
import {Stock} from "../../shared/Stock";
import {PricePoint} from "../../shared/PricePoint";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-stock-detail-card',
  templateUrl: './stock-detail-card.component.html',
  styleUrls: ['./stock-detail-card.component.scss'],
})

export class StockDetailCardComponent implements OnInit {
  constructor(private stockDataService: StockDataService,
              private router: Router,
              private modalCtrl: ModalController) {}

  stock: Stock | any;
  favourites: any = [];

  @ViewChild('canva') canvasRef: ElementRef | any;

  ngOnInit(){
    this.stock = history.state.data;
  }

  ngAfterViewInit() {
    let ctx = this.canvasRef.nativeElement.getContext('2d');

    this.stockDataService.getStockPriceHistory(this.stock.symbol, Interval.week).subscribe(response => {
      this.chartLabels = response.map((entry: PricePoint) => entry.timestamp);
      let data = response.map((entry: PricePoint) => entry.close);

      const gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, 'rgb(0,255,0)');
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

      this.chartData = [
        {
          label: '$',
          data: data,

          pointHitRadius: 15, // expands the hover 'detection' area
          pointHoverRadius: 8, // grows the point when hovered
          pointRadius: 0,

          borderColor: 'green', // main line color aka $midnight-medium from @riapacheco/yutes/seasonal.scss
          pointBackgroundColor: 'green',
          // pointHoverBackgroundColor: '$success',

          borderWidth: 2, // main line width
          hoverBorderWidth: 0, // borders on points
          pointBorderWidth: 0, // removes POINT borders
          tension: 0.3, // makes line more squiggly

          backgroundColor: gradient,

          scripts: "node_modules/chart.js/dist/Chart.min.js",
          allowedCommonJsDependencies: "chart.js",


        }
      ];
    });
  }


  chartLabels: string[] | any;
  chartData: ChartConfiguration<'line'>['data'] | any;
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        // ⤵️ tooltip main styles
        backgroundColor: 'white',
        displayColors: false, // removes unnecessary legend
        padding: 10,

        // ⤵️ title
        titleColor: '#2D2F33',
        titleFont: {
          size: 18
        },

        // ⤵️ body
        bodyColor: '#2D2F33',
        bodyFont: {
          size: 13
        }
      }
    },
  };

  goBack() {
    this.router.navigate(['./']);
    // return this.modalCtrl.dismiss(this.stock.liked, 'confirm');

  }

  toggleLike() {
    this.stock.liked = !this.stock.liked;

    if (this.stock.liked){
      this.favourites.push(this.stock);
    }else {
      this.favourites.splice(this.stock);
    }
    console.log("favourites" + this.favourites)
    console.log(this.stock)
  }
}
