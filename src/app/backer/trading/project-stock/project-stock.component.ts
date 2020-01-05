import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import * as wjcChartFinance from 'wijmo/wijmo.angular2.chart.finance';
import { FinancialChartType } from 'wijmo/wijmo.chart.finance';

import ProjectModel from 'app/projects/models/ProjectModel';
import { AskBidInfo, AskBidListInfo, StockHistoryInfo } from 'app/projects/models/trading-model';
import { TradingService } from 'app/projects/trading.service';
import { CandleChartModel, StockInfo } from 'app/projects/models/candle-chart-model';
import { ChartElement, ChartType, IRenderEngine, Position, TickMark } from 'wijmo/wijmo.chart';


@Component({
  selector: 'app-project-stock',
  templateUrl: './project-stock.component.html',
  styleUrls: ['./project-stock.component.scss'],
  providers: [
    ProjectsService, PaginationMethods,
  ],
})
export class ProjectStockComponent implements OnInit, OnDestroy {
  project: ProjectModel;
  orderType: string;
  askForm: FormGroup;
  bidForm: FormGroup;
  orderTypeList: SelectItem[] = [
    {value: 'market', label: 'Market'},
    {value: 'limit', label: 'Limit Price'},
  ];
  objKeyMessageAsk: any;
  objKeyMessageBid: any;
  askListInfo: AskBidListInfo[] = [];
  bidListInfo: AskBidListInfo[] = [];
  pageSize = 5;
  count: number;
  stockHistoryInfoList: StockHistoryInfo[] = [];
  day = 1;
  dayItem: SelectItem[] = [
    {value: 1, label: '1 Day'},
    {value: 2, label: '2 Day'},
    {value: 3, label: '3 Day'},
    {value: 7, label: '1 Week'},
    {value: 30, label: '1 Month'},
  ];
  chartTypeList: SelectItem[] = [
    {value: FinancialChartType.Candlestick, label: 'Candlestick'},
    {value: FinancialChartType.Line, label: 'Line'},
  ];
  chartFormatting = {
    chartType: FinancialChartType.Candlestick,
    mainYAxisPosition: Position.Right,
    mainYAxisMin: 0,
    mainYAxisMax: 0,
    volumeSeriesChartType: FinancialChartType.Column,
    volumeSeriesAxisYTickMark: TickMark.None,
    volumeSeriesAxisYMax: 0,
  };
  currentPoint: StockInfo = null;
  movingChart = false;
  movingChartPrevX = null;
  shares: number;
  private askbidInfo: AskBidInfo;
  private searchText: '';
  private chartData: CandleChartModel;
  private timer: any;
  private currentPageStockHistory = 1;
  private readonly projectId: number;
  private readonly exchanges_type: string;

  @ViewChild('flexChart') private flexChart: wjcChartFinance.WjFinancialChart;

  constructor(
    private projectsService: ProjectsService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private askFb: FormBuilder,
    private bidFb: FormBuilder,
    private paginationMethods: PaginationMethods,
    private tradingService: TradingService,
  ) {
    this.projectId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
    this.exchanges_type = this.activatedRoute.snapshot.params['pagename'];
    this.project = new ProjectModel();
    this.askbidInfo = new AskBidInfo();
    this.orderType = 'market';
    this.chartData = new CandleChartModel();

    const aPrice = askFb.group({
      amount: [''],
      currency: [''],
    });

    this.askForm = askFb.group({
      exchange_type: ['', Validators.required],
      project: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      // price: [''],
      order_type: [''],
      limit_price: aPrice,
      // ask_by: ['', Validators.required]
    });

    const bPrice = bidFb.group({
      amount: [''],
      currency: [''],
    });

    this.bidForm = bidFb.group({
      exchange_type: ['', Validators.required],
      project: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      // price: [''],
      order_type: [''],
      limit_price: bPrice,
      // bid_by: ['']
    });
  }

