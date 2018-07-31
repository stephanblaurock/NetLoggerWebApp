import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {Device, DeviceGroup, ManualValue} from './models/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {NetloggerService} from './service/netlogger.service';
import {NetLoggerServiceCommands} from './service/netlogger.service.commands';
import {EnergyBalanceTest} from './models/dashboards/energy-balance-test';
import notify from 'devextreme/ui/notify';
import {DevicePickerComponent} from './widgets/device-picker.component';
import {DeviceGroupLight, DeviceInfo, DeviceLight, SummarizedSensorDeviceInfo} from './models/devices';
import * as moment from 'moment';
import {EventLogFilter} from './models/eventlog-models';

@Component({
  selector: 'app-sensor-group',
  templateUrl: './sensor-group.component.html',
  styles: []
})
export class SensorGroupComponent implements OnInit, OnDestroy {
  isAdmin = false;
  @ViewChild('devPicker') devicePicker: DevicePickerComponent;
  customerIDFromURL: number;
  deviceGroupIDFromURL: number;
  private parentRoute: any;
  private currentRoute: any;
  deviceGroup: DeviceGroupLight;
  deviceGroupImage: string;
  currentDevice: DeviceLight;
  eventLogFilter: EventLogFilter;
  chartConfig: any;
  popupDeleteDeviceVisible = false;
  popupCopyDeviceVisible = false;
  copySensorDataDate1 = new Date();
  copySensorDataDate2 = new Date();
  popupDevicePickerVisible = false;
  popupCounterCorrectionVisible = false;
  counterCorrectionTimeStamp = new Date();
  counterCorrectionValue = 0;
  selectedTargetDeviceForDataCopy: DeviceInfo;
  popupManualValueVisible = false;
  manualValueTimeStamp = new Date();
  manualValue = 0;
  manualValueInterpolate = false;
  allowEdit = false;

  popupPropertiesVisible = false;
  changedDeviceGroupCaption = '';
  changedDeviceGroupIsActive = false;
  changedDeviceGroupAddress = '';

  popupCalculateDayValuesVisible = false;
  calculateDayValuesDate1 = new Date();
  calculateDayValuesDate2 = new Date();

  deleteFromDay: Date;
  deleteToDay: Date;

  constructor(private netLoggerService: NetloggerService, private router: Router, private route: ActivatedRoute, private mylocation: Location) {
  }

  ngOnInit() {
    this.isAdmin = this.netLoggerService.currentUserIsAdmin();
    this.netLoggerService.setHeadline('');
    this.parentRoute = this.route.parent.params.subscribe(params => {
      this.customerIDFromURL = +params['id'];
    });
    this.currentRoute = this.route.params.subscribe(params => {
      this.deviceGroupIDFromURL = +params['id'];
      this.reloadDeviceGroup();
      this.setCurrentDevice(null);
    });
    this.allowEdit = this.netLoggerService.userCustomerAccessObject.allow_sensor_config;
  }

  ngOnDestroy() {
    this.parentRoute.unsubscribe();
    this.currentRoute.unsubscribe();
  }

  reloadDeviceGroup() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getDeviceGroupLight(this.customerIDFromURL, this.deviceGroupIDFromURL)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.deviceGroup = JSON.parse(data.ReturnValue);  // JsonHelper.DeserializeJsonWithDate(data.ReturnValue);
          console.log(this.deviceGroup);
          const evLog = new EventLogFilter();
          evLog.cust_id = this.customerIDFromURL;
          evLog.max_rows = 30;
          evLog.source_id_filter = this.deviceGroup.sensor_group_id;  // this.deviceGroupIDFromURL; // this.currentDevice.device_id;
          evLog.event_source_type_filter = 5;
          this.eventLogFilter = evLog;

          this.deviceGroupImage = this.netLoggerService.url_netlogger_service + '/img/device_images/' + this.deviceGroup.image_file;
          if (this.deviceGroup && this.deviceGroup.devices && this.deviceGroup.devices.length > 0) {
            this.setCurrentDevice(this.deviceGroup.devices[0]);
            this.netLoggerService.setHeadline('');
          }
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  headlineClicked() {
    this.setCurrentDevice(null);
  }

