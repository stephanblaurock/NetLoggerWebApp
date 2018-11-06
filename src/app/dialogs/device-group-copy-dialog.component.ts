import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NetloggerService } from '../service/netlogger.service';
import { NetLoggerServiceCommands } from '../service/netlogger.service.commands';
import { DeviceGroupLight } from '../models/devices';
import notify from 'devextreme/ui/notify';
import { DeviceGroup } from '../models/interfaces';

@Component({
  selector: 'app-device-group-copy-dialog',
  templateUrl: './device-group-copy-dialog.component.html',
  styles: []
})

export class DeviceGroupCopyDialogComponent implements OnInit {
  private parentRoute: any;
  customerIDFromURL: number;
  devicegroup_id: number;
  deviceGroup: DeviceGroupLight = undefined;
  deviceGroupList: DeviceGroup[];

  selectedDateFrom = new Date();
  selectedDateTo = new Date();
  selectedDestDeviceGroupID = 0;
  destDeviceGroupCaption = '';

  errortext = undefined;
  successtext = undefined;

  constructor(private netLoggerService: NetloggerService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.parentRoute = this.route.parent.params.subscribe(params => {
      this.customerIDFromURL = +params['id'];
    });
    this.devicegroup_id = +this.route.snapshot.queryParams.devicegroup_id;
    this.reloadDeviceGroup();
    this.reloadDeviceGroupList();
  }

  reloadDeviceGroup() {
    if (this.devicegroup_id <= 0) {
      notify('Ungültige Meßspurgruppe!');
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getDeviceGroupLight(this.customerIDFromURL, this.devicegroup_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
         this.deviceGroup = JSON.parse(data.ReturnValue);
         // notify(data.ReturnMessage + data.ReturnValue);
        } else if (data.ReturnCode === 400) {
          // notify(data.ReturnMessage + data.ReturnValue);
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }
  reloadDeviceGroupList() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getDeviceGroupList(this.customerIDFromURL, -1, false)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
         this.deviceGroupList = JSON.parse(data.ReturnValue);
         console.log(this.deviceGroupList);
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  onDestDeviceGroupChanged($event) {
    //console.log($event);
  }

  save() {
    //console.log(this.selectedDestDeviceGroupID);
    let deviceIDList = [];
    for (const device of this.deviceGroup.devices) {
      if (device.is_active) {
        deviceIDList.push(device.device_id);
      }
    }
    const cmd = NetLoggerServiceCommands.copyDeviceGroup(this.customerIDFromURL, this.devicegroup_id, this.selectedDestDeviceGroupID,
      this.destDeviceGroupCaption, deviceIDList, this.selectedDateFrom, this.selectedDateTo);
    console.log('copy-command');
    console.log(cmd);
    this.netLoggerService.doCommand(cmd).subscribe(
      data => {
        if (data.ReturnCode === 200) {
         this.successtext = data.ReturnMessage + '<br/>' + data.ReturnValue;
        } else if (data.ReturnCode === 400) {
          this.errortext = data.ReturnMessage + '<br/>' + data.ReturnValue;
        } else {
          if (data.ReturnCode === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }
  cancel() {
    this.router.navigateByUrl('/customers/' + this.customerIDFromURL + '/sensors');
  }

}
