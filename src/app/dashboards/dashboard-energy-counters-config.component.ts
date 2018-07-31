import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {DevicePickerComponent} from '../widgets/device-picker.component';
import popup from 'devextreme/ui/popup';
import {DeviceInfo} from '../models/devices';
import {ActivatedRoute, Router} from '@angular/router';
import {NetloggerService} from '../service/netlogger.service';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import {Dashboard} from '../models/dashboard';
import {EnergyCountersConfig} from '../models/dashboards/energy-counters';
import {DisplayItemStringValue} from "../models/interfaces";

@Component({
  selector: 'app-dashboard-energy-counters-config',
  templateUrl: './dashboard-energy-counters-config.component.html',
  styles: []
})
export class DashboardEnergyCountersConfigComponent implements OnInit {
  @ViewChild('devPicker') devicePicker: DevicePickerComponent;
  popupVisible = false;
  // currentPopupCat = 'arbeit'
  dashboard = new Dashboard();
  monthly_recipients = new Array<DisplayItemStringValue>();
  cust_id = 0;
  dashboard_id = 0;
  private parentRoute: any;
  private currentRoute: any;

  constructor(private netLoggerService: NetloggerService, private router: Router, private route: ActivatedRoute, private mylocation: Location) {
  }

  ngOnInit() {
    this.dashboard = new Dashboard();
    this.dashboard.config = new EnergyCountersConfig();
    this.parentRoute = this.route.parent.params.subscribe(params => {
      this.cust_id = +params['id'];
    });
    this.currentRoute = this.route.params.subscribe(params => {
      this.dashboard_id = +params['id'];
    });
    this.reloadDashboardConfig();
  }

  reloadDashboardConfig() {
    // console.log('custid: ' + this.cust_id);
    // console.log('dashboard_id: ' + this.dashboard_id);
    if (this.dashboard_id > 0) {
      this.netLoggerService.doCommand(NetLoggerServiceCommands.getDashboard(this.cust_id, this.dashboard_id)).subscribe(
        data => {
          if (data.ReturnCode === 200) {
            this.dashboard = JSON.parse(data.ReturnValue);
            let dc = new EnergyCountersConfig();
            dc = Object.assign(dc, this.dashboard.config);
            this.dashboard.config = dc;
            // monthly-recipients extrahieren, damit ich das binden kann
            this.monthly_recipients = new Array<DisplayItemStringValue>();
            if (this.dashboard.config.monthly_recipients) {
              for (const r of this.dashboard.config.monthly_recipients) {
                const myrec = new DisplayItemStringValue();
                myrec.caption = r;
                this.monthly_recipients.push(myrec);
              }
            }
            this.netLoggerService.setHeadline(this.dashboard.caption);
            // this.mytile.instance.endUpdate();
          } else if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      );
    }
  }

  save() {
    if (this.dashboard_id === 0) {
      // beim neuen Dashboard noch einiges erledigen
      this.dashboard.id = 0;
      this.dashboard.cust_id = this.cust_id;
      this.dashboard.dashboard_type = 2;
    }
    this.dashboard.config.dashboard_type = 2;
    // monatlichen Empfänger in die config übertragen
    const recArr = new Array<string>();
    for (const r of this.monthly_recipients) {
      recArr.push(r.caption);
    }
    this.dashboard.config.monthly_recipients = recArr;
    console.log(this.dashboard);
    this.netLoggerService.doCommand(NetLoggerServiceCommands.updateDashboard(this.cust_id, this.dashboard)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          // this.dashboard = JSON.parse(data.ReturnValue);
          // this.mytile.instance.endUpdate();
          this.goBack();
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        } else {
          alert(data.ReturnMessage);
        }
      }
    );
  }

  delete() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.deleteDashboard(this.cust_id, this.dashboard.id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          // this.dashboard = JSON.parse(data.ReturnValue);
          // this.mytile.instance.endUpdate();
          this.goBack();
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        } else {
          alert(data.ReturnMessage);
        }
      }
    );
  }

  addSensor() {
    // this.currentPopupCat = cat;
    this.popupVisible = true;
    if (this.devicePicker) {
      this.devicePicker.setSelectedDevices([0], true);
    }
  }

  removeSensor(id: number) {
    this.removeDevice(id, this.dashboard.config.devices);
  }

  public removeDevice(device_id: number, devArr) {
    let index = -1;
    let currentIndex = 0;
    for (const device of devArr) {
      if (device.id === device_id) {
        index = currentIndex;
      }
      currentIndex++;
    }
    if (index >= 0) {
      devArr.splice(index, 1);
    }
  }

  saveAndClosePopup() {
    const selDevs = this.devicePicker.getSelectedDeviceInfos();
    if (selDevs && selDevs.length > 0) {
      this.dashboard.config.devices = new Array<DeviceInfo>();
      for (const devInfo of selDevs) {
        this.dashboard.config.devices.push(devInfo);
      }
    }
    this.popupVisible = false;
  }

  addRecipient() {
    this.monthly_recipients.push(new DisplayItemStringValue());
  }

  removeRecipient(email: string) {
    let index = -1;
    let currentIndex = 0;
    for (const devInfo of this.monthly_recipients) {
      if (devInfo.caption === email) {
        index = currentIndex;
      }
      currentIndex++;
    }
    if (index >= 0) {
      this.monthly_recipients.splice(index, 1);
    }
  }

  getUnitImageUrl(unit: string) {
    return '../../assets/unitimages/' + this.netLoggerService.getImageFromUnit(unit);
  }

  goBack() {
    this.mylocation.back();
  }
}
