import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JsonCommand } from '../utils/json/json-command';
import { Injectable } from '@angular/core';
import {
  Customer,
  SensorValuePrecision,
  MeasuredValueType,
  ChartSeriesType,
  PredefinedTimeRange,
  PredefinedColor,
  DisplayItemNumberValue,
  DisplayItemStringValue,
  UserCustomerAccessObject
} from "../models/interfaces";
import * as moment from "moment";
import notify from "devextreme/ui/notify";
import { NetLoggerServiceCommands } from "./netlogger.service.commands";

@Injectable()
export class NetloggerService {
  public url_netlogger_service = "http://service.netlogger.eu";
  // public url_netlogger_service = 'http://localhost:8992';
  // public url_netlogger_service = 'http://blaurock.synology.me:8994';
  public url_netlogger_service_command =
    this.url_netlogger_service + "/cmd?jsoncommand";
  public current_user_name = "";
  public current_token = "";
  public isAuthenticated = false;
  private authState = new Subject<boolean>();
  public current_customer: Customer;
  private current_customer_state = new Subject<string>();
  private current_headline = "";
  private current_headline_state = new Subject<string>();
  public isEditMode = false;
  private isEditModeState = new Subject<boolean>();
  public userCustomerAccessObject = new UserCustomerAccessObject();

  constructor(private http: HttpClient, private router: Router) {
    console.log(
      "Constructor von NetLoggerService wird ausgeführt! isAuthenticated=" +
        this.isAuthenticated
    );
    this.current_token = localStorage.getItem("nl_user_token");
    this.isAuthenticated =
      this.current_token != null && this.current_token !== "";
    this.current_user_name = localStorage.getItem("nl_user_name");
    // Wenn der Service gestartet wird, dann kann ich nicht einfach isAuthenticated auf true setzen, wenn
    // ein token im localStorage gefunden wird. Er muss bei jeder Service-Instanz neu geprüft werden

    // wenn allerdings ein password im localStorage gefunden wird, könnte ich einen AutoLogin durchführen...
    this.tryAutoLogin();
    this.authState.next(this.isAuthenticated);
  }

  doRequestGet(url: string): Observable<string> {
    // const body = JSON.stringify(data);
    // const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(url, { responseType: "text" });
  }

  doRequest(url: string, data: any): Observable<string> {
    const body = JSON.stringify(data);
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<string>(url, body, { headers: headers });
  }

  doCommand(cmd: JsonCommand): Observable<any> {
    // der user und der token wird immer mitgeliefert
    cmd.addParameter("user", this.current_user_name);
    cmd.addParameter("token", this.current_token);
    const body = cmd.toJson();
    console.log("Command wird gesendet: " + body);
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<any>(this.url_netlogger_service_command, body, {
      headers: headers
    });
    /*.map((response: Response) => {
      console.log('Command-Antwort:');
      console.log(response.json());
      return response.json();
    });*/
  }

  tryAutoLogin() {
    const password = localStorage.getItem("nl_password");
    if (password && !this.isAuthenticated) {
      this.signinUser(this.current_user_name, password, false);
    }
  }

  signinUser(username: string, password: string, autologin: boolean) {
    // nach den Erfolgreichen einloggen den AuthState setzen
    const cmd = new JsonCommand();
    cmd.ModuleName = "Modules.NetLogger.Service.NetLoggerService";
    cmd.CommandName = "Login";
    cmd.addParameter("user", username);
    cmd.addParameter("password", password);
    const body = cmd.toJson();
    console.log('Ich versuch mich jetzt mit folgendem Befehl einzuloggen');
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    this.http
      .post<any>(this.url_netlogger_service_command, body, { headers: headers })
      .subscribe(data => {
        console.log(data);
        if (data.ReturnCode === 1) {
          this.current_token = data.ReturnValue;
          this.current_user_name = username;
          localStorage.setItem("nl_user_token", this.current_token);
          localStorage.setItem("nl_user_name", this.current_user_name);
          if (autologin) {
            localStorage.setItem("nl_password", password);
          }
          this.isAuthenticated = true;
          this.authState.next(true);
          console.log(
            "Benutzer wurde erfolgreich eingeloggt! Token:" + this.current_token
          );
          // wenn erfolgreich eingeloggt, dann automatisch auf 'News' routen
          this.router.navigate(["/customers"]);
        } else {
          console.log(data.ReturnMessage);
          alert(data.ReturnMessage);
        }
      });
  }

