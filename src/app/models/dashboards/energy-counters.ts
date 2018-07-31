import {DeviceInfo} from '../devices';
import {NLStyles} from "../nl-styles";

export class EnergyCountersConfig {
  dashboard_type: number;
  export_tarif: number;
  import_tarif: number;
  eeg: number;
  devices: DeviceInfo[];
  year: number;
  month: number;
  date_range: string;
  monthly_recipients: string[];

  constructor() {
    this.dashboard_type = 2;
    this.export_tarif = 0;
    this.import_tarif = 0;
    this.eeg = 0;
    this.devices = new Array<DeviceInfo>();
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.date_range = 'month';
    this.monthly_recipients = [];
  }

  validate() {
    // console.log('Parameter-Inhalt:');
    // console.log(this.parameter);
    if (this.dashboard_type === 0) {
      this.dashboard_type = 2;
    }
  }

  public createValueAxisArbeit() {
    return [{
      valueType: 'numeric',
      grid: {
        opacity: 0.4
      },
      position: 'left',
      name: 'a1',
      // constantLines: [{color: 'red', label: 'cline', value: 3000}],
      title: {text: 'Arbeit in kWh'}
    }];
  }

  public createSeriesOptionsArbeit(withLabel: boolean) {
    // für jede Serie eine eigene Option
    let retval = [];


    let colorIndexVerbraucher = 0;
    let colorIndexErzeuger = 0;
    let einspeisungAvailable = false;
    let scolor = NLStyles.colors_blue[colorIndexVerbraucher];
    let option = {
      type: 'bar', argumentField: 'l', valueField: 'v',
      color: scolor, name: 'verbrauch', opacity: 0.5,
      border: {color: scolor, visible: true, width: 2},
      label: {visible: withLabel, position: 'inside', format: {type: 'fixedPoint', precision: 1}}
    };
    retval.push(option);

    return retval;
    /*
    if (this.devices) {
      for (let deviceinfo of this.devices) {
        let scolor = '#ffffff';
        if (deviceinfo.energy_type === 1) {
          scolor = NLStyles.colors_green[colorIndexErzeuger];
          colorIndexErzeuger = colorIndexErzeuger + 1;                // grün für Erzeuger
        } else if (deviceinfo.energy_type === 0) {
          scolor = NLStyles.colors_blue[colorIndexVerbraucher];   // blau für Verbraucher
          colorIndexVerbraucher = colorIndexVerbraucher + 1;
        } else if (deviceinfo.energy_type === 2)
          scolor = NLStyles.colors_orange[2];
        if (deviceinfo.energy_type === 1 || deviceinfo.energy_type === 0) {
          let option = {
            type: 'stackedbar', argumentField: 'l', valueField: 'd' + deviceinfo.id,
            color: scolor, name: deviceinfo.caption + ' (' + deviceinfo.caption_group + ')', opacity: 0.5,
            border: {color: scolor, visible: true, width: 2},
            label: {visible: withLabel, position: 'inside', format: {type: 'fixedPoint', precision: 1}}
          };
          retval.push(option);
        } else {
          // so, wenn es jetzt noch Einspeisewerte gibt, dann diese als eigene serie definieren
          let option1 = {
            type: 'bar', argumentField: 'l', valueField: 'd' + deviceinfo.id,
            color: NLStyles.colors_orange[2], name: 'Einspeisung', opacity: 0.5,
            border: {color: NLStyles.colors_orange[2], visible: true, width: 2},
            label: {visible: withLabel, position: 'inside', format: {type: 'fixedPoint', precision: 1}}
          };
          retval.push(option1);
          einspeisungAvailable = true;
        }
      }*/
  }
}

export class EnergyCountersTableItem {
  device_id: number;
  device_group_id: number;
  group_caption: string;
  caption: string;
  cost_center: string;
  unit: string;
  energy_type: number;
  start_value: number;
  end_value: number;
  sum_value: number;
  time_first_value: Date;
  time_last_value: Date;
  first_value_warning: boolean;
  last_value_warning: boolean;

  getPercent(max_value: number): number {
    if (max_value === 0)
      return 0;
    return (this.sum_value / max_value) * 100;
  }
}

export class EnergyCountersData {
  verbrauch_table: EnergyCountersTableItem[];
  verbrauch_piechart: any[];
  verbrauch_barchart: any[];
  common_data: any[];
}
