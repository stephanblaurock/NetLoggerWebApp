import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NetloggerService} from './service/netlogger.service';
import {NetLoggerServiceCommands} from './service/netlogger.service.commands';
import {Dashboard} from './models/interfaces';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styles: []
})
export class DashboardsComponent implements OnInit {
  isAdmin = false;
  dropdownCreateItems = [{caption: 'Energie-Bilanz', id: 1}, {caption: 'Energie-Zähler', id: 2}];
  cust_id = 0;
  dashboards: Dashboard[];
  private subroute: any;

  constructor(private netloggerService: NetloggerService, private router: Router, private route: ActivatedRoute) {
    this.isAdmin = this.netloggerService.currentUserIsAdmin();
  }

  ngOnInit() {
    this.netloggerService.setHeadline('');
    this.subroute = this.route.parent.params.subscribe(params => {
      this.cust_id = +params['id'];
      // console.log('aktueller customer: ' + this.cust_id.toString());
      this.reloadDashboardList();
    });
  }

  reloadDashboardList() {
    this.netloggerService.doCommand(NetLoggerServiceCommands.getDashboardList(this.cust_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          // console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnValue);
          // this.mytile.instance.beginUpdate();
          this.dashboards = JSON.parse(data.ReturnValue);
          // this.mytile.instance.endUpdate();
        } else if (data.ReturnCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  getDashboardThumbnailUrl(dashboard_type: number) {
    return '../assets/dashboardimages/' + this.netloggerService.getDashboardThumbnail(dashboard_type);
  }

  getDashboardRouterLink(dashboard_id: number, dashboard_type: number) {
    if (dashboard_type === 1) {
      // Energy-Bilanz-Dashboard
      return [dashboard_id, 'energy-balance'];
    }
    return [dashboard_id];
  }

  editDashboard($event, dashboard_id: number, dashboard_type: number) {
    if (dashboard_type === 1) {
      this.router.navigateByUrl('/customers/' + this.cust_id + '/dashboards/' + dashboard_id + '/energy-balance-edit');
    } else if (dashboard_type === 2) {
      this.router.navigateByUrl('/customers/' + this.cust_id + '/dashboards/' + dashboard_id + '/energy-counters-edit');
    }
    // $event.stopPropagation();
  }

  showDashboard($event, dashboard_id: number, dashboard_type: number) {
    // console.log('cust_id: '+this.cust_id);
    if (dashboard_type === 1) {
      this.router.navigateByUrl('/customers/' + this.cust_id + '/dashboards/' + dashboard_id + '/energy-balance');
    } else if (dashboard_type === 2) {
      this.router.navigateByUrl('/customers/' + this.cust_id + '/dashboards/' + dashboard_id + '/energy-counters');
    }
  }

  createDashboard(dashboard_type: number) {
    if (dashboard_type === 1) {
      this.router.navigateByUrl('/customers/' + this.cust_id + '/dashboards/0/energy-balance-edit');
    } else if (dashboard_type === 2) {
      this.router.navigateByUrl('/customers/' + this.cust_id + '/dashboards/0/energy-counters-edit');
    }
  }

  getHealthStatusColor(health_status: number): string {
    return this.netloggerService.getHealthStatusColor(health_status);
  }
}
