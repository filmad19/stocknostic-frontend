import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {ChartConfiguration, ChartOptions} from 'chart.js';
import {Interval} from "../../shared/Interval";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stock-detail-card',
  templateUrl: './stock-detail-card.component.html',
  styleUrls: ['./stock-detail-card.component.scss'],
})

export class StockDetailCardComponent implements OnInit {
  constructor(private stockDataService: StockDataService, private router: Router) {}
  result: any;
  favourites: any = [];

  @ViewChild('canva') canvasRef: ElementRef | any;
  isLiked: boolean = false;

  ngOnInit(){
    this.result = history.state.data;
    this.isLiked = this.result.liked;
    console.log("detailed: " + this.result)
    this.stockDataService.searchStocks("Appl").subscribe(stocks => {
      console.log(stocks)
    })
  }

  ngAfterViewInit() {
    let ctx = this.canvasRef.nativeElement.getContext('2d');

    this.stockDataService.getStockPriceHistory('AAPL', Interval.listItem).subscribe(response => {
      this.chartLabels = response.map((entry: any) => entry.timestamp);
      let data = response.map((entry: any) => entry.close);

      console.log(response)


      console.log(this.chartData)

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
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.result.liked = this.isLiked;
    if (this.result.liked){
      this.favourites.push(this.result);
    }else {
      this.favourites.splice(this.result);
    }
    console.log("favourites" + this.favourites)
    console.log(this.result)
  }
}