  ngOnInit(): void {
    this.flexChart.tooltip.content = '';

    this.flexChart.hostElement.addEventListener('mousedown', (e) => {
      this.movingChart = true;
      this.movingChartPrevX = e.clientX;
    });

    this.flexChart.hostElement.addEventListener('mousemove', (e) => {
      const ht = this.flexChart.hitTest(e);

      if (ht.chartElement === ChartElement.PlotArea || ht.chartElement === ChartElement.AxisX) {
        if (this.movingChart) {
          const diff = this.movingChartPrevX - e.clientX;
          this.movingChartPrevX = e.clientX;

          const plotArea: any = document.querySelector('.wj-plot-area');
          const plotAreaWidth: number = plotArea.getBBox().width;

          this.applyOffsetAxis(this.flexChart.axisX, diff / plotAreaWidth);
        }
      } else {
        this.movingChart = false;
      }

      if (ht.pointIndex !== null && (ht.chartElement === ChartElement.PlotArea || ht.chartElement === ChartElement.AxisX)) {
        this.currentPoint = ht.item;
      } else {
        this.currentPoint = null;
      }
    });

    this.flexChart.hostElement.addEventListener('mouseup', () => {
      this.movingChart = false;
    });

    this.flexChart.hostElement.addEventListener('mouseleave', () => {
      this.movingChart = false;
    });

    this.getProject();
    this.reloadStockInformationChartData();
    this.getTradeDetails(1);
    this.setAskValues();
    this.setBidValues();

    this.timer = setInterval(() => {
      this.getTradeDetails(this.currentPageStockHistory);
    }, 30000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  saveAsk(frm) {
    if (frm.valid) {
      this.tradingService.postAsk(frm.value).subscribe((obj) => {
          this.resetForm();
          this.getTradeDetails(1);
        },
        (errorMsg: any) => {
          this.objKeyMessageAsk = errorMsg;
          this.checkForErrors(errorMsg, frm);
        });
    } else {
      this.validateAllFormFields(frm);
    }
  }

  saveBid(frm) {
    if (frm.valid) {
      this.tradingService.postBid(frm.value).subscribe((obj) => {
          this.resetForm();
          this.getTradeDetails(1);
        },
        (errorMsg: any) => {
          this.objKeyMessageBid = errorMsg;
          this.checkForErrors(errorMsg, frm);
        });
    } else {
      this.validateAllFormFields(frm);
    }
  }

  onChangeOrderType(event) {
    this.resetForm();
    const bidAControl = this.bidForm.controls.limit_price as FormGroup;
    const askAControl = this.askForm.controls.limit_price as FormGroup;
    if (event.value === 'limit') {
      bidAControl.controls.amount.setValidators([Validators.required, Validators.min(1)]);
      this.bidForm.controls.order_type.setValue(event.value);
      askAControl.controls.amount.setValidators([Validators.required, Validators.min(1)]);
      this.askForm.controls.order_type.setValue(event.value);
    } else {
      bidAControl.controls.amount.clearValidators();
      bidAControl.controls.amount.setErrors(null);
      bidAControl.controls.amount.setValidators(null);
      askAControl.controls.amount.clearValidators();
      askAControl.controls.amount.setErrors(null);
      askAControl.controls.amount.setValidators(null);
    }
  }

  refreshStockHistoryList(newPage) {
    if (newPage) {
      this.currentPageStockHistory = newPage;

      this.tradingService.getStockHistoryList(newPage, this.pageSize, this.searchText, this.projectId, this.exchanges_type)
        .subscribe((listInfo: any) => {
          this.stockHistoryInfoList = listInfo['results'];
          this.count = listInfo['count'];
        });
    }
  }

  reloadStockInformationChartData() {
    this.tradingService.getCandleChartData(this.projectId, this.day, this.exchanges_type)
      .subscribe((listInfo: any) => {
        this.chartData = listInfo;

        const volumeValues = this.chartData.stock_info.map(item => item.volume);
        this.chartFormatting.volumeSeriesAxisYMax = Math.max(...volumeValues) * 4;

        const prices = [];
        this.chartData.stock_info.forEach(value => {
          prices.push(value.open);
          prices.push(value.close);
          prices.push(value.high);
          prices.push(value.low);
        });

        this.chartFormatting.mainYAxisMin = Math.min(...prices) * (9 / 10);
        this.chartFormatting.mainYAxisMax = Math.max(...prices) * (10 / 9);
      }, () => {
        this.chartData = new CandleChartModel();
        this.chartFormatting.volumeSeriesAxisYMax = 0;
        this.chartFormatting.mainYAxisMin = 0;
        this.chartFormatting.mainYAxisMax = 0;
      });
  }

  cancelOrder(item, type) {
    if (type === 'bid') {
      this.tradingService.updateBid(item.id, {'lots_pending': 0, 'is_closed': true}).subscribe((obj) => {
        this.getTradeDetails(this.currentPageStockHistory);
      }, (error) => {
        console.error(error);
      });
    } else {
      this.tradingService.updateAsk(item.id, {'lots_pending': 0, 'is_closed': true}).subscribe((obj) => {
        this.getTradeDetails(this.currentPageStockHistory);
      }, (error) => {
        console.error(error);
      });
    }
  }

  customItemFormatter(engine: IRenderEngine, ht, defaultRenderer) {
    // render element as usual
    if (ht.chartElement === ChartElement.SeriesSymbol) {
      engine.strokeWidth = 1;

      if (ht.series.binding === 'volume') {
        // Volume series formatting
        if (ht.item.close > ht.item.open) {
          engine.fill = '#ffb6b4';
          engine.stroke = '#ffb6b4';
        } else {
          engine.fill = '#b9d1fc';
          engine.stroke = '#b9d1fc';
        }
      } else {
        // Main series formatting
        engine.stroke = '#272ae4';

        if (ht.item.close > ht.item.open) {
          engine.fill = '#fe5f5b';
        } else {
          engine.fill = '#669bf9';
        }
      }
    }

    defaultRenderer();
  }

  zoomChart(factor: number) {
    this.applyZoomAxis(this.flexChart.axisX, factor, null);
  }

  filterEmptyValues(data: StockInfo[]) {
    return data.map(item => {
      if (item.volume === 0) {
        item.high = null;
        item.close = null;
        item.low = null;
        item.open = null;
      }

      return item;
    });
  }

  private getProject() {
    this.projectsService.getPublished(this.projectId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
      });
  }

  private setAskValues() {
    this.askForm.setValue({
      exchange_type: this.exchanges_type,
      project: this.projectId,
      quantity: '',
      // price: [''],
      order_type: this.orderType,
      limit_price: {
        amount: '',
        currency: 'USD',
      },
    });
  }

  private setBidValues() {
    this.bidForm.setValue({
      exchange_type: this.exchanges_type,
      project: this.projectId,
      quantity: '',
      // price: [''],
      order_type: this.orderType,
      limit_price: {
        amount: '',
        currency: 'USD',
      },
    });
  }

  private resetForm() {
    this.objKeyMessageBid = this.objKeyMessageAsk = undefined;
    this.bidForm.reset();
    this.askForm.reset();
    this.setAskValues();
    this.setBidValues();
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({onlySelf: true});

      if (field === 'limit_price') {
        const subControl = control as FormGroup;
        Object.keys(subControl.controls).forEach(subField => {
          const controlInternal = subControl.get(subField);
          controlInternal.markAsTouched({onlySelf: true});
        });
      }
    });
  }

  private checkForErrors(errorMsg, form?: FormGroup) {
    const newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr) : console.error(err);
      // : form.controls['common'].setErrors(newErr);
    });
  }

  private getTradeDetails(newPage) {
    if (newPage) {
      this.currentPageStockHistory = newPage;

      this.tradingService.getTradeDetails(newPage, this.pageSize, this.searchText, this.projectId, this.exchanges_type)
        .subscribe((listInfo: any) => {
          this.shares = listInfo['shares_quantity'];
          this.bidListInfo = listInfo['bids'] as AskBidListInfo[];
          this.askListInfo = listInfo['asks'] as AskBidListInfo[];
          this.stockHistoryInfoList = listInfo['stock_history']['results'];
          this.count = listInfo['stock_history']['count'];
        });
    }
  }

  private applyZoomAxis(axis, factor: number = null, center: number = null) {
    if (factor === null) { // reset
      axis.min = axis.max = null;
    } else {
      const min = (axis.min != null ? axis.min : axis.actualMin).valueOf();
      const max = (axis.max != null ? axis.max : axis.actualMax).valueOf();

      if (center == null) {
        center = (min + max) / 2;
      }

      axis.min = center - (center - min) * factor;
      axis.max = center + (max - center) * factor;
    }
  }

  private applyOffsetAxis(axis, offset: number) {
    const min = (axis.min != null ? axis.min : axis.actualMin).valueOf();
    const max = (axis.max != null ? axis.max : axis.actualMax).valueOf();

    const diff = max - min;
    const offsetValue = diff * offset;

    axis.min = min + offsetValue;
    axis.max = max + offsetValue;
  }
}
