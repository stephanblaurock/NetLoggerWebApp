import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DisplayItemNumberValue} from '../models/interfaces';
import {NetloggerService} from '../service/netlogger.service';
import {Router} from '@angular/router';
import notify from 'devextreme/ui/notify';
import {JsonHelper} from '../utils/json/jsonhelper';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import * as moment from 'moment';
import {EventLog, EventLogFilter} from '../models/eventlog-models';

@Component({
    selector: 'app-eventlog-widget',
    templateUrl: './eventlog-widget.component.html',
    styles: []
})
export class EventlogWidgetComponent implements OnInit, OnChanges {
    @Input() eventLogFilter: EventLogFilter;
    @Input() showGlobalEventLog = false;
    eventLogs: EventLog[] = [];
    popupVisible = false;
    current_description = '';

    eventTypes: DisplayItemNumberValue[];
    currentEventType: DisplayItemNumberValue;
    currentCustomerID = 0;

    constructor(private netLoggerService: NetloggerService, private router: Router) {
        /*
         if (this.netLoggerService.current_customer != null)
             this.currentCustomerID = this.netLoggerService.current_customer.cust_id;
         this.netLoggerService.getCurrentCustomerObservable().subscribe(
             currentCustomerName => {
                 this.currentCustomerID = this.netLoggerService.current_customer.cust_id;
                 if (this.isInitialized)
                     this.reloadEventLog();
             }
         );
         */
        this.eventTypes = netLoggerService.getEventTypes();
        this.currentEventType = this.eventTypes[2];     // standardmässig auf 'Warning' stellen
    }

    isInitialized = false;

    ngOnInit() {
        this.isInitialized = true;
        // this.reloadEventLog();
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['eventLogFilter']) {
            console.log('EventLogFilter hat sich geändert!');
            this.reloadEventLog();
        }
    }

    reloadEventLog() {
        /*
        if (!this.eventLogFilter && this.showGlobalEventLog) {
            // wenn kein Filter übergeben wurde, dann handelt es sich um ein globales Customer-EventLog
            // in diesem Fall einfach den Customer aus dem Service beziehen
            this.eventLogFilter = {
                cust_id: 0,     //this.currentCustomerID,
                event_type_filter: 2,
                event_source_type_filter: -1,
                source_id_filter: -1,
                max_rows: 30
            };
        }
        */
        if (!this.eventLogFilter)
            return;
        this.currentCustomerID = this.eventLogFilter.cust_id;
        // this.eventLogFilter.cust_id = this.currentCustomerID;
        if (this.currentEventType)
            this.eventLogFilter.min_event_type = this.currentEventType.value;
        this.netLoggerService.doCommand(NetLoggerServiceCommands.getEventLogs(this.eventLogFilter))
            .subscribe(
                data => {
                    if (data.ReturnCode === 200) {
                        console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnCode + ' - ' + data.ReturnValue);
                        this.eventLogs = JSON.parse(data.ReturnValue);  // JsonHelper.DeserializeJsonWithDate(data.ReturnValue);
                        // console.log(this.eventLogs);
                        // console.log(this.eventLogs);
                    } else if (data.ReturnCode === 401) {
                        console.log(data.ReturnMessage);
                        this.router.navigate(['/login']);
                    } else {
                        console.log(data.ReturnMessage);
                        notify(data.ReturnMessage);
                    }
                }
            );
    }

    setCurrentEventType(eventType: DisplayItemNumberValue) {
        // this.eventLogFilter.event_type_filter = eventType.value;
        this.currentEventType = eventType;
        this.reloadEventLog();
    }

    showDescription(param: any) {
        let desc = param.data.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
        if (param.data.ack) {
            desc += '<br/><b>Dieses Ereignis wurde am ' + moment(param.data.ack_timestamp).format('DD.MM.YYYY HH:mm') + ' von '+param.data.ack_user + ' quittiert!</b>';
        }
        this.current_description = desc;
        this.popupVisible = true;
    }

    setACK(param: any) {
        // console.log(param);
        let cust_id = param.data.cust_id;
        let eventlog_ids = [param.data.event_id];
        // console.log(param.data);
        // if (this.netLoggerService.current_customer != null)
        //    cust_id = this.netLoggerService.current_customer.cust_id;
        this.netLoggerService.doCommand(NetLoggerServiceCommands.setACK(cust_id, eventlog_ids))
            .subscribe(
                data => {
                    if (data.ReturnCode === 200) {
                        // console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnCode+' - '+data.ReturnValue);
                        // this.eventLogs = JSON.parse(data.ReturnValue);  // JsonHelper.DeserializeJsonWithDate(data.ReturnValue);
                        param.data.ack = true;
                        param.data.ack_timestamp = new Date();
                        param.data.ack_user = this.netLoggerService.current_user_name;
                        // console.log(this.eventLogs);
                    } else if (data.ReturnCode === 401) {
                        console.log(data.ReturnMessage);
                        this.router.navigate(['/login']);
                    } else {
                        console.log(data.ReturnMessage);
                        notify(data.ReturnMessage);
                    }
                }
            );
    }

    getEventTypeClassName(value) {
        if (value < 2) {
            return 'glyphicon glyphicon-info-sign';
        } else if (value === 2) {
            return 'glyphicon glyphicon-alert text-warning';
        } else {
            return 'glyphicon glyphicon-alert text-danger';
        }
    }

    getDateString(value) {
        return moment(value).format('DD.MM.YYYY HH:mm');        // 'YYYY-MM-DD HH:mm')
    }

    customizeText(cellInfo) {
        return cellInfo.value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    deleteAllEventLogs() {
        if (!this.eventLogFilter)
            return;
        // this.eventLogFilter.cust_id = this.currentCustomerID;
        if (this.currentEventType)
            this.eventLogFilter.min_event_type= this.currentEventType.value;
        console.log(this.eventLogFilter);
/*
        this.netLoggerService.doCommand(NetLoggerServiceCommands.deleteEventLogs(this.eventLogFilter))
            .subscribe(
                data => {
                    if (data.ReturnCode === 200) {
                        // console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnCode+' - '+data.ReturnValue);
                        // this.eventLogs = JSON.parse(data.ReturnValue);  // JsonHelper.DeserializeJsonWithDate(data.ReturnValue);
                        // console.log(this.eventLogs);
                        // console.log(this.eventLogs);
                        notify(data.ReturnMessage);
                    } else if (data.ReturnCode === 401) {
                        console.log(data.ReturnMessage);
                        this.router.navigate(['/login']);
                    } else {
                        console.log(data.ReturnMessage);
                        notify(data.ReturnMessage);
                    }
                }
            );
*/
    }

}
