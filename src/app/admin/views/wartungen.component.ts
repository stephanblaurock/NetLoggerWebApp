import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {NetLoggerServiceCommands} from "../../service/netlogger.service.commands";
import {NetloggerService} from "../../service/netlogger.service";
import * as moment from "moment";

@Component({
  selector: 'app-wartungen',
  templateUrl: './wartungen.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class WartungenComponent implements OnInit {
  rueckgabe: string;
  healthStatusForAllCustomers = false;
  currentDate: Date;
  currentDeviceID = '';

  currentMobileNumber = '';
  currentMailAddress = '';
  currentUserID = '';
  currentStatusReportMode = '0';

  constructor(private netLoggerService: NetloggerService) { }

  ngOnInit() {
  }

  setDebugging(mode: boolean) {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.setDebugging(mode)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }


  validateLastConnected() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.validateLastConnected(custID)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  updateSensorGroupsCurrentValue() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.updateSensorGroupsCurrentValue(custID)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  refreshHealthStatus() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.refreshHealthStatus(custID)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  recalculateHealthStatus() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.recalculateHealthStatus(custID)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }


  recalculateMonthValues() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.recalculateMonthValues(custID, new Date(), new Date(), -1)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  recalculateYearValues() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.recalculateYearValues(custID, new Date(), new Date(), -1)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  recalculateAndValidateMonthValues() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.recalculateAndValidateAllMonthValues(custID)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  recalculateAndValidateYearValues() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.recalculateAndValidateAllYearValues(custID)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  onCurrentDateLeistungChanged($event) {

  }
  calculateDayValues() {
    this.rueckgabe = '';
    let custID = this.netLoggerService.getCurrentCustomerID();
    if (this.healthStatusForAllCustomers) {
      custID = -1;
    }
    this.netLoggerService.doCommand(NetLoggerServiceCommands.calculateDayValues(custID, +this.currentDeviceID, this.currentDate, new Date())).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  sendStatusNotification() {
    const mydate = moment(this.currentDate).utc(true).toDate();
    this.netLoggerService.doCommand(NetLoggerServiceCommands.sendStatusNotification(+this.currentUserID, mydate, this.currentMobileNumber, this.currentMailAddress, +this.currentStatusReportMode)).subscribe(
      data => {
        this.rueckgabe = data.ReturnCode + ': ' + data.ReturnMessage;
      }
    );
  }
  getFormattedDate(dateString: Date) {
    return moment(dateString).format('DD.MM.YYYY');
  }
}
