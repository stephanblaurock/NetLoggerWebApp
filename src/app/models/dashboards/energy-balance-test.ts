import {EnergyBalanceConfig, EnergyBalanceStatistikData} from './energy-balance';
import {Device} from "../interfaces";
import {DeviceInfo, DeviceLight} from "../devices";


export class EnergyBalanceTest {
  /* static createConfig() {
      let retval = new EnergyBalanceConfig();
      retval = Object.assign(retval, {
          dashboard_type: 1,
          caption: 'Energie-Bilanz',
          export_tarif: 0.16,
          import_tarif: 0.28,
          devices_verbraucher: [
              {id: 3, caption: 'EVU', unit: 'kW', is_erzeuger: false}
          ],
          verbrauch_is_netto: true,
          devices_erzeuger: [
              {id: 0, caption: 'PV1', unit: 'kW', is_erzeuger: true},
              {id: 1, caption: 'PV2', unit: 'kW', is_erzeuger: true},
              {id: 2, caption: 'PV3', unit: 'kW', is_erzeuger: true}
          ],
          timestamp_day_statistik: new Date(),
          timestamp_month_statistik: new Date(),
          timestamp_year_statistik: new Date()
      });
      return retval;
  }
  */
  static createConfigSPN() {
    let retval = new EnergyBalanceConfig();
    retval = Object.assign(retval,
      {
        // cust_id: 14,
        dashboard_type: 1,
        caption: 'Energiebilanz SPN',
        export_tarif: 0.35,
        import_tarif: 0.25,
        eeg: 0.1,
        devices_leistung: [
          {id: 36, caption: 'Leistung Einspeisung', energy_type: 2, unit: 'kW'},
          {id: 24, caption: 'Ertrag PV Halle 4', energy_type: 1, unit: 'kW'},
          {id: 26, caption: 'Ertrag PV Lagerhalle', energy_type: 1, unit: 'kW'},
          {id: 28, caption: 'Ertrag Halle 2', energy_type: 1, unit: 'kW'},
          {id: 34, caption: 'Leistung Bezug', energy_type: 0, unit: 'kW'}
        ],
        devices_arbeit: [
          {id: 35, caption: 'Arbeit Einspeisung', energy_type: 2, unit: 'kWh'},
          {id: 23, caption: 'Ertrag PV Halle 4', energy_type: 1, unit: 'kWh'},
          {id: 25, caption: 'Ertrag PV Lagerhalle', energy_type: 1, unit: 'kWh'},
          {id: 27, caption: 'Ertrag Halle 2', energy_type: 1, unit: 'kWh'},
          {id: 33, caption: 'Arbeit Bezug', energy_type: 0, unit: 'kWh'}
        ],
        verbrauch_is_netto: true,
        verbrauch_minvalue: -300,
        verbrauch_maxvalue: 800,
        date_leistung: new Date(),
        year_arbeit: new Date().getFullYear(),
        month_arbeit: new Date().getMonth() + 1,
        current_arbeit_range: 'month',
        parameter: {calculate_leistung: true, calculate_arbeit: true}
      });
    return retval;
  }

  static createConfigFromDevice(cust_id: number, device: DeviceLight) {
    const retval = new EnergyBalanceConfig();
    // retval.cust_id = cust_id;
    retval.dashboard_type = 1;
    retval.export_tarif = 0.35;
    retval.import_tarif = 0.25;
    retval.verbrauch_minvalue = device.min_value;
    retval.verbrauch_maxvalue = device.max_value;
    retval.eeg = 0.1;
    // Gibt das Device Momentan- oder Historische Werte aus?
    if (device.value_type === 1 || device.value_type === 2) {   // es handelt sich um einen Zählerwert, also als Arbeit (Balken) darstellen
      retval.devices_arbeit = [];
      const devInfo = new DeviceInfo();
      devInfo.id = device.device_id;
      devInfo.caption = device.caption;
      devInfo.energy_type = 0;
      devInfo.unit = device.unit;
      retval.devices_arbeit.push(devInfo);
      retval.parameter = {calculate_leistung: false, calculate_arbeit: true};
    } else {
      retval.devices_leistung = [];
      const devInfo = new DeviceInfo();
      devInfo.id = device.device_id;
      devInfo.caption = device.caption;
      devInfo.energy_type = 0;
      devInfo.unit = device.unit;
      retval.devices_leistung.push(devInfo);
      retval.parameter = {calculate_leistung: true, calculate_arbeit: false};
    }
    retval.verbrauch_is_netto = false;
    retval.date_leistung = new Date();
    retval.year_arbeit = new Date().getFullYear();
    retval.month_arbeit = new Date().getMonth() + 1;
    retval.current_arbeit_range = 'month';
    return retval;
  }

  /*
  static createDayStatistik() {
      let retval: EnergyBalanceStatistikData = {
          current_verbrauch: 568.44,
          current_ertrag: 125.68,
          timestamp: new Date(),
          series_data_chart: [
              {l: '1:00', d0: 1, d1: 1, d2: 1, d3: 3, de: 0},
              {l: '3:00', d0: 2, d1: 1, d2: 1, d3: 6, de: 0},
              {l: '5:00', d0: 3, d1: 1, d2: 1, d3: 7, de: 0},
              {l: '7:00', d0: 7, d1: 2, d2: 1, d3: 10, de: 0},
              {l: '9:00', d0: 11, d1: 3, d2: 1, d3: 0, de: -1},
              {l: '11:00', d0: 20, d1: 4, d2: 1, d3: 0, de: -2},
              {l: '13:00', d0: 15, d1: 4, d2: 1, d3: 0, de: -3},
              {l: '15:00', d0: 13, d1: 4, d2: 1, d3: 5, de: 0},
              {l: '17:00', d0: 10, d1: 4, d2: 1, d3: 13, de: 0},
              {l: '19:00', d0: 8, d1: 2, d2: 1, d3: 10, de: 0},
              {l: '21:00', d0: 3, d1: 1, d2: 1, d3: 5, de: 0}
          ],
          series_data_sum: [
              {l: 'Gesamt', d0: 93, d1: 27, d2: 11, d3: 71, de: -8}
          ]
      }
      return retval;
  }
  */
}
