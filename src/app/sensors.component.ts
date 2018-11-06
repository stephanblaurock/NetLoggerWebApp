import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NetloggerService} from './service/netlogger.service';
import {DxTileViewComponent} from 'devextreme-angular';
import {SummarizedSensorDeviceInfo} from './models/devices';
import {NetLoggerServiceCommands} from './service/netlogger.service.commands';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styles: []
})
export class SensorsComponent implements OnInit, OnDestroy {
  @ViewChild(DxTileViewComponent) mytile: DxTileViewComponent;
  isAdmin = false;
  showSensors = false;
  cust_id = 0;
  private subroute: any;
  sensorDevices: SummarizedSensorDeviceInfo[];
  currentDeviceGroup: SummarizedSensorDeviceInfo;

  dropdownCreateItems = [{caption: 'neuer Sensor mit Meßspur', id: 0}, {caption: 'neue Meßspur ohne Sensor', id: 1}];
  // POPUP für das erzeugen einer neuen Meßspur
  popupCreateDeviceGroupVisible = false;
  createDeviceGroupCaption = 'neue Meßspur';
  // POPUP für das erzeugen eines neuen Sensors
  popupCreateSensorGroupVisible = false;
  createSensorGroupCaption = 'neuer Sensor';
  sensorGroupTemplates = [];
  selectedTemplate: any;

  constructor(private netloggerService: NetloggerService, private router: Router, private route: ActivatedRoute) {
    this.isAdmin = this.netloggerService.currentUserIsAdmin();    // this.netloggerService.current_user_name === 'admin@netlogger.eu';
  }

  ngOnInit() {
    // console.log(this.route.parent);
    this.subroute = this.route.parent.params.subscribe(params => {
      this.cust_id = +params['id'];
      if (this.cust_id !== 14) {   // SPN darf keine Sensoren sehen, die haben das nicht bestellt
        this.showSensors = true;
      }
      console.log('aktueller customer: ' + this.cust_id.toString());
      this.reloadDeviceAndSensorList();
    });
    this.netloggerService.setHeadline('');
  }

  ngOnDestroy() {
    // this.subroute.unsubscribe();
  }

  reloadDeviceAndSensorList() {
    this.netloggerService.doCommand(NetLoggerServiceCommands.getSummarizedDeviceAndSensorList(this.cust_id, false)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          // console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnValue);
          // this.mytile.instance.beginUpdate();
          this.sensorDevices = JSON.parse(data.ReturnValue);
          // this.mytile.instance.endUpdate();
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  reloadSensorGroupTemplates() {
    this.netloggerService.doCommand(NetLoggerServiceCommands.getSensorGroupList(this.cust_id, false, true, false, false, '')).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          console.log(data.ReturnValue);
          this.sensorGroupTemplates = JSON.parse(data.ReturnValue);
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  setCurrentDeviceGroup(dev: SummarizedSensorDeviceInfo) {
    this.currentDeviceGroup = dev;
  }

  getConnectionImage(isConnected: boolean) {
    return isConnected ? 'connected_green.png' : 'disconnected_orange.png';
  }

  getDeviceImageUrl(image_file: string) {
    return this.netloggerService.url_netlogger_service + '/img/device_images/thumbs/' + image_file;
  }

  getHealthStatusColor(sdeviceInfo: SummarizedSensorDeviceInfo): string {
    if (sdeviceInfo.is_active) {
      return this.netloggerService.getHealthStatusColor(sdeviceInfo.health_status);
    } else {
      return this.netloggerService.getHealthStatusColor(99);    // deaktivierter Sensor
    }
  }

  getTileStyle(sdeviceInfo: SummarizedSensorDeviceInfo) {
    if (!sdeviceInfo.is_active) {
      return {'opacity': 0.8};
    }
    return {};
  }

  getDecimalPlaces(sensor: SummarizedSensorDeviceInfo) {
    return '1.0-0'; // + sensor.decimal_places.toString() + '-' + sensor.decimal_places.toString();
  }

  getFormattedDateTime(dateTimeString: string) {
    return this.netloggerService.getFormattedDateTime(dateTimeString);
  }

  createElement(id: number) {
    if (id === 0) {
      this.reloadSensorGroupTemplates();
      this.popupCreateSensorGroupVisible = true;
    } else if (id === 1) {
      this.popupCreateDeviceGroupVisible = true;
    }
  }

  saveAndClosePopupCreateDevice() {
    this.netloggerService.doCommand(NetLoggerServiceCommands.createDeviceGroup(this.cust_id, this.createDeviceGroupCaption)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.reloadDeviceAndSensorList();
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
    this.popupCreateDeviceGroupVisible = false;
  }

  saveAndClosePopupCreateSensorGroup() {
    // console.log('folgendes Template wurde ausgewählt:');
    // console.log(this.selectedTemplate);

    this.netloggerService.doCommand(NetLoggerServiceCommands.copySensorGroup(0, this.selectedTemplate, this.cust_id, false)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.reloadDeviceAndSensorList();
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );

    this.popupCreateSensorGroupVisible = false;
  }


}
