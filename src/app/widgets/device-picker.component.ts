import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetloggerService} from '../service/netlogger.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DeviceInfo, SummarizedSensorDeviceInfo} from '../models/devices';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
    selector: 'app-device-picker',
    templateUrl: './device-picker.component.html',
    styles: []
})
export class DevicePickerComponent implements OnInit, OnDestroy {
    cust_id = 0;
    private subroute: any;
    sensorDevices: SummarizedSensorDeviceInfo[];

    constructor(private netLoggerService: NetloggerService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.subroute = this.route.parent.params.subscribe(params => {
            this.cust_id = +params['id'];
            console.log('aktueller customer: ' + this.cust_id.toString());
            this.reloadDeviceAndSensorList();
        });
    }

    ngOnDestroy() {
        // this.subroute.unsubscribe();
    }

    reloadDeviceAndSensorList() {
        this.netLoggerService.doCommand(NetLoggerServiceCommands.getSummarizedDeviceAndSensorList(this.cust_id, true)).subscribe(
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

    getDeviceImageUrl(image_file: string) {
        return this.netLoggerService.url_netlogger_service + '/img/device_images/thumbs/' + image_file;
    }

    getUnitImageUrl(unit: string) {
        return '../../assets/unitimages/' + this.netLoggerService.getImageFromUnit(unit);
    }

    getClassnameSelected(device: DeviceInfo) {
        return device.selected ? 'nl-span-selected' : '';
    }

    toggleSelected(device: DeviceInfo) {
        console.log(device.caption + ': ' + device.selected);
        device.selected = !device.selected;
    }

    setSelectedDevices(deviceIDs: number[], resetSelection: boolean) {
        if (this.sensorDevices == null) {
            return;
        }
        for (let devicegroup of this.sensorDevices) {
            if (devicegroup) {
                for (let device of devicegroup.devices) {
                    if (deviceIDs.includes(device.id)) {
                        device.selected = true;
                    } else if (resetSelection) {
                        device.selected = false;
                    }
                }
            }
        }
    }
    getSelectedDeviceInfos() {
        let retval = new Array<DeviceInfo>();
        for (let devicegroup of this.sensorDevices) {
            if (devicegroup) {
                for (let device of devicegroup.devices) {
                    if (device.selected) {
                        device.caption_group = devicegroup.caption;
                        retval.push(device);
                    }
                }
            }
        }
        return retval;
    }
}
