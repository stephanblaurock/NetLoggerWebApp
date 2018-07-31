import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {NetloggerService} from '../service/netlogger.service';
import {DeviceInfo} from '../models/devices';
import {Device, ManualValue} from '../models/interfaces';
import * as moment from 'moment';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-manage-manual-values',
  templateUrl: './manage-manual-values.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class ManageManualValuesComponent implements OnInit, OnChanges {
  @Input() custID = 0;
  @Input() currentDevice: Device;
  manualValueTimeStamp = new Date();
  manualValue = 0;
  manualValueInterpolate = false;
  manualValueHistory: ManualValue[];

  constructor(private netLoggerService: NetloggerService) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['custID'] || changes['currentDevice']) {
      this.reloadDeviceHistory();
    }
  }

  reloadDeviceHistory() {
    if (this.currentDevice && this.custID > 0) {
      this.netLoggerService.doCommand(NetLoggerServiceCommands.getManualValueList(this.custID, this.currentDevice.device_id, 20)).subscribe(
        data => {
          console.log(data);
          if (data.ReturnCode === 200) {
            this.manualValueHistory = JSON.parse(data.ReturnValue);
          } else {
            notify(data.ReturnMessage);
          }
        }
      );

    }
  }

  setManualValue() {
    const mv = new ManualValue();
    mv.device_id = this.currentDevice.device_id;
    mv.interpolate = this.manualValueInterpolate;
    mv.timestamp = moment(this.manualValueTimeStamp).utc(true).toDate();
    mv.value = this.manualValue;
    this.netLoggerService.doCommand(NetLoggerServiceCommands.uploadManualValue(this.custID, true, mv)).subscribe(
      data => {
        console.log(data);
        if (data.ReturnCode === 200) {
          notify('Wert wurde erfolgreich zum Server übertragen.');
        } else if (data.ReturnCode === 401) {
          // this.router.navigate(['/login']);
          notify('Sie sind leider nicht angemeldet!');
        } else {
          notify(data.ReturnMessage);
        }
      }
    );
  }

  getFormattedDateTime(dateTimeString: string) {
    return this.netLoggerService.getFormattedDateTime(dateTimeString);
  }
}
