import {
    Component, OnInit, ViewChild, ComponentRef, ComponentFactoryResolver, Injector,
    AfterViewInit, ElementRef, ApplicationRef
} from '@angular/core';
import {NetLoggerServiceCommands} from './service/netlogger.service.commands';
import {NetloggerService} from './service/netlogger.service';
import {DxTileViewModule, DxBoxModule, DxTileViewComponent} from 'devextreme-angular';
import {Router} from '@angular/router';
import {Customer} from './models/interfaces';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styles: []
})
export class CustomersComponent implements OnInit {
    // @ViewChild(DxTileViewComponent) mytile: DxTileViewComponent;
    customers: Customer[];

    onReloadClick() {

    }

    constructor(private netloggerService: NetloggerService,
                private router: Router,
                private resolver: ComponentFactoryResolver,
                private appRef: ApplicationRef,
                private injector: Injector) {

    }

    ngOnInit() {
      console.log('OnInit von customers-page');
        this.netloggerService.doCommand(NetLoggerServiceCommands.getCustomerList(false, 1)).subscribe(
            data => {
                if (data.ReturnCode === 200) {
                    // console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnValue);
                    // this.mytile.instance.beginUpdate();
                    this.customers = JSON.parse(data.ReturnValue);
                    // jetzt noch nach HealthStatus sortieren


                    // this.mytile.instance.endUpdate();
                    // console.log('lokales Customer-Array');
                    // console.log(this.customers);
                    // console.log(this.mytile.instance);
                } else if (data.ReturnCode === 401) {
                    this.router.navigate(['/login']);
                }
            }
        );
    }

    /*
    onTileClick(e) {
      // console.log("onTileClick");
        const cust = this.customers[e.itemIndex];
        // this.netloggerService.setCurrentCustomer(cust);
        // console.log(e);
        // this.router.navigate(['/customers', cust.cust_id, 'home', 1]);
        // Nachfolgende Zeile bewirkt, daß die App neu geladen wird und dann auch die Customer-Daten neu geholt werden
        this.router.navigateByUrl('/customers/' + cust.cust_id.toString());   // + '/home');
    }
*/
getHealthStatusColorClass(healthStatus: number) {
  if (healthStatus === -1) {
    return 'bg-danger';
  } else if (healthStatus === 0) {
    return 'bg-warning';
  } else {
    return 'bg-success';
  }
}

getHealthStatusBadgeColorClass(healthStatus: number) {
  if (healthStatus === -1) {
    return 'badge-danger';
  } else if (healthStatus === 0) {
    return 'badge-warning';
  } else {
    return 'badge-success';
  }
}

getHealthStatusShortText(healthStatus: number) {
  if (healthStatus === -1) {
    return 'Fehler';
  } else if (healthStatus === 0) {
    return 'Warnung';
  } else {
    return 'OK';
  }
}
    getHealthStatusClassName(health_status: number): string {
        return this.netloggerService.getHealthStatusClassName(health_status);
    }

    getHealthStatusCaption(health_status: number): string {
        return this.netloggerService.getHealthStatusCaption(health_status);
    }

    getHealthStatusColor(health_status: number): string {
      return this.netloggerService.getHealthStatusColor(health_status);
    }

}
