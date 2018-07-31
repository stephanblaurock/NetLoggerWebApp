import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartItemData, СorporationInfo} from '../models/chartitemdata';
import {DxChartComponent} from 'devextreme-angular';
import {EnergyBalanceTest} from '../models/dashboards/energy-balance-test';
import {EnergyBalanceConfig, EnergyBalanceStatistik} from '../models/dashboards/energy-balance';
import * as moment from 'moment';
import {NLHelper} from '../models/nl-helper';
import {NetloggerService} from "../service/netlogger.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NetLoggerServiceCommands} from "../service/netlogger.service.commands";
import {Dashboard} from "../models/dashboard";
import notify from "devextreme/ui/notify";

@Component({
  selector: 'app-dashboard-energy-balance',
  templateUrl: './dashboard-energy-balance.component.html',
  styles: []
})
export class DashboardEnergyBalanceComponent implements OnInit, OnChanges {
  // @ViewChild('chart_day') chart: DxChartComponent;
  // @ViewChild('datepicker') datepicker: BsDatepickerComponent;
  isAdmin = false;
  commonChartHeight: '280';
  @Input() isEmbedded = false;        // true, wenn das Dashboard embedded ist und die Config von aussen bekommt. Andernfalls muss die Config über die URL geladen werden
  @Input() cust_id = 0;
  dashboard_id = 0;
  dashboard: Dashboard;
  @Input() chartConfig: EnergyBalanceConfig;
  showChartLeistung = false;
  showChartArbeit = false;
  chartData: EnergyBalanceStatistik;
  valueAxis_Day: any[];
  seriesOptions_Day: any[];
  chartData_Leistung: any[];
  currentVerbrauch = 0;
  currentEnergieflussColor = '#000000';
  currentEnergieflussLabel = 'Bezug/Einspeisung';
  // pieChartData_Day: any[];
  // pieChartPalette_Day: any[];
  valueAxis_Year: any[];
  seriesOptions_Year: any[];
  chartData_Arbeit: any[];
  currentDateLeistung = new Date();
  currentDateArbeit = new Date();
  datePickerOpened = false;
  classNameYearButton = 'btn btn-dark';
  classNameMonthButton = 'btn action-button';
  currentArbeitZeitraum = '2000';
  currentArbeitType = 'month';
  currentYear = new Date().getFullYear();
  currentMonthIndex = new Date().getMonth();
  monthNames = NLHelper.monthNames;
  seriesOptions_Sum: any[];
  chartData_Sum: any[];
  sum_value = 0;
  sum_value_unit = '';
  verbrauch_palette = ['#F7AD51', '#4076A6'];

  private parentRoute: any;
  private currentRoute: any;

  constructor(private netLoggerService: NetloggerService, private router: Router, private route: ActivatedRoute) {
    this.isAdmin = this.netLoggerService.currentUserIsAdmin();    // this.netLoggerService.current_user_name === 'admin@netlogger.eu';
  }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.currentMonthIndex = new Date().getMonth();
    this.refreshCurrentArbeitZeitraumLabel();

