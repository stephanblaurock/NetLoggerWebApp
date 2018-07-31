import { registerLocaleData } from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {
  DxBarGaugeModule, DxBoxModule, DxButtonModule, DxChartModule, DxCheckBoxModule, DxCircularGaugeModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownBoxModule,
  DxFormModule,
  DxListComponent,
  DxListModule, DxLookupModule, DxNumberBoxModule,
  DxPieChartModule, DxPopupModule, DxScrollViewModule, DxSelectBoxModule, DxSwitchModule, DxTabPanelModule,
  DxTabsModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxTileViewModule,
  DxToolbarModule
} from 'devextreme-angular';
import {HomeComponent} from './home.component';
import {LoginComponent} from './login.component';
import {RouterModule, Routes} from '@angular/router';
import {DashboardsComponent} from './dashboards.component';
import {SensorsComponent} from './sensors.component';
import {ActorsComponent} from './actors.component';
import {DashboardEnergyBalanceComponent} from './dashboards/dashboard-energy-balance.component';
import {TestComponent} from './dashboards/test.component';
import {MyDatePickerModule} from 'mydatepicker';
import {AlertModule, BsDatepickerModule, BsDropdownModule} from 'ngx-bootstrap';
import {
  MAT_DATE_LOCALE, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatMenuModule,
  MatNativeDateModule
} from '@angular/material';
import {NgbModule, NgbCollapseModule, NgbCarousel, NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ProtectedGuard} from './service/protected.guard';
import {NetloggerService} from './service/netlogger.service';
import {HttpClientModule} from '@angular/common/http';
import {FailureListComponent} from './failure-list.component';
import {CustomersComponent} from './customers.component';
import {EventlogWidgetComponent} from './widgets/eventlog-widget.component';
import {MasterComponent} from './master.component';
import {SensorComponent} from './sensor.component';
import {SensorGroupComponent} from './sensor-group.component';
import {DashboardEnergyBalanceConfigComponent} from './dashboards/dashboard-energy-balance-config.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DevicePickerComponent} from './widgets/device-picker.component';
import {SensorgroupEditComponent} from './admin/sensorgroup-edit.component';
import 'devextreme-intl';
import {locale, loadMessages} from 'devextreme/localization';
import * as messagesDe from 'devextreme/localization/messages/de.json';
import {ManageManualValuesComponent} from './wizards/manage-manual-values.component';
import {DashboardPvComponent} from './dashboards/dashboard-pv.component';
import {DashboardPvconfigComponent} from './dashboards/dashboard-pvconfig.component';
import {DashboardEnergySummaryComponent} from './dashboards/dashboard-energy-summary.component';
import {DashboardEnergySummaryConfigComponent} from './dashboards/dashboard-energy-summary-config.component';
import {DashboardEnergyCountersComponent} from './dashboards/dashboard-energy-counters.component';
import {DashboardEnergyCountersConfigComponent} from './dashboards/dashboard-energy-counters-config.component';
import { AdministrationComponent } from './admin/administration.component';
import { UserProfileComponent } from './user-profile.component';
import { MessengerComponent } from './admin/views/messenger.component';
import { EventlogPlainWidgetComponent } from './widgets/eventlog-plain-widget.component';
import { WartungenComponent } from './admin/views/wartungen.component';
import de from '@angular/common/locales/de';

registerLocaleData(de, 'de-DE');

loadMessages(messagesDe);
locale(navigator.language);

const APP_ROUTES: Routes = [
  {path: '', redirectTo: 'customers', pathMatch: 'full', canActivate: [ProtectedGuard]},
  {path: 'customers', component: CustomersComponent, canActivate: [ProtectedGuard]},
  {
    path: 'customers/:id', component: HomeComponent, canActivate: [ProtectedGuard], children: [
      {path: 'home/:id', component: DashboardEnergyBalanceComponent},
      {path: 'dashboards', component: DashboardsComponent},
      {path: 'dashboards/:id/energy-balance-edit', component: DashboardEnergyBalanceConfigComponent},
      {path: 'dashboards/:id/energy-balance', component: DashboardEnergyBalanceComponent},
      {path: 'dashboards/:id/energy-counters-edit', component: DashboardEnergyCountersConfigComponent},
      {path: 'dashboards/:id/energy-counters', component: DashboardEnergyCountersComponent},
      {path: 'sensors', component: SensorsComponent},
      {path: 'sensors/:id', component: SensorGroupComponent},
      {path: 'sensors/:id/edit', component: SensorgroupEditComponent},
      {path: 'actors', component: ActorsComponent}
    ]
  },
  {path: 'failurelist', component: EventlogPlainWidgetComponent, canActivate: [ProtectedGuard]},
  {path: 'admin', component: AdministrationComponent, canActivate: [ProtectedGuard], children: [
      {path: 'events', component: EventlogPlainWidgetComponent},
      {path: 'messenger', component: MessengerComponent},
      {path: 'wartungen', component: WartungenComponent}
    ]},
  {path: 'userprofile', component: UserProfileComponent, canActivate: [ProtectedGuard]},
  {path: 'test', component: TestComponent},
  {path: 'login', component: LoginComponent}
];

/* FARBDEFINITIONEN GLOBAL */
// export const colors_blue = ['#3473A9', '#4076A6', '#86B0D5', '#5C8FBC', '#29639C', '#1C4A77'];
// export const colors_orange = ['#FACF95', '#F8BC6E', '#F7AD51', '#ED9531', '#B66E21'];
// export const colors_green = [ '#347321', '#7DAE68', '#588C41', '#407129', '#275014', '#143105'];
// export const colors_red = ['#BE6F7B', '#98424F', '#7A2734', '#570F1A', '#350109'];

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    DashboardsComponent,
    SensorsComponent,
    ActorsComponent,
    DashboardEnergyBalanceComponent,
    DashboardEnergyBalanceConfigComponent,
    DashboardEnergyCountersComponent,
    DashboardEnergyCountersConfigComponent,
    TestComponent,
    FailureListComponent,
    CustomersComponent,
    EventlogWidgetComponent,
    MasterComponent,
    SensorComponent,
    SensorGroupComponent,
    SensorgroupEditComponent,
    DevicePickerComponent,
    ManageManualValuesComponent,
    DashboardPvComponent,
    DashboardPvconfigComponent,
    DashboardEnergySummaryComponent,
    DashboardEnergySummaryConfigComponent,
    DashboardEnergyCountersComponent,
    DashboardEnergyCountersConfigComponent,
    AdministrationComponent,
    UserProfileComponent,
    MessengerComponent,
    EventlogPlainWidgetComponent,
    WartungenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES, {enableTracing: false}),
    DxBarGaugeModule,
    DxButtonModule,
    DxBoxModule,
    DxChartModule,
    DxCheckBoxModule,
    DxCircularGaugeModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDropDownBoxModule,
    DxFormModule,
    DxListModule,
    DxLookupModule,
    DxNumberBoxModule,
    DxPieChartModule,
    DxPopupModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxSwitchModule,
    DxTabsModule,
    DxTabPanelModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxTileViewModule,
    DxToolbarModule,
    MyDatePickerModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule,
    NgbModule.forRoot(),
    NgbCollapseModule,
    NgbCarouselModule,
    AlertModule.forRoot()

  ],
  providers: [NetloggerService, ProtectedGuard, {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}, {
    provide: LOCALE_ID,
    useValue: 'de-DE'
  }],
  bootstrap: [MasterComponent]
})


export class AppModule {
}