  updateAuthState() {
    this.authState.next(this.isAuthenticated);
  }

  currentUserIsAdmin() {
    if (this.current_user_name === "admin@netlogger.eu") {
      return true;
    } else if (
      this.userCustomerAccessObject &&
      this.userCustomerAccessObject.is_admin
    ) {
      return true;
    }
    return false;
  }

  setCurrentCustomer(customer: Customer) {
    this.current_customer = customer;
    this.reloadUserCustomerAccessObject();
    let name = "";
    if (this.current_customer != null) {
      name = this.current_customer.caption;
    }
    this.current_customer_state.next(name);
    // Headline auf Customer setzen, falls sonst nix angezeigt werden soll
    this.setHeadline(this.current_headline);
  }

  reloadUserCustomerAccessObject() {
    if (!this.current_customer) {
      this.userCustomerAccessObject = new UserCustomerAccessObject();
      return;
    }
    this.doCommand(
      NetLoggerServiceCommands.getUserCustomerAccessObject(
        this.current_customer.cust_id
      )
    ).subscribe(data => {
      if (data.ReturnCode === 200) {
        console.log(
          "reloadUserCustomerAccessObject: Ich bekam vom Server folgende Daten -> " +
            data.ReturnCode
        );
        console.log(data.ReturnValue);
        this.userCustomerAccessObject = JSON.parse(data.ReturnValue);
      } else {
        console.log(data.ReturnMessage);
        notify(data.ReturnMessage);
      }
    });
  }

  setHeadline(headlineCaption: string) {
    console.log('Headline: ' + this.current_headline + ' Customer: ');
    // console.log('CustomerCaption: '+this.current_customer.caption);
    this.current_headline = headlineCaption;
    /*if (headlineCaption && headlineCaption.length > 0) {
      this.current_headline = headlineCaption;
    } else if (this.current_customer) {
      this.current_headline = this.current_customer.caption;
    } else {
      this.current_headline = 'netLogger';
    }*/
    this.current_headline_state.next(
      this.current_headline.length > 0
        ? this.current_headline
        : this.current_customer.caption
    );
  }

  setCurrentCustomerByID(custID: number) {
    if (
      this.current_customer != null &&
      this.current_customer.cust_id === custID
    ) {
      this.current_customer_state.next(this.current_customer.caption);
    } else {
      const customer = new Customer();
      customer.cust_id = custID;
      this.current_customer = customer;
      this.current_customer.caption = 'netLogger';
      this.current_customer_state.next('');
      this.doCommand(NetLoggerServiceCommands.getCustomer(custID)).subscribe(
        data => {
          if (data.ReturnCode === 200) {
            this.current_customer = JSON.parse(data.ReturnValue);
            this.current_customer_state.next('');
          }
        }
      );
    }
    this.reloadUserCustomerAccessObject();
    this.setHeadline(this.current_headline);
  }

  getCurrentCustomerID() {
    if (this.current_customer) {
      return this.current_customer.cust_id;
    }
    return -1;
  }
  getCurrentCustomerCaption() {
    if (this.current_customer) {
      return this.current_customer.caption;
    }
    return '<kein>';
  }

  logout() {
    console.log('Logout wurde ausgeführt!');
    // sessionToken aus LocalStorage löschen
    localStorage.removeItem('nl_user_token');
    localStorage.removeItem('nl_user_name');
    localStorage.removeItem('nl_password');
    this.current_token = '';
    this.current_user_name = '';
    this.isAuthenticated = false;
    this.authState.next(false);
  }

  getIsAuthenticated() {
    return this.authState.asObservable();
  }

  getCurrentCustomerObservable() {
    return this.current_customer_state.asObservable();
  }

  getCurrentHeadlineObservable() {
    return this.current_headline_state.asObservable();
  }

  setEditMode(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.isEditModeState.next(this.isEditMode);
  }

  getIsEditModeStateObservable() {
    return this.isEditModeState.asObservable();
  }

  getSensorValuePrecisions(): SensorValuePrecision[] {
    return [
      { id: 0, caption: '15s' },
      { id: 1, caption: '1m' },
      { id: 2, caption: '30m' },
      { id: 3, caption: '1h' },
      { id: 4, caption: '6h' },
      { id: 5, caption: '1d' }
    ];
  }

