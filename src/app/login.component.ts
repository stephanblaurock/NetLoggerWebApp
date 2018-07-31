import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {NetloggerService} from './service/netlogger.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
    username = '';
    password = '';
    autologin = false;

    constructor(private netloggerService: NetloggerService, private router: Router) {
      this.netloggerService.getIsAuthenticated().subscribe(
        authStatus => {
          if (authStatus) {
            this.router.navigate(['/customers']);
          }
        }
      );
    }

    ngOnInit() {
      this.netloggerService.tryAutoLogin();
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        this.netloggerService.signinUser(form.value.username, form.value.password, form.value.autologin);
    }
}