    // Im Embedded-Modus wir die Konfiguration über die URL abgerufen
    if (!this.isEmbedded) {
      this.parentRoute = this.route.parent.params.subscribe(params => {
        this.cust_id = +params['id'];
      });
      this.currentRoute = this.route.params.subscribe(params => {
        this.dashboard_id = +params['id'];
      });
      console.log('Dashboard ist nicht embedded! custid:' + this.cust_id.toString() + ' dashboardid:' + this.dashboard_id.toString());
      this.reloadDashboard();
    }


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartConfig']) {
      this.applyConfig();
      this.reloadChartData();
    }
  }

  reloadDashboard() {
    if (this.cust_id === 0) {
      return;
    }
    if (!this.dashboard_id || this.dashboard_id === 0 || this.dashboard_id === null) {
      this.chartConfig = EnergyBalanceTest.createConfigSPN();
      this.applyConfig();
      this.reloadChartData();
      return;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getDashboard(this.cust_id, this.dashboard_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.dashboard = JSON.parse(data.ReturnValue);
          let dc = new EnergyBalanceConfig();
          dc = Object.assign(dc, this.dashboard.config);
          dc.validate();
          this.chartConfig = dc;
          // console.log('folgende Config kam vom Server:');
          // console.log(this.chartConfig);
          this.netLoggerService.setHeadline(this.dashboard.caption);
          this.applyConfig();
          this.reloadChartData();
        }
      });
  }

  applyConfig() {
    if (this.chartConfig) {
      this.chartConfig.year_arbeit = this.currentYear;
      this.chartConfig.month_arbeit = this.currentMonthIndex + 1;
      this.chartConfig.date_leistung = this.currentDateLeistung;
      this.showChartLeistung = this.chartConfig.devices_leistung && this.chartConfig.devices_leistung.length > 0;
      this.showChartArbeit = this.chartConfig.devices_arbeit && this.chartConfig.devices_arbeit.length > 0;
      // this.chartConfig = EnergyBalanceTest.createConfigSPN();
      this.valueAxis_Day = this.chartConfig.createValueAxisLeistung();
      this.seriesOptions_Day = this.chartConfig.createSeriesOptionsLeistung();
      // this.pieChartPalette_Day = this.chartConfig.createPieSeriesPalette();
      this.valueAxis_Year = this.chartConfig.createValueAxisArbeit();
      this.seriesOptions_Year = this.chartConfig.createSeriesOptionsArbeit(false);
      this.seriesOptions_Sum = this.chartConfig.createSeriesOptionsArbeit(true);
      if (this.chartConfig.verbrauch_maxvalue === 0) {
        this.chartConfig.verbrauch_maxvalue = 100;
      }

      if (this.chartConfig.hasEinspeisungLeistung()) {
        this.verbrauch_palette = ['#F7AD51', '#4076A6'];
      } else {
        this.verbrauch_palette = ['#4076A6'];
      }
    }
  }

  reloadChartData() {
    if (this.chartConfig == null || this.cust_id === 0)
      return;
    this.chartConfig.date_leistung = moment(this.currentDateLeistung).utc(true).toDate();
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getDashboardData(this.cust_id, this.chartConfig)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          // console.log('Rückgabe GetDashboardData:');
          // console.log(data.ReturnValue);
          this.chartData = JSON.parse(data.ReturnValue);
          console.log(this.chartData);
          if (this.chartConfig.parameter.calculate_leistung) {
            this.chartData_Leistung = this.chartData.leistung_chart_data; // this.chartData.leistung_data.chart_data;
            this.currentVerbrauch = this.chartData.leistung_data[0].current_leistung;
            this.currentEnergieflussLabel = this.currentVerbrauch >= 0 ? 'Bezug' : 'Einspeisung';
            this.currentEnergieflussColor = this.currentVerbrauch >= 0 ? '#4076A6' : '#F7AD51';
          }
          if (this.chartConfig.parameter.calculate_arbeit) {
            this.chartData_Arbeit = this.chartData.arbeit_chart_data;   // this.chartData.arbeit_data.chart_data;
            this.chartData_Sum = this.chartData.arbeit_gesamt_chart_data; // this.chartData.arbeit_gesamt_data.chart_data;
            this.sum_value = this.chartData.arbeit_gesamt_data[0].sum_value;
            this.sum_value_unit = this.chartData.arbeit_gesamt_data[0].sum_value_unit;
          }
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  setCounterCorrections() {
    const ccArr = [];
    ccArr.push({device_id: 33, time_stamp: new Date('2017-10-27'), correction: -493368});
    ccArr.push({device_id: 35, time_stamp: new Date('2017-10-27'), correction: -47030});
    ccArr.push({device_id: 1, time_stamp: new Date('2017-10-12'), correction: -17085.5284});
    ccArr.push({device_id: 3, time_stamp: new Date('2017-10-13'), correction: -0.0699});
    ccArr.push({device_id: 23, time_stamp: new Date('2017-10-13'), correction: -114988.8788});
    ccArr.push({device_id: 25, time_stamp: new Date('2017-10-13'), correction: -37298.6739});
    ccArr.push({device_id: 27, time_stamp: new Date('2017-10-13'), correction: -35498.093});
    for (const mycmd of ccArr) {
      const cmd = NetLoggerServiceCommands.setCounterCorrection(14, mycmd);
      this.netLoggerService.doCommand(cmd).subscribe(
        data => {
          console.log(data);
        }
      );
    }
  }

  customizeLabel(arg) {
    return arg.argumentText + '(' + arg.percentText + ')';
  }


  backwardLeistungClicked() {
    this.currentDateLeistung = moment(this.currentDateLeistung).add(-1, 'days').toDate();
    this.chartConfig.date_leistung = this.currentDateLeistung;
    this.chartConfig.parameter.calculate_leistung = true;
    this.chartConfig.parameter.calculate_arbeit = false;
    this.reloadChartData();
  }

  onCurrentDateLeistungChanged($event) {
    console.log($event);
    this.currentDateLeistung = $event.value;
    this.chartConfig.date_leistung = this.currentDateLeistung;
    this.chartConfig.parameter.calculate_leistung = true;
    this.chartConfig.parameter.calculate_arbeit = false;
    this.reloadChartData();
  }

  forwardLeistungClicked() {
    this.currentDateLeistung = moment(this.currentDateLeistung).add(1, 'days').toDate();
    this.chartConfig.date_leistung = this.currentDateLeistung;
    this.chartConfig.parameter.calculate_leistung = true;
    this.chartConfig.parameter.calculate_arbeit = false;
    this.reloadChartData();
  }

  refreshChartLeistung() {
    // sicherstellen, daß auch die Summenwerte berechnet sind
    this.netLoggerService.doCommand(NetLoggerServiceCommands.calculateSummen(this.cust_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.chartConfig.parameter.calculate_leistung = true;
          this.chartConfig.parameter.calculate_arbeit = false;
          this.reloadChartData();
        }
      }
    );
  }

  calculateSummen() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.calculateSummen(this.cust_id)).subscribe(
      data => {
        notify(data.ReturnMessage);
      }
    );
  }

  backwardArbeitClicked() {
    if (this.currentArbeitType === 'year') {
      this.currentYear--;
    } else {
      if (this.currentMonthIndex > 0) {
        this.currentMonthIndex--;
      } else {
        // auf letztes Jahr in den Dezember springen
        this.currentYear--;
        this.currentMonthIndex = 11;
      }
    }
    this.refreshCurrentArbeitZeitraumLabel();
    this.chartConfig.current_arbeit_range = this.currentArbeitType;
    this.chartConfig.year_arbeit = this.currentYear;
    this.chartConfig.month_arbeit = this.currentMonthIndex + 1;
    this.chartConfig.parameter.calculate_leistung = false;
    this.chartConfig.parameter.calculate_arbeit = true;
    this.reloadChartData();
  }

  yearClicked() {
    this.classNameYearButton = 'btn action-button';
    this.classNameMonthButton = 'btn btn-dark';
    this.currentArbeitType = 'year';
    this.refreshCurrentArbeitZeitraumLabel();
    this.chartConfig.current_arbeit_range = this.currentArbeitType;
    this.chartConfig.parameter.calculate_leistung = false;
    this.chartConfig.parameter.calculate_arbeit = true;
    this.reloadChartData();
  }

  monthClicked() {
    this.classNameYearButton = 'btn btn-dark';
    this.classNameMonthButton = 'btn action-button';
    this.currentArbeitType = 'month';
    this.refreshCurrentArbeitZeitraumLabel();
    this.chartConfig.current_arbeit_range = this.currentArbeitType;
    this.chartConfig.parameter.calculate_leistung = false;
    this.chartConfig.parameter.calculate_arbeit = true;
    this.reloadChartData();
  }

  forwardArbeitClicked() {
    if (this.currentArbeitType === 'year') {
      this.currentYear++;
    } else {
      if (this.currentMonthIndex < 11) {
        this.currentMonthIndex++;
      } else {
        // auf nächstes Jahr springen
        this.currentYear++;
        this.currentMonthIndex = 0;
      }
    }
    this.refreshCurrentArbeitZeitraumLabel();
    this.chartConfig.current_arbeit_range = this.currentArbeitType;
    this.chartConfig.year_arbeit = this.currentYear;
    this.chartConfig.month_arbeit = this.currentMonthIndex + 1;
    this.chartConfig.parameter.calculate_leistung = false;
    this.chartConfig.parameter.calculate_arbeit = true;
    this.reloadChartData();
  }

  refreshChartArbeit() {
    // sicherstellen, daß auch die Summenwerte berechnet sind
    this.netLoggerService.doCommand(NetLoggerServiceCommands.calculateSummen(this.cust_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.chartConfig.parameter.calculate_leistung = false;
          this.chartConfig.parameter.calculate_arbeit = true;
          this.reloadChartData();
        }
      }
    );
  }

  sendReport() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.sendDashboardReport(this.cust_id, this.dashboard_id, this.chartConfig.date_leistung)).subscribe(
      data => {
       notify(data.ReturnMessage);
      }
    );
  }

  refreshCurrentArbeitZeitraumLabel() {
    if (this.currentArbeitType === 'year') {
      this.currentArbeitZeitraum = this.currentYear.toString();
    } else {
      this.currentArbeitZeitraum = this.monthNames[this.currentMonthIndex] + ' ' + this.currentYear.toString();
    }
  }

  getFormattedDate(dateString: Date) {
    return moment(dateString).format('DD.MM.YYYY');
  }
}
