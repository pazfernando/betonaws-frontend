import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BetService } from './bet.service';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
})
export class BetComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  statsValues: { [key: string]: number } = { ballenita: 0, both: 0, playas: 0 };
  winner: string = 'both';
  mount: number = 0;
  processing = false;

  public barChartLegend = true;
  public barChartPlugins = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Ballenita FC', 'Empate', 'Club Playas'],
    datasets: [
      {
        data: [this.statsValues['ballenita'], this.statsValues['both'], this.statsValues['playas']],
        label: 'Bets USD',
        backgroundColor: ['#484888', '#808080', '#ed9202']
      }
    ],

  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  constructor(private betService: BetService) { }

  ngOnInit(): void {
    if (this.chart) {
      this.chart.legend = this.barChartLegend;
      this.chart.plugins = this.barChartPlugins;
      this.chart.data = this.barChartData;
      this.chart.options = this.barChartOptions;
    }

    this.update_chart();
  }
  ngOnDestroy(): void {

  }

  bet = () => {
    console.log('TODO send to API gateway');
    this.processing = true;
    this.betService
      .pushBet(this.winner, this.mount)
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => {
          console.error(e);
          this.processing = false;
        },
        complete: () => {
          console.info('bet complete.');
          this.processing = false;
          this.update_chart();
        }
      });
  };

  update_chart = () => {
    let pos = 0;
    let proms$ = new Array();
    ['ballenita', 'both', 'playas'].forEach((_winner) => {
      let prom$ = this.betService.getStats(_winner);
      proms$.push(prom$);
      prom$.then((_res) => {
        console.log(_winner + ' -> ' + _res.sum + ', pos=' + pos);
        this.statsValues[_winner] = _res.sum;
      });
    });
    Promise.all(proms$).then((_values) => {
      this.barChartData.datasets[0].data = [this.statsValues['ballenita'], this.statsValues['both'], this.statsValues['playas']];
      console.log(this.barChartData.datasets[0].data);
      this.chart?.update();
    });
  }

}

