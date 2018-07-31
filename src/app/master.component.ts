import { Component, OnInit } from '@angular/core';
import { NetloggerService } from './service/netlogger.service';
import { Router } from '@angular/router';
import { NetLoggerServiceCommands } from './service/netlogger.service.commands';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styles: []
})
export class MasterComponent implements OnInit {
  isCollapsed = true;
  isAuthenticated = false;
  isAdmin = false;
  current_user_name = '';
  healthStatusImage = '../assets/navicons/ok.png';
  healthStatus = 1;
  healthStatusColorClass = 'badge-success';
  healthStatusShortText = 'OK';

  constructor(
    private netloggerService: NetloggerService,
    private router: Router
  ) {
    this.netloggerService.getIsAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
      this.current_user_name = this.netloggerService.current_user_name;
      this.isAdmin = this.netloggerService.currentUserIsAdmin();
      this.refreshUserHealthStatus();
    });
    setTimeout(() => {
      this.refreshUserHealthStatus();
    }, 60000); // 600.000 = 10min, 60.000 = 1min
  }

  ngOnInit() {
    this.netloggerService.updateAuthState();
    this.refreshUserHealthStatus();
  }
  onLogout() {
    this.netloggerService.logout();
    this.router.navigate(['/login']);
  }

  navLinkClicked() {
    if  (!this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

  refreshUserHealthStatus() {
    this.netloggerService
      .doCommand(NetLoggerServiceCommands.getUserHealthStatus())
      .subscribe(data => {
        if (data.ReturnCode === 200) {
          this.healthStatus = +data.ReturnValue;
          console.log(this.healthStatus);
          if (this.healthStatus === -1) {
            this.healthStatusColorClass = 'badge-danger';
            this.healthStatusShortText = 'F';
          } else if (this.healthStatus === 0) {
            this.healthStatusColorClass = 'badge-warning';
            this.healthStatusShortText = 'W';
          } else {
            this.healthStatusColorClass = 'badge-success';
            this.healthStatusShortText = 'OK';
          }
          /*
          this.healthStatusImage =
            '../assets/navicons/' +
            this.netloggerService.getHealthStatusImage(userHealthStatus);*/
          // this.failureLinkCaption = this.netloggerService.getHealthStatusCaption(userHealthStatus);
          // this.failureLinkClass = this.netloggerService.getHealthStatusClassName(userHealthStatus);
        } else {
          console.log('GetUserHealthStatus-Antwort: ' + data.ReturnMessage);
        }
      });
  }
}
