import {Component, OnInit} from '@angular/core';
import {NetloggerService} from './service/netlogger.service';
import {NetLoggerServiceCommands} from './service/netlogger.service.commands';
import {FailureListItem, FailureListDeviceItem} from './models/interfaces';
import {JsonHelper} from './utils/json/jsonhelper';
import {EventLogFilter} from './models/eventlog-models';

@Component({
    selector: 'app-failure-list',
    templateUrl: './failure-list.component.html',
    styles: [`
        .failure_item:hover {
            background-color: #9298a2;
            cursor: hand;
        }
`]
})
export class FailureListComponent implements OnInit {
    failureListItems: FailureListItem[] = [];
    selectedFailureListDeviceItems: FailureListItem[] = [];
    eventLogFilter: EventLogFilter;
    private url_netlogger_service = '';

    constructor(private netLoggerService: NetloggerService) {
        this.url_netlogger_service = netLoggerService.url_netlogger_service;
    }

    ngOnInit() {
        this.netLoggerService.doCommand(NetLoggerServiceCommands.getFailureList())
            .subscribe(
                data => {
                    if (data.ReturnCode === 200) {
                        console.log('Ich bekam folgendes vom Server:');
                        console.log(data.ReturnValue);
                        this.failureListItems = JSON.parse(data.ReturnValue);   // JsonHelper.DeserializeJsonWithDate(data.ReturnValue);
                    } else {
                        console.log(data.ReturnMessage);
                    }
                }
            );
    }


    getImageUrl(cust_id: number) {
        // return this.url_netlogger_service + '/img/cust_images/' + cust_id + '.jpg';
        return 'http://netlogger.eu:8992/img/cust_images/' + cust_id + '.jpg';
    }

    getHealthStatusClassName(health_status: number): string {
        return this.netLoggerService.getHealthStatusClassName(health_status);
    }

    getHealthStatusCaption(health_status: number): string {
        return this.netLoggerService.getHealthStatusCaption(health_status);
    }

    getSourceTypeCaption(source_type: number) {
        return this.netLoggerService.getSourceTypeCaption(source_type);
    }

    onSelectionChanged() {
        console.log('Selektiertes Device geändert!');
        console.log(this.selectedFailureListDeviceItems);
        if (this.selectedFailureListDeviceItems && this.selectedFailureListDeviceItems.length > 0) {
            console.log(this.selectedFailureListDeviceItems[0].items[0]);
            let evLog = new EventLogFilter();
            evLog.cust_id = this.selectedFailureListDeviceItems[0].items[0].cust_id;
            evLog.max_rows = 80;
            evLog.source_id_filter = this.selectedFailureListDeviceItems[0].items[0].source_id;
            evLog.event_source_type_filter = this.selectedFailureListDeviceItems[0].items[0].event_source_type;
            evLog.min_event_type = 2;        // alles was über Warnings vorhanden ist.
            console.log('Folgender EventLogFilter');
            console.log(evLog);
            // Da das eventLogFilter-Objekt an die eventLogWidget-Component gebunden ist, reicht die Zuweisung folgneder
            // Eigenschaft aus, um die EventLog-Liste upzudaten
            this.eventLogFilter = evLog;
        }
    }
}
