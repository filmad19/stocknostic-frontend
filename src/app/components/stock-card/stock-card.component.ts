import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {ChartConfiguration, ChartOptions} from 'chart.js';

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss'],
})
export class StockCardComponent  implements OnInit {
  constructor(private stockDataService: StockDataService) {}

  @ViewChild('canva') canvasRef: ElementRef | any;

  ngOnInit(){
    this.stockDataService.getAllStocks().subscribe(stocks => {
      console.log(stocks)
    })
  }

  ngAfterViewInit() {
    let ctx = this.canvasRef.nativeElement.getContext('2d');

    this.stockDataService.getStockData('BTCUSDT', "1m").subscribe(response => {
      this.chartLabels = response.map((entry: any) => entry[0] % 100_000 / 10_000);
      let data = response.map((entry: any) => entry[1]);

      const gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, 'rgb(0,255,0)');
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

      console.log(data)


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
}
