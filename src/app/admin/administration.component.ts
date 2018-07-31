import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {NetloggerService} from '../service/netlogger.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationComponent implements OnInit {
  currentCustomerCaption = '';
  currentCustomerID = 0;

  constructor(private netLoggerService: NetloggerService, private router: Router) {
    this.currentCustomerCaption = this.netLoggerService.getCurrentCustomerCaption();
    this.currentCustomerID = this.netLoggerService.getCurrentCustomerID();
  }

  ngOnInit() {
  }

  onSelectedTabChanged(e) {
    // console.log(e);
    if (e.itemIndex === 0) {
      this.router.navigateByUrl('/admin/events');
    } else if (e.itemIndex === 1) {
      this.router.navigateByUrl('/admin/messenger');
    } else if (e.itemIndex === 2) {
      this.router.navigateByUrl('/admin/wartungen');
    }
  }
}
