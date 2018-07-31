import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {NetloggerService} from '../../service/netlogger.service';
import {NetLoggerServiceCommands} from '../../service/netlogger.service.commands';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class MessengerComponent implements OnInit {

  telegramCode = '';
  message = '';
  number = '';
  rueckgabe = '';

  constructor(private netLoggerService: NetloggerService) { }

  ngOnInit() {
  }

  makeAuthRequest() {
    this.rueckgabe = '';
    this.netLoggerService.doCommand(NetLoggerServiceCommands.telegramSendAuthRequest()).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.rueckgabe = 'Bitte übermitteln Sie den Code, den Sie von Telegram bekommen haben!';
        } else {
          this.rueckgabe = data.ReturnMessage;
        }
      }
    );
  }
  makeAuth() {
    this.rueckgabe = '';
    this.netLoggerService.doCommand(NetLoggerServiceCommands.telegramMakeAuth(this.telegramCode)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  reconnect() {
    this.rueckgabe = '';
    this.netLoggerService.doCommand(NetLoggerServiceCommands.telegramReconnect()).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }
  sendMessage() {
    this.rueckgabe = '';
    this.netLoggerService.doCommand(NetLoggerServiceCommands.telegramSendMessage(this.message, this.number)).subscribe(
      data => {
        this.rueckgabe = data.ReturnMessage;
      }
    );
  }

}
