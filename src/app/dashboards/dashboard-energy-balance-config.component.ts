import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {DevicePickerComponent} from '../widgets/device-picker.component';
import popup from 'devextreme/ui/popup';
import {EnergyBalanceConfig} from '../models/dashboards/energy-balance';
import {DeviceInfo} from '../models/devices';
import {ActivatedRoute, Router} from '@angular/router';
import {NetloggerService} from '../service/netlogger.service';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import {Dashboard} from '../models/dashboard';

@Component({
    selector: 'app-dashboard-energy-balance-config',
    templateUrl: './dashboard-energy-balance-config.component.html',
    styles: []
})
export class DashboardEnergyBalanceConfigComponent implements OnInit {
    @ViewChild('devPicker') devicePicker: DevicePickerComponent;
    popupVisible = false;
    currentPopupCat = 'arbeit'
    dashboard = new Dashboard();
    //  dashboardConfig = new EnergyBalanceConfig();
    cust_id = 0;
    dashboard_id = 0;
    private parentRoute: any;
    private currentRoute: any;

    constructor(private netLoggerService: NetloggerService, private router: Router, private route: ActivatedRoute, private mylocation: Location) {
    }

    ngOnInit() {
        this.dashboard = new Dashboard();
        this.dashboard.config = new EnergyBalanceConfig();
        // this.dashboardConfig.caption = 'neu';
        // this.dashboardConfig.devices_leistung = null;
        // this.dashboardConfig.devices_arbeit = null;
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
                        let dc = new EnergyBalanceConfig();
                        dc = Object.assign(dc, this.dashboard.config);
                        this.dashboard.config = dc;
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
        // alert('ich speichere...');
        if (this.dashboard_id === 0) {
            // beim neuen Dashboard noch einiges erledigen
            this.dashboard.id = 0;
            this.dashboard.cust_id = this.cust_id;
            this.dashboard.dashboard_type = 1;
            // this.dashboard.config.cust_id = this.cust_id;
            // this.dashboard.dashboard_type = 1;
            // this.dashboard.config.dashboard_type = 1;
        }
        this.dashboard.config.dashboard_type = 1;
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

    addSensor(cat: string) {
        this.currentPopupCat = cat;
        this.popupVisible = true;
        if (this.devicePicker) {
            this.devicePicker.setSelectedDevices([0], true);
        }
    }
    removeSensor(cat: string, id: number) {
        if (cat === 'leistung') {
            this.removeDevice(id, this.dashboard.config.devices_leistung);
        } else if (cat === 'arbeit') {
            this.removeDevice(id, this.dashboard.config.devices_arbeit);
        }
    }
    public removeDevice(device_id: number, devArr) {
        let index = -1;
        let currentIndex = 0;
        for (const device of devArr) {
            if (device.id === device_id) {
                index = currentIndex;
                //break;
            }
            currentIndex++;
        }
        if (index >= 0) {
            devArr.splice(index, 1);
        }
    }

    saveAndClosePopup() {
        let selDevs = this.devicePicker.getSelectedDeviceInfos();
        if (selDevs && selDevs.length > 0) {
            // console.log('dashboard-config:');
            // console.log(this.dashboardConfig.devices_leistung === null);
            // console.log('currentCat: ' + this.currentPopupCat);
            if (this.currentPopupCat === 'leistung' && this.dashboard.config.devices_leistung === null) {
                this.dashboard.config.devices_leistung = new Array<DeviceInfo>();
            }
            if (this.currentPopupCat === 'arbeit' && this.dashboard.config.devices_arbeit === null) {
                this.dashboard.config.devices_arbeit = new Array<DeviceInfo>();
            }
            // console.log(this.dashboardConfig);
            for (let devInfo of selDevs) {
                if (this.currentPopupCat === 'leistung') {
                    this.dashboard.config.devices_leistung.push(devInfo);
                } else {
                    this.dashboard.config.devices_arbeit.push(devInfo);
                }
            }
        }
        this.popupVisible = false;
    }

    getUnitImageUrl(unit: string) {
        return '../../assets/unitimages/' + this.netLoggerService.getImageFromUnit(unit);
    }

    goBack() {
        this.mylocation.back();
    }
}