  setCurrentDevice(device: DeviceLight) {
    // console.log("sensor-group.component.setCurrentSensor wurde aufgerufen!");
    if (this.currentDevice && device && this.currentDevice.device_id === device.device_id)
      return; // wenn der übergebene Sensor schon der aktuelle Sensor ist, dann nix machen
    this.currentDevice = device;

    if (this.currentDevice) {
      this.chartConfig = EnergyBalanceTest.createConfigFromDevice(this.customerIDFromURL, this.currentDevice);
    }
  }

  getDeviceImageUrl(unit: string) {
    return '../assets/unitimages/' + this.netLoggerService.getImageFromUnit(unit);
  }

  getHealthStatusClassName(health_status: number): string {
    return this.netLoggerService.getHealthStatusClassName(health_status);
  }

  getHealthStatusColor(health_status: number): string {
    return this.netLoggerService.getHealthStatusColor(health_status);
  }

  getHealthStatusCaption(health_status: number): string {
    return this.netLoggerService.getHealthStatusCaption(health_status);
  }

  getConnectionImage(deviceID: number) {
    return deviceID > 0 ? 'connected_green.png' : 'disconnected_orange.png';
  }

  getFormattedDateTime(dateTimeString: string) {
    return this.netLoggerService.getFormattedDateTime(dateTimeString);
  }

  getDecimalPlaces(value: number) {
    if (value < 1000) {
      return '1.1-3'; // + device.decimal_places.toString() + '-' + device.decimal_places.toString();
    }
    return '1.0-0';
  }

  getSelectedClassName(device_id: number) {
    if (this.currentDevice && this.currentDevice.device_id === device_id) {
      return 'nl-tileitem-selected';
    }
    return '';
  }

  goBack() {
    this.mylocation.back();
  }

  showDeleteDevicePopup() {
    if (!this.currentDevice) {
      return;
    }
    this.popupDeleteDeviceVisible = true;
  }

