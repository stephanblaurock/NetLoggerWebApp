import {Component, OnInit} from '@angular/core';
import {NavItem} from './models/navitem';
import {ActivatedRoute, Router} from '@angular/router';
import {NetloggerService} from './service/netlogger.service';
import {NetLoggerServiceCommands} from './service/netlogger.service.commands';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  locale: string;
  private subroute: any;
  isAuthenticated = false;
  cust_id = 0;
  current_user_name = '';
  current_headline = '';
  healthStatusImage = '../assets/navicons/ok.png';
  navitems: NavItem[] = [
    {caption: 'Home', imagefilename: 'home', routerlink: '/customers'},
    {caption: 'Dashboards', imagefilename: 'dashboard', routerlink: '/dashboards'},
    {caption: 'Sensoren', imagefilename: 'proximity_sensor', routerlink: '/sensors'},
    {caption: 'Aktoren', imagefilename: 'switch', routerlink: '/actors'}
  ];


  constructor(private netloggerService: NetloggerService, private router: Router, private route: ActivatedRoute) {
    console.log('home.constructor');
    // wenn kein Customer gesetzt ist, dann einen setzen (aus der URL)

    // if (this.netloggerService.current_customer == null)
    //    this.router.navigateByUrl('/customers');
    this.netloggerService.getIsAuthenticated().subscribe(
      authStatus => {
        this.isAuthenticated = authStatus;
        this.current_user_name = this.netloggerService.current_user_name;
      }
    );
    this.netloggerService.getCurrentHeadlineObservable().subscribe(
      currentHeadlineCaption => {
        this.current_headline = currentHeadlineCaption;
        // if (this.netloggerService.current_customer != null) {
        //    let custID = this.netloggerService.current_customer.cust_id;
        //    this.buildNavigationButtons(custID);
        // }
      }
    );
    setTimeout(() => {
      this.refreshUserHealthStatus();
    }, 60000);     // 600.000 = 10min, 60.000 = 1min
    console.log('home.endconstructor');
  }

  ngOnInit() {
    console.log('home.oninit');
    this.subroute = this.route.params.subscribe(params => {
      this.cust_id = +params['id'];
      console.log('Route.parent:');
      console.log(params);
     //  this.netloggerService.setCurrentCustomerByID(this.cust_id);
      this.netloggerService.setCurrentCustomerByID(this.cust_id);
      this.buildNavigationButtons(this.cust_id);
    });
    // this.netloggerService.updateAuthState();
    // this.netloggerService.setCurrentCustomer(this.netloggerService.current_customer);
    // if (this.netloggerService.current_customer != null) {
    //    this.buildNavigationButtons(this.netloggerService.current_customer.cust_id);
    // }
    this.refreshUserHealthStatus();
    console.log('home.endoninit');
  }

  //onLogout() {
  //  this.netloggerService.logout();
  //  this.router.navigate(['/login']);
  //}

  buildNavigationButtons(cust_id: number) {
    this.navitems = [
      {caption: 'Home', imagefilename: 'home', routerlink: '/customers/' + cust_id.toString() + '/home/1'},
      {
        caption: 'Dashboards',
        imagefilename: 'dashboard',
        routerlink: '/customers/' + cust_id.toString() + '/dashboards'
      },
      {
        caption: 'Sensoren',
        imagefilename: 'proximity_sensor',
        routerlink: '/customers/' + cust_id.toString() + '/sensors'
      },
      {caption: 'Aktoren', imagefilename: 'switch', routerlink: '/customers/' + cust_id.toString() + '/actors'}
    ];
  }

  // failureLinkCaption = "label-success";
  // failureLinkClass = "alles in Ordnung!";
  refreshUserHealthStatus() {
    this.netloggerService.doCommand(NetLoggerServiceCommands.getUserHealthStatus())
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            const userHealthStatus = +data.ReturnValue;
            this.healthStatusImage = '../assets/navicons/' + this.netloggerService.getHealthStatusImage(userHealthStatus);
            // this.failureLinkCaption = this.netloggerService.getHealthStatusCaption(userHealthStatus);
            // this.failureLinkClass = this.netloggerService.getHealthStatusClassName(userHealthStatus);
          } else {
            console.log('GetUserHealthStatus-Antwort: ' + data.ReturnMessage);
          }
        }
      );
  }

  updateGlobalUserHealthStatus() {
    this.netloggerService.doCommand(NetLoggerServiceCommands.refreshHealthStatus(-1))
      .subscribe(
        data => {
          if (data.ReturnCode === 200) {
            notify('Health-Status wurde komplett neu berechnet!');
            this.refreshUserHealthStatus();

          } else {
            console.log('GetUserHealthStatus-Antwort: ' + data.ReturnMessage);
          }
        }
      );
  }
}
