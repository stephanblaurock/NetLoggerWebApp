import {DeviceInfo} from '../devices';
import {CaptionValueItem} from '../caption-value-item';
import {NLStyles} from '../nl-styles';

export class EnergyBalanceConfig {
  dashboard_type: number;
  export_tarif: number;
  import_tarif: number;
  eeg: number;
  devices_leistung: DeviceInfo[];
  devices_arbeit: DeviceInfo[];
  verbrauch_is_netto: boolean;
  verbrauch_minvalue: number;
  verbrauch_maxvalue: number;
  date_leistung: Date;
  year_arbeit: number;
  month_arbeit: number;
  current_arbeit_range: string;
  parameter?: any;

  constructor() {
    this.dashboard_type = 1;
    this.export_tarif = 0;
    this.import_tarif = 0;
    this.eeg = 0;
    this.devices_leistung = new Array<DeviceInfo>();
    this.devices_arbeit = new Array<DeviceInfo>();
    this.verbrauch_is_netto = false;
    this.verbrauch_minvalue = -300;
    this.verbrauch_maxvalue = 800;
    this.date_leistung = new Date();
    this.year_arbeit = new Date().getFullYear();
    this.month_arbeit = new Date().getMonth() + 1;
    this.current_arbeit_range = 'month';
  }

  validate() {
    // console.log('Parameter-Inhalt:');
    // console.log(this.parameter);
    if (this.dashboard_type === 0) {
      this.dashboard_type = 1;
    }
    if (!this.parameter) {
      this.parameter = {calculate_leistung: true, calculate_arbeit: true};
    }
  }

  hasEinspeisungLeistung() {
    if (this.devices_leistung) {
      for (let deviceinfo of this.devices_leistung) {
        if (deviceinfo.energy_type === 2) {
          return true;
        }
      }
    }
    return false;
  }

  hasEinspeisungArbeit() {
    if (this.devices_arbeit) {
      for (let deviceinfo of this.devices_arbeit) {
        if (deviceinfo.energy_type === 2) {
          return true;
        }
      }
    }
    return false;
  }

  public createValueAxisLeistung() {
    return [{
      valueType: 'numeric',
      grid: {
        opacity: 0.4
      },
      position: 'left',
      name: 'a1',
      // constantLines: [{color: 'red', label: 'cline', value: 3000}],
      title: {text: 'Leistung in kW'}
    }];
  }

  public createSeriesOptionsLeistung() {
    // für jede Serie eine eigene Option
    let retval = [];
    // let alldevices = [].concat(this.devices_erzeuger).concat(this.devices_verbraucher);
    let colorIndexVerbraucher = 0;
    let colorIndexErzeuger = 0;
    let einspeisungAvailable = false;
    if (this.devices_leistung) {
      for (let deviceinfo of this.devices_leistung) {
        let scolor = "#ffffff";
        if (deviceinfo.energy_type === 1) {
          scolor = NLStyles.colors_green[colorIndexErzeuger];
          if (NLStyles.colors_green.length > (colorIndexErzeuger - 1)) {
            colorIndexErzeuger = colorIndexErzeuger + 1;                // grün für Erzeuger
          }
        } else if (deviceinfo.energy_type === 0) {
          scolor = NLStyles.colors_blue[colorIndexVerbraucher];   // blau für Verbraucher
          if (NLStyles.colors_blue.length > (colorIndexVerbraucher - 1)) {
            colorIndexVerbraucher = colorIndexVerbraucher + 1;
          }
        } else if (deviceinfo.energy_type === 2) {
          scolor = NLStyles.colors_orange[2];
        }
        if (deviceinfo.energy_type === 1 || deviceinfo.energy_type === 0) {
          let option = {
            type: 'stackedarea', argumentField: 'l', valueField: 'd' + deviceinfo.id,
            color: scolor, name: deviceinfo.caption + ' (' + deviceinfo.caption_group + ')', opacity: 0.8,
            border: {color: scolor, visible: true, width: 1}
          };
          retval.push(option);
        } else {
          // so, wenn es jetzt noch Einspeisewerte gibt, dann diese als eigene serie definieren
          let option1 = {
            type: 'area', argumentField: 'l', valueField: 'd' + deviceinfo.id,
            color: NLStyles.colors_orange[2], name: 'Einspeisung', opacity: 0.8,
            border: {color: scolor, visible: true, width: 1}
          };
          retval.push(option1);
          einspeisungAvailable = true;
        }
      }
    }
    // so, jetzt gibt es noch eine Gesamtleistungskurve: Erzeuger+Verbraucher-Einspeisung
    if (einspeisungAvailable) {
      let option2 = {
        type: 'line', argumentField: 'l', valueField: 's',
        color: '#ffffff', name: 'Gesamt-Verbrauch', opacity: 0.8, point: {visible: false}, width: 1
      };
      retval.push(option2);
    }
    return retval;
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
    if (this.devices_arbeit) {
      for (let deviceinfo of this.devices_arbeit) {
        let scolor = "#ffffff";
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
      }
    }
    // so, jetzt gibt es noch eine Gesamtleistungskurve: Erzeuger+Verbraucher-Einspeisung
    // ist aber nur relevant, wenn es eine Einspeisung gibt!
    if (einspeisungAvailable) {
      let option2 = {
        type: 'line', argumentField: 'l', valueField: 's',
        color: '#ffffff', name: 'Gesamt-Verbrauch', opacity: 0.8, point: {visible: false}
      };
      retval.push(option2);
    }
    return retval;
  }

  /*
  public createPieSeriesPalette() {
      // für jede Serie eine eigene Option
      let retval = [];
      let alldevices = [].concat(this.devices_erzeuger).concat(this.devices_verbraucher);
      let colorIndexVerbraucher = 0;
      let colorIndexErzeuger = 0;
      for (let deviceinfo of alldevices) {
          let scolor = "#ffffff";
          if (deviceinfo.is_erzeuger) {
              scolor = NLStyles.colors_green[colorIndexErzeuger];
              colorIndexErzeuger = colorIndexErzeuger + 1;                // grün für Erzeuger
          } else {
              scolor = NLStyles.colors_blue[colorIndexVerbraucher];   // blau für Verbraucher
              colorIndexVerbraucher = colorIndexVerbraucher + 1;
          }
          retval.push(scolor);
      }
      return retval;
  }
  */
}

export class EnergyBalanceStatistik {
  leistung_data?: EnergyBalanceStatistikData;
  leistung_chart_data?: any[];
  arbeit_data?: EnergyBalanceStatistikData;
  arbeit_chart_data?: any[];
  arbeit_gesamt_data?: EnergyBalanceStatistikData;
  arbeit_gesamt_chart_data?: any[];
}

export class EnergyBalanceStatistikData {
  current_leistung?: number;
  current_leistung_timestamp?: Date;
  // chart_data: any[];
  calc_duration?: string;
  sum_value?: number;
  sum_value_unit?: string;
}
