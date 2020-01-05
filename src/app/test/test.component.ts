
import { Component, OnInit, ViewChild } from '@angular/core';
import { Message, DropdownModule, SelectItem } from 'primeng/primeng';

import * as wjcChartFinance from 'wijmo/wijmo.angular2.chart.finance';
import * as wjcChartFinance1 from 'wijmo/wijmo.angular2.chart.finance.analytics';
import * as wjcGridSheet from 'wijmo/wijmo.grid.sheet';
import { FinancialChartType } from 'wijmo/wijmo.chart.finance';
import * as wijmo from 'wijmo/wijmo';
import { WebSocketService } from 'app/common/services/webSocket.service';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})


export class TestComponent implements OnInit {
  msgs: Message[] = [];
  cities1: SelectItem[];
  // cities:{id:number,title:string}[];
  // cities3:City[];

  wsMessage: any;
  //wsURL = 'ws://10.0.1.139:5000/ws/';

  cities: City[];

  brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];
  brand: string;
  filteredBrands: any[];

  returninform: { label: string, value: string }[];

  @ViewChild('flexChart') flexChart: wjcChartFinance.WjFinancialChart;
  @ViewChild('flexSheet') flexSheet: wjcGridSheet.FlexSheet;
  data = [
    { close: 73.23, date: "01/23/15", high: 74.73, low: 70.16, open: 70.2, volume: 42593223 },
    { close: 76.15, date: "01/06/15", high: 77.59, low: 75.36, open: 77.23, volume: 27399288 },
    { close: 76.15, date: "01/07/15", high: 77.36, low: 75.82, open: 76.76, volume: 22045333 },
    { close: 78.18, date: "01/08/15", high: 78.23, low: 76.08, open: 76.74, volume: 23960953 },
    { close: 77.74, date: "01/09/15", high: 78.62, low: 77.2, open: 78.2, volume: 21157007 },
    { close: 76.72, date: "01/12/15", high: 78, low: 76.21, open: 77.84, volume: 19190194 },
    { close: 76.45, date: "01/13/15", high: 78.08, low: 75.85, open: 77.23, volume: 25179561 },
    { close: 76.28, date: "01/14/15", high: 77.2, low: 76.03, open: 76.42, volume: 25918564 },
    { close: 74.05, date: "01/15/15", high: 76.57, low: 73.54, open: 76.4, volume: 34133974 },
    { close: 75.18, date: "01/16/15", high: 75.32, low: 73.84, open: 74.04, volume: 21791529 },
    { close: 76.24, date: "01/20/15", high: 76.31, low: 74.82, open: 75.72, volume: 22821614 }


  ]

  //demo: wjcChartFinance1.

  constructor(private ws: WebSocketService) {
    this.cities1 = [
      { label: 'Select City', value: null },
      { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
      { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
      { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
      { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
      { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    ];
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    // this.cities = [
    //   {id:1,title:'A'},
    //   {id:2,title:'B'},
    //   {id:3,title:'C'},
    //   {id:4,title:'D'},
    //   {id:5,title:'E'}
    // ]

    // this.cities3 = [
    //   {code:1,name:'A'},
    //   {code:2,name:'B'},
    //   {code:3,name:'C'},
    //   {code:4,name:'D'},
    //   {code:5,name:'E'}
    // ]

    this.returninform = [
      { label: 'Stock', value: 'stock' },
      { label: 'Pref_Stocks', value: 'pref_Stocks' }
    ];
  }

  ngOnInit(): void {
    // this.ws.connect(this.wsURL).subscribe((msg) => {
    //   console.log('yakko web socket response', msg,JSON.parse(msg.data)['message']);
    //   this.wsMessage = JSON.parse(msg.data)['message'];

    //   let textArea = (<HTMLInputElement>document.getElementById('textarea'));

    //   const offset = JSON.parse(msg.data)['message'].length - textArea.value.length;
    //     const selection = {start: textArea.selectionStart, end: textArea.selectionEnd};
    //     const startsSame = JSON.parse(msg.data)['message'].startsWith(textArea.value.substring(0, selection.end));
    //     const endsSame = JSON.parse(msg.data)['message'].endsWith(textArea.value.substring(selection.start));
    //     textArea.value = JSON.parse(msg.data)['message'];
    //     if (startsSame && !endsSame) {
    //         textArea.setSelectionRange(selection.start, selection.end);
    //     } else if (!startsSame && endsSame) {
    //         textArea.setSelectionRange(selection.start + offset, selection.end + offset);
    //     } else { // this is what google docs does...
    //         textArea.setSelectionRange(selection.start, selection.end + offset);
    //     }
    // });

    //this.flexChart.chartType = wijmo.chart.finance.FinancialChartType.Line
    this.flexChart.header = "Test Candle Chart";

    //this.flexChart rangeSelector: null

    this.flexChart.chartType = FinancialChartType.Candlestick;

    // this.flexChart.axisX.labels = false;
    // this.flexChart.axisX.axisLine = false;
    // this.flexChart.legend.position = 0;
    // this.flexChart.plotMargin = '60 30 0 50';
    this.flexChart.symbolSize = 4;
    let self = this;

    self.flexChart.tooltip.content = function (ht) {
      console.log(self);
      return 'Date: ' + ht.x + '<br/>' +
        'Open: ' + wijmo.Globalize.format(ht.item.open, 'n2') + '<br/>' +
        'High: ' + wijmo.Globalize.format(ht.item.high, 'n2') + '<br/>' +
        'Low: ' + wijmo.Globalize.format(ht.item.low, 'n2') + '<br/>' +
        'Close: ' + wijmo.Globalize.format(ht.item.close, 'n2') + '<br/>' +
        'Volume: ' + wijmo.Globalize.format(ht.item.volume, 'n0');
    };

    this.flexChart.itemsSource = this.data;
    this.flexChart.bindingX = 'date';
    //this.flexChart.binding = 'date';

    console.log(this.flexChart);
  }

  keyuptextarea()
  {
    let textarea = (<HTMLInputElement>document.getElementById('textarea')).value;
    // this.ws.connect(this.wsURL).next(textarea);
  }

  sendWebSocketMessage() {
    console.log('yakko button clicked', this.wsMessage);
    // this.ws.connect(this.wsURL).next(this.wsMessage);
  }

  filterBrands(event) {
    this.filteredBrands = [];
    for (let i = 0; i < this.brands.length; i++) {
      let brand = this.brands[i];
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredBrands.push(brand);
      }
    }
  }

  test(data) {
    console.log('yakkoo auto complete change', data);
  }

  search(event) {
    console.log('yakkoo auto complete type', event);
  }

  showSuccsess() {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Info Message', detail: 'PrimeNg rocks' });

    this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'PrimeNg rocks' });

  }

  /*stChart.tooltip.content = function (ht) {
     return 'Date: ' + ht.x + '<br/>' +
           'Open: ' + wijmo.Globalize.format(ht.item.open, 'n2') + '<br/>' +
           'High: ' + wijmo.Globalize.format(ht.item.high, 'n2') + '<br/>' +
           'Low: ' + wijmo.Globalize.format(ht.item.low, 'n2') + '<br/>' +
           'Close: ' + wijmo.Globalize.format(ht.item.close, 'n2') + '<br/>' +
           'Volume: ' + wijmo.Globalize.format(ht.item.volume, 'n0');
  };*/
}
