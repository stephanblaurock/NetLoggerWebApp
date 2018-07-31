import {Component, OnInit, ViewChild} from '@angular/core';
import {DxChartComponent} from 'devextreme-angular';
import {ChartItemData, СorporationInfo} from '../models/chartitemdata';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styles: []
})
export class TestComponent implements OnInit {
    @ViewChild('mychart') chart: DxChartComponent;
    // chartData = null;
    chartData: ChartItemData[] = [{
        Label: '01.10.2017',
        Value: 2340
    }, {
        Label: '02.10.2017',
        Value: 1200
    }, {
        Label: '03.10.2017',
        Value: 0
    },{
        Label: '04.10.2017',
        Value: 3100
    },{
        Label: '05.10.2017',
        Value: 1000
    },{
        Label: '06.10.2017',
        Value: 800
    },{
        Label: '07.10.2017',
        Value: 300
    },{
        Label: '08.10.2017',
        Value: 700
    },{
        Label: '09.10.2017',
        Value: 0
    }];
    data2: ChartItemData[] = [{
        Label: '01.10.2017',
        Value: 3000
    }, {
        Label: '02.10.2017',
        Value: 1200
    },{
        Label: '03.10.2017',
        Value: 0
    },{
        Label: '04.10.2017',
        Value: 3100
    },{
        Label: '05.10.2017',
        Value: 1000
    },{
        Label: '06.10.2017',
        Value: 800
    },{
        Label: '07.10.2017',
        Value: 300
    },{
        Label: '08.10.2017',
        Value: 700
    },{
        Label: '09.10.2017',
        Value: 0
    }];
    corporationsInfo: СorporationInfo[] = [{
        company: "ExxonMobil",
        y2005: 362.53,
        y2004: 277.02
    }, {
        company: "GeneralElectric",
        y2005: 348.45,
        y2004: 328.54
    }, {
        company: "Microsoft",
        y2005: 279.02,
        y2004: 297.02
    }, {
        company: "Citigroup",
        y2005: 230.93,
        y2004: 255.3
    }, {
        company: "Royal Dutch Shell plc",
        y2005: 203.52,
        y2004: 173.54
    }, {
        company: "Procted & Gamble",
        y2005: 197.12,
        y2004: 131.89
    }];

    valueAxis = [{
        valueType: 'numeric',
        grid: {
            opacity: 0.4
        },
        position: 'left',
        name: 'a1',
        constantLines: [{color: 'red', label: 'cline', value: 3000}],
        title: {text: 'Leistung in kW'}
    }, {
        valueType: 'numeric',
        grid: {
            opacity: 0.4
        },
        position: 'right',
        name: 'a2',
        constantLines: [{color: 'green', label: 'cline', value: 1000}],
        title: {text: 'Arbeit in kWh'}
    }];
    valueAxis2 = [{
        valueType: 'numeric',
        grid: {
            opacity: 0.4
        },
        position: 'left',
        name: 'a1',
        constantLines: [{color: 'red', label: 'cline', value: 3000}],
        title: {text: 'Linkes Chart'}
    }, {
        valueType: 'numeric',
        grid: {
            opacity: 0.4
        },
        position: 'right',
        name: 'a2',
        constantLines: [{color: 'green', label: 'cline', value: 1000}],
        title: {text: 'rechtes Chart'}
    }];
    seriesOptions = [
        {type: 'bar',  argumentField: 'Label', valueField: 'Value', name: '123', color: '#aabbcc', axis: 'a1'},
        {type: 'line',  argumentField: 'Label', valueField: 'Value', name: '456', axis: 'a2' }
    ];
    verbrauch_daily: any[];
  constructor() { }

  ngOnInit() {
  }

    buttonClick() {
        // console.log(this.chart.instance);
        // this.chart.instance.valueAxis[0].title.text = 'Asdf';
        // this.chart.valueAxis[0].title.text = 'Hello world!';
        // this.verbrauch_daily[0].Value = 3000;
        // this.verbrauch_daily = this.verbrauch_daily;
        // let localSO = this.seriesOptions;
        // this.seriesOptions = null;
        // this.verbrauch_daily[0].Value = 3000;
        // this.seriesOptions = localSO;
        // this.seriesOptions = this.seriesOptions1;
        // this.chartData = this.data2;
        // this.chart.instance.getAllSeries()[0].hide();
        // this.valueAxis[0].title.text = 'Testbeschriftung';
        this.valueAxis = this.valueAxis2;     // Object.assign({}, this.valueAxis); //  Object.create(this.valueAxis1);
        // console.log(this.valueAxis);
    }
}
