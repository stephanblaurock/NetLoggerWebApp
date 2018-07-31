import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {EventLog, EventLogFilter, EventLogPlainItem} from '../models/eventlog-models';
import {NetloggerService} from '../service/netlogger.service';
import {Router} from '@angular/router';
import {Customer, DisplayItemNumberValue} from '../models/interfaces';
import notify from 'devextreme/ui/notify';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import {EventLogPlainGroup} from '../models/eventlog-models';
import * as moment from 'moment';


@Component({
  selector: 'app-eventlog-plain-widget',
  templateUrl: './eventlog-plain-widget.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class EventlogPlainWidgetComponent implements OnInit, OnChanges {
  @Input() useExternalEventLogFilter = false;
  @Input() eventLogFilter: EventLogFilter;
  @Input() showCustomerDropDown = false;
  isAdmin = false;
  eventTypes: DisplayItemNumberValue[];
  currentEventType: number;
  eventLogs: EventLogPlainGroup[] = [];
  // @Input() showOnlyCurrentCustomer = true;
  customers: Customer[];
  currentCustomer: Customer;
  currentCustomerID = -1;
  currentEventLog: EventLog;
  popupVisible = false;

  constructor(private netLoggerService: NetloggerService, private router: Router) {
    this.isAdmin = this.netLoggerService.currentUserIsAdmin();
    this.eventTypes = netLoggerService.getEventTypes();
    this.currentEventType = 2;  // this.eventTypes[2];     // standardmässig auf 'Warning' stellen
    this.currentCustomer = this.netLoggerService.current_customer;
    if (this.currentCustomer)
      this.currentCustomerID = this.currentCustomerID;
    // this.currentCustomerID = this.netLoggerService.getCurrentCustomerID();
    // this.currentCustomerCaption = this.netLoggerService.getCurrentCustomerCaption();
  }

  ngOnInit() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getCustomerList(true, 0)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.customers = JSON.parse(data.ReturnValue);
          //console.log(this.customers);
        }
      });
    console.log('useExternalEventLogfilter:' + this.useExternalEventLogFilter.toString());

    if (!this.useExternalEventLogFilter) {
      this.eventLogFilter = new EventLogFilter();
      this.eventLogFilter.cust_id = -1;   //this.currentCustomerID;
      this.eventLogFilter.min_event_type = 2;
      this.eventLogFilter.max_rows = 50;
      this.reloadEventLog(-1);
      // this.reloadEventLog();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventLogFilter']) {
      console.log('EventLogFilter hat sich geändert!:');
      console.log(this.eventLogFilter);
      this.reloadEventLog(-1);
    } else if (changes['showOnlyCurrentCustomer']) {
      notify('CurrentCusteomerClicked');
    }
  }

  reloadEventLog(refreshCustomer: number) {
    if (!this.eventLogFilter) {
      console.log('EventLogFilter is nothing, also mach ich mal gar nix!');
      return;
    }


    // this.currentCustomerID = this.eventLogFilter.cust_id;
    // this.eventLogFilter.cust_id = this.currentCustomerID;
    this.eventLogFilter.min_event_type = this.currentEventType;

    if (!this.useExternalEventLogFilter) {
      /*
      if (this.currentCustomer) {
        this.eventLogFilter.cust_id = this.currentCustomer.cust_id;
      } else {
        this.eventLogFilter.cust_id = -1;
      }
      */
      if (refreshCustomer > -1) {
        this.eventLogFilter.cust_id = refreshCustomer;
      }
    }
    console.log('bevor ich hole: eventLogFilter:');
    console.log(this.eventLogFilter);
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getEventLogs(this.eventLogFilter))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            // console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnCode + ' - ' + data.ReturnValue);
            if (refreshCustomer === -1 || this.useExternalEventLogFilter) {
              this.eventLogs = JSON.parse(data.ReturnValue);  // JsonHelper.DeserializeJsonWithDate(data.ReturnValue);
            } else {
              // console.log(data.ReturnValue);
              const index = this.removeEventLogCustomer(refreshCustomer);
              // console.log('index = '+index+)
              if (!data.ReturnValue || data.ReturnValue.length === 0) {
                return;
              }
              const cEventLogs = JSON.parse(data.ReturnValue);
              // console.log('index=' + index + ' cEventLogs.length=' + cEventLogs.length + ' innerlength=');
              // console.log(cEventLogs);
              if (index >= 0 && cEventLogs && cEventLogs.length > 0 && cEventLogs[0].event_logs && cEventLogs[0].event_logs.length > 0) {
                this.eventLogs.splice(index, 0, cEventLogs[0]);
              }
            }
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

  getEventLogItem(custID: number, eventID: number): EventLogPlainItem {
    if (this.eventLogs) {
      for (const eg of this.eventLogs) {
        if (eg.cust_id === custID) {
          for (const egi of eg.event_logs) {
            if (egi.id === eventID) {
              return egi;
            }
          }
        }
      }
    }
    return null;
  }

  removeEventLogItem(custID: number, eventID: number): EventLogPlainItem {
    let index = 0;
    if (this.eventLogs) {
      for (const eg of this.eventLogs) {
        if (eg.cust_id === custID) {
          for (const egi of eg.event_logs) {
            if (egi.id === eventID) {
              eg.event_logs.splice(index, 1);
              break;
            }
            index++;
          }
        }
      }
    }
    return null;
  }

  public removeEventLogCustomer(custID: number): number {
    let indexFromItemToDelete = -1;
    let currentIndex = 0;
    for (let mycust of this.eventLogs) {
      if (mycust.cust_id === custID) {
        indexFromItemToDelete = currentIndex;
        break;
      }
      currentIndex++;
    }
    if (indexFromItemToDelete >= 0)
      this.eventLogs.splice(indexFromItemToDelete, 1);
    return indexFromItemToDelete;
  }

  public getEventIDsByCustomerID(custID: number): number[] {
    const retval: number[] = [];
    for (const mycust of this.eventLogs) {
      if (mycust.cust_id === custID) {
        for (const myitem of mycust.event_logs) {
          retval.push(myitem.id);
        }
        break;
      }
    }
    return retval;
  }

  setCurrentEventType(e) {
    // this.eventLogFilter.event_type_filter = eventType.value;
    console.log(e.itemData);
    this.currentEventType = e.itemData.value;
    this.reloadEventLog(-1);
  }

  setCurrentCustomer(e) {
    this.currentCustomer = e.itemData;
    if (this.currentCustomer)
      this.currentCustomerID = this.currentCustomer.cust_id;
    this.reloadEventLog(-1);
  }

  evClick(custID: number, eventID: number) {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getEventLog(custID, eventID))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            console.log(data.ReturnValue);
            this.currentEventLog = JSON.parse(data.ReturnValue);
            this.popupVisible = true;
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

  setAck(custID: number, item: EventLogPlainItem) {
    console.log(item);

    this.netLoggerService.doCommand(NetLoggerServiceCommands.setACK(custID, [item.id]))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            item.ack = true;
            item.act = new Date();
            item.acu = this.netLoggerService.current_user_name;
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

  allAck(custID: number) {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.setACK(custID, this.getEventIDsByCustomerID(custID)))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            this.reloadEventLog(custID);
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

  deleteEventLog(custID: number, item: EventLogPlainItem) {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.deleteEventLogs(custID, -1, -1, -1, -1, [item.id]))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            this.removeEventLogItem(custID, item.id);
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

  allDelete(custID: number) {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.deleteEventLogs(custID, -1, -1, -1, -1, this.getEventIDsByCustomerID(custID)))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            this.reloadEventLog(custID);
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

  }

  allDeleteComplete(custID: number) {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.deleteEventLogs(custID, this.currentEventType, -1, -1, -1, []))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            this.reloadEventLog(custID);
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
  }

  reloadCustomer(custIDd: number) {
    this.reloadEventLog(custIDd);
  }

  getDescriptionAsHtml() {
    if (this.currentEventLog) {
      return this.currentEventLog.description.replace(/\n/g, '<br>');   //.replace(/$/mg,'<br>');
    }
    return '';
  }

  getImageUrl(cust_id: number) {
    // return this.url_netlogger_service + '/img/cust_images/' + cust_id + '.jpg';
    if (cust_id === 0) {
      return 'http://netlogger.eu:8992/img/netlogger_small.png';
    } else {
      return 'http://netlogger.eu:8992/img/cust_images/' + cust_id + '.jpg';
    }
  }

  getDateString(value) {
    return moment(value).format('DD.MM.YYYY HH:mm');        // 'YYYY-MM-DD HH:mm')
  }

  getEventTypeCaption(evType: number) {
    return this.netLoggerService.getEventTypeCaption(evType);
  }

  getEventTypeClassName(evType: number): string {
    if (evType >= 3) {
      return 'badge badge-danger';
    } else if (evType === 2) {
      return 'badge badge-warning';
    } else {
      return 'badge badge-success';
    }
  }

  getSourceTypeCaption(srcType: number) {
    return this.netLoggerService.getSourceTypeCaption(srcType);
  }

  getHealthStatusCaption(health_status: number): string {
    if (health_status === 0) {
      return 'Warnung';
    } else if (health_status === -1) {
      return 'Fehler';
    } else {
      return 'OK';
    }
  }

  getHealthStatusColor(health_status: number): string {
    if (health_status === 0) {
      return '#FFC107';
    } else if (health_status === -1) {
      return '#D31D25';
    } else {
      return '#4CAF50';
    }
  }
}