  getMeasuredValueTypes(): MeasuredValueType[] {
    return [
      { id: 0, caption: 'Momentanwerte' },
      { id: 1, caption: 'Durchfluß-/Zählerstandswerte' },
      { id: 2, caption: 'Impulswerte' },
      { id: 3, caption: 'Füllstandswerte' }
    ];
  }

  getEventTypes(): DisplayItemNumberValue[] {
    return [
      { caption: 'Debug', value: 0 },
      { caption: 'Info', value: 1 },
      { caption: 'Warnung', value: 2 },
      { caption: 'Fehler', value: 3 },
      { caption: 'Fatal', value: 4 }
    ];
  }

  getEventTypeCaption(evType: number) {
    if (evType === 0) {
      return 'Debug';
    } else if (evType === 1) {
      return 'Info';
    } else if (evType === 2) {
      return 'Warnung';
    } else if (evType === 3) {
      return 'Fehler';
    } else {
      return 'Kritisch';
    }
  }

  getValueUnitTypes(): string[] {
    return [
      'W',
      'Wh',
      'kW',
      'kWh',
      'V',
      'kV',
      'VA',
      'kVA',
      'Var',
      'kVar',
      'A',
      'Ah',
      '°C',
      '°F',
      'lux',
      'klux',
      'Hz',
      'kHz',
      'm/s',
      'km/h',
      'm',
      'km',
      'min/km',
      'kcal',
      's',
      'min',
      'h',
      'l',
      'm³',
      '€',
      'Stk.',
      'g',
      'kg',
      't'
    ];
  }

  getImageFromUnit(unit: string): string {
    if (unit === 'kWh' || unit === 'Wh' || unit === 'km' || unit === 'Stk.')
      return 'Counter.png';
    else if (
      unit === 'kW' ||
      unit === 'W' ||
      unit === 'V' ||
      unit === 'VA' ||
      unit === 'kVA' ||
      unit === 'Var' ||
      unit === 'kVar' ||
      unit === 'A' ||
      unit === 'min/km' ||
      unit === 'km/h'
    )
      return 'Speed.png';
    else if (unit === 'm³') return 'cube.png';
    else if (unit === '€') return 'euro.png';
    else if (unit === 'Ah') return 'battery.png';
    else if (unit === 'm') return 'length.png';
    else if (unit === 'kcal') return 'kcal.png';
    else if (unit === 's' || unit === 'min' || unit === 'h')
      return 'stopwatch.png';
    else if (unit === 'Hz' || unit === 'kHz') return 'sine.png';
    else if (unit === 'm/s') return 'Wind.png';
    else if (unit === 'lux' || unit === 'klux') return 'Sun.png';
    else if (unit === '°C' || unit === '°F') return 'Thermometer.png';
    else if (unit === 'g' || unit === 'kg' || unit === 't') return 'weight.png';
    else if (unit === 'l') return 'water.png';
    return 'empty.png';
  }

  getSensorGroupImage(inter_face: string, typ: string) {
    if (typ === 'Solar-Log 500') return 'solarlog-500.jpg';
    else if (typ === 'Solar-Log 1000') return 'solarlog-1000.jpg';
    else if (typ === 'Solar-Log 1200') return 'solarlog-1200.png';
    else if (typ === 'Siemens PAC3200') return 'siemens_pac3200.jpg';
    else if (typ === 'SDM630-MCT' || typ === 'SDM630-M') return 'sdm630v2.jpg';
    if (inter_face === 'FRITZPLUG') return 'fritzplug.jpg';
    else if (inter_face === 'KNX') return 'knx-eib.jpg';
    else if (inter_face === 'MODBUS') return 'modbus.png';
    else if (inter_face === 'RPICT7') return 'rpict7.png';
    else if (inter_face === 'SMARTPI') return 'smart_pi.jpg';
    else if (inter_face === 'MAXWEB') return 'solarmax_maxweb.jpg';
    else if (typ) return typ;
    return 'empty.png';
  }

  getPredefinedTimeRanges(): PredefinedTimeRange[] {
    return [
      { caption: 'gestern', value: 'yesterday' },
      { caption: 'heute', value: 'today' },
      { caption: 'Monat', value: 'month' },
      { caption: 'Jahr', value: 'year' }
    ];
  }