  deleteDevice() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.deleteDevice(this.customerIDFromURL, this.currentDevice.device_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.popupDeleteDeviceVisible = false;
          notify('Meßspur wurde erfolgreich gelöscht!');
          this.reloadDeviceGroup();
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  deleteDeviceByTimeSpan() {
    const day1 = moment(this.deleteFromDay).utc(true).toDate();
    const day2 = moment(this.deleteToDay).utc(true).toDate();
    this.netLoggerService.doCommand(NetLoggerServiceCommands.deleteDayValues(this.customerIDFromURL, this.currentDevice.device_id, day1, day2)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.popupDeleteDeviceVisible = false;
          notify(data.ReturnMessage);
          this.reloadDeviceGroup();
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  showCopyDeviceDataPopup() {
    if (!this.currentDevice) {
      return;
    }
    this.popupCopyDeviceVisible = true;
  }

  showDevicePickerPopup() {
    this.popupDevicePickerVisible = true;
  }

  selectDeviceOnPopup() {
    this.popupDevicePickerVisible = false;
    // ausgewähltes Device merken
    let selDevs = this.devicePicker.getSelectedDeviceInfos();
    if (selDevs && selDevs.length > 0) {
      this.selectedTargetDeviceForDataCopy = selDevs[0];
    }
  }

  copyDeviceData() {
    console.log(this.copySensorDataDate1);
    const date1 = moment(this.copySensorDataDate1).utc(true).toDate();
    const date2 = moment(this.copySensorDataDate2).utc(true).toDate();
    this.netLoggerService.doCommand(NetLoggerServiceCommands.copyMeasuredValues(this.customerIDFromURL, this.currentDevice.device_id,
      this.selectedTargetDeviceForDataCopy.id, date1, date2, true)).subscribe(
      data => {
        console.log(data);
        if (data.ReturnCode === 200) {
          notify('Meßspurdaten wurden erfolgreich kopiert!');
          this.popupCopyDeviceVisible = false;
        } else if (data.ReturnCode === 404) {
          notify('Quell- bzw. Ziel-Meßspur wurden nicht gefunden!');
        } else if (data.ReturnCode === 403) {
          notify('in der Zielspur sind bereits Daten vorhanden!');
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        } else {
          notify(data.ReturnMessage);
        }
      }
    );
  }

  editDeviceGroup() {
    if (this.isAdmin) {
      this.router.navigateByUrl('/customers/' + this.customerIDFromURL + '/sensors/' + this.deviceGroupIDFromURL + '/edit');
    } else {
      this.showProperties();
    }
  }

  showCounterCorrectionPopup() {
    this.popupCounterCorrectionVisible = true;
  }

  setCounterCorrection() {
    const mydate = moment(this.counterCorrectionTimeStamp).utc(true).toDate();
    console.log(mydate);
    const corr = {
      device_id: this.currentDevice.device_id,
      time_stamp: mydate,
      correction: this.counterCorrectionValue
    }
    console.log('Counter-Correction:');
    console.log(corr);
    this.popupCounterCorrectionVisible = false;

    const cmd = NetLoggerServiceCommands.setCounterCorrection(this.customerIDFromURL, corr);
    console.log(cmd.toJson());

    this.netLoggerService.doCommand(cmd).subscribe(
      data => {
        console.log(data);
      }
    );

  }

  showManualValuePopup() {
    this.popupManualValueVisible = true;
  }

  setManualValue() {
    const mv = new ManualValue();
    mv.device_id = this.currentDevice.device_id;
    mv.interpolate = this.manualValueInterpolate;
    mv.timestamp = moment(this.manualValueTimeStamp).utc(true).toDate();
    mv.value = this.manualValue;
    this.netLoggerService.doCommand(NetLoggerServiceCommands.uploadManualValue(this.customerIDFromURL, true, mv)).subscribe(
      data => {
        console.log(data);
        if (data.ReturnCode === 200) {
          notify('Wert wurde erfolgreich zum Server übertragen.');
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        } else {
          notify(data.ReturnMessage);
        }
      }
    );
  }

  setSensorData() {
    const simpletimestamp = moment(this.manualValueTimeStamp).utc(true).toDate();
    this.netLoggerService.doCommand(NetLoggerServiceCommands.uploadSimpleSensorData(this.customerIDFromURL, this.currentDevice.sensor_id, 0, simpletimestamp, this.manualValue)).subscribe(
      data => {
        console.log(data);
        if (data.ReturnCode === 200) {
          this.popupManualValueVisible = false;
          notify(data.ReturnMessage);
          // jetzt noch manuell die Monats- und Jahresberechnung durchführen, damit die Summenbalken passen
          // this.calculateSummen();  -> nützt leider nix, da der Import der Sensordaten auf asyncronem Weg erfolgt und calculateSummen gar nix macht...
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        } else {
          notify(data.ReturnMessage);
        }
      }
    );
  }

  calculateSummen() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.calculateSummen(this.customerIDFromURL)).subscribe(
      data => {
        notify(data.ReturnMessage);
      }
    );
  }

  getTileStyle(deviceInfo: DeviceLight) {
    if (!deviceInfo.is_active) {
      return {'opacity': 0.4};
    }
    return {};
  }

  showProperties() {
    if (!this.deviceGroup) {
      return;
    }
    this.changedDeviceGroupCaption = this.deviceGroup.caption;
    this.changedDeviceGroupIsActive = this.deviceGroup.is_active;
    this.changedDeviceGroupAddress = this.deviceGroup.address;
    this.popupPropertiesVisible = true;
  }

  saveChangedDeviceGroupProperties() {
    this.deviceGroup.caption = this.changedDeviceGroupCaption;
    this.deviceGroup.is_active = this.changedDeviceGroupIsActive;
    this.deviceGroup.address = this.changedDeviceGroupAddress;
    this.netLoggerService.doCommand(NetLoggerServiceCommands.updateDeviceGroupLight(this.deviceGroup)).subscribe(
      data => {
        console.log(data);
        if (data.ReturnCode === 200) {
          notify('Daten wurden erfolgreich gespeichert.');
          this.popupPropertiesVisible = false;
        } else {
          notify(data.ReturnMessage);
        }
      }
    );
  }

  calculateDayValues() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.calculateDayValues(this.customerIDFromURL, this.currentDevice.device_id, this.calculateDayValuesDate1, this.calculateDayValuesDate2)).subscribe(
      data => {
        console.log(data);
        if (data.ReturnCode === 200) {
          notify(data.ReturnMessage);
          this.popupCalculateDayValuesVisible = false;
        } else {
          notify(data.ReturnMessage);
        }
      }
    );
  }
}
