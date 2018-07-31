import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NetloggerService} from '../service/netlogger.service';
import {EnergyBalanceTest} from '../models/dashboards/energy-balance-test';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import {Dashboard} from '../models/dashboard';
import {NLHelper} from '../models/nl-helper';
import {EnergyCountersConfig, EnergyCountersData, EnergyCountersTableItem} from '../models/dashboards/energy-counters';
import * as moment from 'moment';
import notify from "devextreme/ui/notify";

@Component({
  selector: 'app-dashboard-energy-counters',
  templateUrl: './dashboard-energy-counters.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class DashboardEnergyCountersComponent implements OnInit, OnChanges {
  isAdmin = false;
  commonChartHeight: '280';
  @Input() isEmbedded = false;        // true, wenn das Dashboard embedded ist und die Config von aussen bekommt.
                                      // Andernfalls muss die Config über die URL geladen werden
  @Input() cust_id = 0;
  dashboard_id = 0;
  dashboard: Dashboard;
  @Input() energyCountersConfig: EnergyCountersConfig;
  energyCountersData: EnergyCountersData;

  valueAxis_Arbeit: any[];
  seriesOptions_Arbeit: any[];
  chartData_Arbeit: any[];

  classNameYearButton = 'btn btn-dark';
  classNameMonthButton = 'btn action-button';
  currentArbeitZeitraum = '2000';
  currentArbeitType = 'month';
  currentYear = new Date().getFullYear();
  currentMonthIndex = new Date().getMonth();
  monthNames = NLHelper.monthNames;
  seriesOptions_Sum: any[];
  chartData_Sum: any[];

  pieChartData: any[];
  pieChartPalette: any[];
  verbrauch_palette = ['#F7AD51', '#4076A6'];

  verbrauch_table_max_value = 0;
  verbrauch_table: EnergyCountersTableItem[];
  private parentRoute: any;
  private currentRoute: any;

  constructor(private netLoggerService: NetloggerService, private router: Router, private route: ActivatedRoute) {
    this.isAdmin = this.netLoggerService.currentUserIsAdmin();
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

      this.reloadDashboard();
    }


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['energyCountersConfig']) {
      this.applyConfig();
      this.reloadChartData();
    }
  }

  reloadDashboard() {
    if (this.cust_id === 0) {
      return;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getDashboard(this.cust_id, this.dashboard_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.dashboard = JSON.parse(data.ReturnValue);
          if (this.dashboard) {
            let dc = new EnergyCountersConfig();
            dc = Object.assign(dc, this.dashboard.config);
            dc.validate();
            this.energyCountersConfig = dc;
            // console.log('folgende Config kam vom Server:');
            // console.log(this.chartConfig);
            this.netLoggerService.setHeadline(this.dashboard.caption);
            this.applyConfig();
            this.reloadChartData();
          }
        }
      });
  }

  applyConfig() {
    if (this.energyCountersConfig) {
      this.energyCountersConfig.year = this.currentYear;
      this.energyCountersConfig.month = this.currentMonthIndex + 1;
      this.energyCountersConfig.date_range = this.currentArbeitType;
      // this.pieChartPalette_Day = this.chartConfig.createPieSeriesPalette();
      this.valueAxis_Arbeit = this.energyCountersConfig.createValueAxisArbeit();
      this.seriesOptions_Arbeit = this.energyCountersConfig.createSeriesOptionsArbeit(false);
    }
  }

  reloadChartData() {
    if (this.energyCountersConfig == null || this.cust_id === 0) {
      return;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getDashboardData(this.cust_id, this.energyCountersConfig)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          // console.log('Rückgabe GetDashboardData:');
          // console.log(data.ReturnValue);
          this.energyCountersData = JSON.parse(data.ReturnValue);
          // console.log(this.energyCountersData);
          // console.log(this.seriesOptions_Arbeit);
          // console.log(this.energyCountersData.verbrauch_table);
          this.chartData_Arbeit = this.energyCountersData.verbrauch_barchart;
          this.verbrauch_table_max_value = 0;
          for (const verbrauchItem of this.energyCountersData.verbrauch_table) {
            if (verbrauchItem.sum_value > this.verbrauch_table_max_value)
              this.verbrauch_table_max_value = verbrauchItem.sum_value;
          }
          // verbrauchsdaten nach Namen sortieren
          const sortedArray: EnergyCountersTableItem[] = this.energyCountersData.verbrauch_table.sort((n1, n2) => {
            if (n1 > n2) {
              return 1;
            }

            if (n1 < n2) {
              return -1;
            }

            return 0;
          });
          this.verbrauch_table = sortedArray; // this.energyCountersData.verbrauch_table;
          console.log(this.verbrauch_table);
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }


  yearClicked() {
    this.classNameYearButton = 'btn action-button';
    this.classNameMonthButton = 'btn btn-dark';
    this.currentArbeitType = 'year';
    this.refreshCurrentArbeitZeitraumLabel();
    this.energyCountersConfig.date_range = this.currentArbeitType;
    this.reloadChartData();
  }

  monthClicked() {
    this.classNameYearButton = 'btn btn-dark';
    this.classNameMonthButton = 'btn action-button';
    this.currentArbeitType = 'month';
    this.refreshCurrentArbeitZeitraumLabel();
    this.energyCountersConfig.date_range = this.currentArbeitType;
    this.reloadChartData();
  }

  backwardClicked() {
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
    this.energyCountersConfig.date_range = this.currentArbeitType;
    this.energyCountersConfig.year = this.currentYear;
    this.energyCountersConfig.month = this.currentMonthIndex + 1;
    this.reloadChartData();
  }

  forwardClicked() {
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
    this.energyCountersConfig.date_range = this.currentArbeitType;
    this.energyCountersConfig.year = this.currentYear;
    this.energyCountersConfig.month = this.currentMonthIndex + 1;
    this.reloadChartData();
  }

  refreshCurrentArbeitZeitraumLabel() {
    if (this.currentArbeitType === 'year') {
      this.currentArbeitZeitraum = this.currentYear.toString();
    } else {
      this.currentArbeitZeitraum = this.monthNames[this.currentMonthIndex] + ' ' + this.currentYear.toString();
    }
  }

  customizeLabel(arg) {
    return arg.argumentText + '(' + arg.percentText + ')';
  }

  getFormattedDate(dateString: Date) {
    return this.netLoggerService.getFormattedDateTime(dateString);
  }

  sendReport() {
    const mydate = new Date(this.currentYear, this.currentMonthIndex, 1);
    const myutcdate = moment(mydate).utc(true).toDate();
    this.netLoggerService.doCommand(NetLoggerServiceCommands.sendDashboardReport(this.cust_id, this.dashboard_id, myutcdate)).subscribe(
      data => {
        notify(data.ReturnMessage);
      }
    );
  }

  navigateToDevice(id: number) {
    // customers/15/sensors/11
    this.router.navigateByUrl('/customers/' + this.cust_id.toString() + '/sensors/' + id.toString());
  }

  getCounterBarWidthStyle(sum_value: number) {
    const percent = this.getPercent(sum_value);
    return {'width': percent + '%'};
  }

  getPercent(sum_value) {
    if (this.verbrauch_table_max_value === 0) {
      return 0;
    }
    return (sum_value / this.verbrauch_table_max_value) * 100;
  }

  getValueStyle(mybool: boolean) {
    if (mybool) {
      return {'color': '#C0392B'};
    }
    return {};
  }
}