  getChartSeriesTypes(onlyStackableTypes: boolean): ChartSeriesType[] {
    const retval: ChartSeriesType[] = [
      { caption: 'Linie', value: 'linie' },
      { caption: 'Linie abgerundet', value: 'splinie' },
      { caption: 'Fläche', value: 'area' },
      { caption: 'Fläche abgerundet', value: 'areaspline' },
      { caption: 'Balken horizontal', value: 'bar' },
      { caption: 'Balken vertikal', value: 'column' }
    ];
    if (!onlyStackableTypes) {
      retval.push({ caption: 'Kreisdiagramm', value: 'pie' });
      retval.push({ caption: 'Messgerät (Zeiger)', value: 'gauge' });
      retval.push({ caption: 'Messgerät (Balken)', value: 'solidgauge' });
    }
    return retval;
  }

  getChartColors(): PredefinedColor[] {
    return [
      { caption: 'schwarz', value: '#000000' },
      { caption: 'weiss', value: '#FFFFFF' },
      { caption: 'dunkelblau', value: '#1F497D' },
      { caption: 'hellgrau', value: '#EEECE1' },
      { caption: 'blau', value: '#4F81BD' },
      { caption: 'rot', value: '#C0504D' },
      { caption: 'grün', value: '#9BBB59' },
      { caption: 'violett', value: '#8064A2' },
      { caption: 'cyan', value: '#4BACC6' },
      { caption: 'orange', value: '#F79646' },
      { caption: 'dunkel-violett', value: '#800080' }
    ];
  }

  getHealthStatusClassName(health_status: number): string {
    if (health_status === 0) {
      return 'label-warning';
    } else if (health_status === -1) {
      return 'label-danger';
    } else {
      return 'label-success';
    }
  }

  getHealthStatusCaption(health_status: number): string {
    if (health_status === 0) return 'Warnung!';
    else if (health_status === -1) return 'Fehler!';
    else return 'OK';
  }

  getHealthStatusImage(health_status: number): string {
    if (health_status === 0) {
      return 'error_yellow.png';
    } else if (health_status === -1) {
      return 'error_red.png';
    } else {
      return 'ok.png';
    }
  }

  getHealthStatusColor(health_status: number): string {
    if (health_status === 0) {
      return '#FFC107';
    } else if (health_status === -1) {
      return '#D31D25';
    } else if (health_status === 1) {
      return '#4CAF50';
    }
    return '#777';
  }

  getSourceTypeCaption(source_type: number) {
    if (source_type === 1) return 'Sensor';
    else if (source_type === 2) return 'ServiceBox';
    else if (source_type === 3) return 'Meßspur';
    else if (source_type === 4) return 'Kunde';
    else if (source_type === 5) return 'Sensor-Gruppe';
    else if (source_type === 6) return 'Meßgerät/Meßspurgruppe';
    return '';
  }

  getFormattedDateTime(dateTimeString: any) {
    return moment(dateTimeString).format('DD.MM.YYYY HH:mm');
  }

  getFormattedDate(dateString: any) {
    return moment(dateString).format('DD.MM.YYYY');
  }

  // ***************** DASHBOARD ****************** //
  getDashboardThumbnail(dashboard_type: number) {
    if (dashboard_type === 1) {
      return 'energy_balance.png';
    } else if (dashboard_type === 2) {
      return 'energy_counters.png';
    }
    return '';
  }

  getGraphTimespans(): DisplayItemStringValue[] {
    return [
      { caption: 'heute', value: 'today' },
      { caption: 'gestern', value: 'yesterday' },
      { caption: 'Woche', value: 'week' },
      { caption: 'Monat', value: 'month' },
      { caption: 'Jahr', value: 'year' },
      { caption: 'manuell', value: 'manual' }
    ];
  }

  getGraphPrecisions(): DisplayItemStringValue[] {
    return [
      { caption: '15s', value: '15s' },
      { caption: '1m', value: '1m' },
      { caption: '30m', value: '30m' },
      { caption: '1h', value: '1h' },
      { caption: '6h', value: '6h' },
      { caption: '1d', value: '1d' }
    ];
  }

  getGraphSerieTypes(): DisplayItemStringValue[] {
    return [
      { caption: 'Fläche', value: 'area' },
      { caption: 'Fläche abgerundet', value: 'areaspline' },
      { caption: 'Balken vertikal', value: 'column' },
      { caption: 'Balken horizontal', value: 'bar' },
      { caption: 'Linie', value: 'line' },
      { caption: 'Linie abgerundet', value: 'spline' }
    ];
  }
}
