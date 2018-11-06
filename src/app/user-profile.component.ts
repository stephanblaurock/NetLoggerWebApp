import {Component, OnInit, ViewEncapsulation, HostListener, ViewChild} from '@angular/core';
import {UserProfile} from './models/user-models';
import {NetLoggerServiceCommands} from './service/netlogger.service.commands';
import {NetloggerService} from './service/netlogger.service';
import notify from 'devextreme/ui/notify';
import {EnergyBalanceConfig} from './models/dashboards/energy-balance';
import {Router} from '@angular/router';
import { DxFormComponent } from '../../node_modules/devextreme-angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  @ViewChild(DxFormComponent) myform: DxFormComponent;
  userProfile: UserProfile;
  isAdmin = false;
  innerWidth: any;
  labelLocation = 'left';

  constructor(private netLoggerService: NetloggerService, private router: Router) {
    this.isAdmin = this.netLoggerService.currentUserIsAdmin();
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.labelLocation = this.innerWidth > 500 ? 'left' : 'top';
    this.netLoggerService.doCommand(NetLoggerServiceCommands.getUserProfile()).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          this.userProfile = JSON.parse(data.ReturnValue);
          // let dc = new EnergyBalanceConfig();
          // dc = Object.assign(dc, this.dashboard.config);
          // dc.validate();
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.labelLocation = this.innerWidth > 500 ? 'left' : 'top';
  }

  saveProfile() {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.setUserProfile(this.userProfile)).subscribe(
      data => {
        notify(data.ReturnMessage);
        // if (data.ReturnCode === 200) {
        // this.userProfile = JSON.parse(data.ReturnValue);
        // let dc = new EnergyBalanceConfig();
        // dc = Object.assign(dc, this.dashboard.config);
        // dc.validate();
        // }
      });
  }

  logout() {
    this.netLoggerService.logout();
    this.router.navigate(['/login']);
  }

  sendStatusMail() {
    this.sendUserNotification(true, false, false, false);
  }

  sendStatusMessage() {
    this.sendUserNotification(false, true, false, false);
  }

  sendErrorMail() {
    this.sendUserNotification(false, false, true, false);
  }

  sendErrorMessage() {
    this.sendUserNotification(false, false, false, true);
  }

  sendUserNotification(statusPerMail: boolean, statusPerMessenger: boolean, errorPerMail: boolean, errorPerMessenger: boolean) {
    this.netLoggerService.doCommand(NetLoggerServiceCommands.sendUserNotification(statusPerMail, statusPerMessenger,
      errorPerMail, errorPerMessenger)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          notify(data.ReturnMessage);
        }
      }
    );
  }
}
