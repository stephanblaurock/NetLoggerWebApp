import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {DxFormComponent, DxFormModule, DxSelectBoxModule} from 'devextreme-angular';
import {NetloggerService} from '../service/netlogger.service';
import notify from 'devextreme/ui/notify';
import {NetLoggerServiceCommands} from '../service/netlogger.service.commands';
import {JsonHelper} from '../utils/json/jsonhelper';
import {
  Customer, IPC, DevExpressValidationInterface, SensorGroup, SensorValuePrecision,
  MeasuredValueType
} from '../models/interfaces';
import {ModelHelper} from '../models/model.helper';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-sensorgroup-edit',
  templateUrl: './sensorgroup-edit.component.html',
  styles: []
})
export class SensorgroupEditComponent implements OnInit {
  @ViewChild(DxFormComponent) myform: DxFormComponent;
  @Output() onCaptionChanged = new EventEmitter<string>();
  @Output() onDescriptionChanged = new EventEmitter<string>();
  private parentRoute: any;
  private currentRoute: any;
  isAdmin = false;
  customerIDFromURL = 0;
  deviceGroupIDFromURL = 0;
  mySensorGroup: SensorGroup = {
    sensor_group_id: 0,
    cust_id: 0,
    ipc_id: 0,
    caption: '',
    typ: '',
    description: '',
    inter_face: '',
    address: '',
    interval: '',
    last_readout: new Date(),
    location: '',
    health_status: 0,
    is_active: false,
    connection_time_out: '',
    auto_interpolate_time_span: '',
    sensors: []
  };

  formItems: any[];

  customers: Customer[] = [];
  ipc_list: IPC[] = [];
  interfaces = ['MOD', 'RTU', 'RPIC', 'MAXWEB', 'SOLARLOG', 'MAN', 'ECOSENSPLUS'];
  sensorValuePrecisions: SensorValuePrecision[];
  sensor_intervals = ['15s', '1m', '30m', '1h', '6h', '24h'];
  sensorDataTypes = ['INT', 'UINT', 'REAL', 'DOUBLE', 'WORD'];
  measuredValueTypes: MeasuredValueType[];
  valueUnitTypes: string[];
  toolItems: any[];

  popupReimportSolarLogDataVisible = false;
  reimportSolarLogDataFromDate = new Date();
  reimportSolarLogData_ReadEvents = false;
  reimportSolarLogData_ReadTagesdaten = false;
  reimportSolarLogData_ReadLeistungsdaten = false;

  constructor(private netloggerService: NetloggerService, private router: Router, private route: ActivatedRoute) {
    this.sensorValuePrecisions = netloggerService.getSensorValuePrecisions();
    this.measuredValueTypes = netloggerService.getMeasuredValueTypes();
    this.valueUnitTypes = netloggerService.getValueUnitTypes();
    this.formItems = [
      {
        dataField: 'cust_id',
        label: {text: 'Kunde'},
        editorType: 'dxSelectBox',
        editorOptions: {
          items: this.customers,
          value: 0,
          displayExpr: "caption",
          valueExpr: "cust_id",
          disabled: true
        }
      },
      {
        dataField: "ipc_id",
        label: {text: 'IPC'},
        editorType: 'dxSelectBox',
        editorOptions: {
          items: this.ipc_list,
          value: 0,
          displayExpr: "location",
          valueExpr: "ipc_id",
          disabled: !this.netloggerService.currentUserIsAdmin()
        }
      },
      {
        dataField: "caption",
        label: {text: "Bezeichnung"}
      },
      {
        dataField: "typ",
        label: {text: "Typ"}
      },
      {
        dataField: "inter_face",
        label: {text: 'Interface'},
        editorType: 'dxSelectBox',
        editorOptions: {items: this.interfaces, value: '', disabled: !this.netloggerService.currentUserIsAdmin()}
      },
      {
        dataField: 'connection_time_out',
        label: {text: 'Timeout'}
      },
      {
        dataField: 'auto_interpolate_time_span',
        label: {text: 'Interpolate (default = 5min)'}
      },
      /*{
        dataField: "interval",
        label: {text: 'Intervall'},
        editorType: 'dxSelectBox',
        editorOptions: {items: this.sensor_intervals, value: ''}
      }, {*/
      {
        dataField: 'is_active',
        label: {text: 'aktiviert'},
        editorType: 'dxCheckBox'
      },
      /*{
        dataField: "last_readout",
        label: {text: 'zuletzt ausgelesen'},
        editorType: 'dxDateBox',
        displayFormat: 'dd.MM.yyyy',
        value: new Date(),
        editorOptions: {
          disabled: true
        }
      },*/
      {
        // Leerraum einfügen
        itemType: "empty",
        name: "myEmptyItem"
      },
      {
        dataField: "address",
        label: {text: "Adresse"},
        colSpan: 2
      }, {
        dataField: "description",
        label: {text: "Beschreibung"},
        editorType: 'dxTextArea',
        editorOptions: {
          height: 60
        },
        colSpan: 2
      }
    ];

    this.toolItems = [{
      location: 'before',
      widget: 'dxButton',
      options: {
        type: 'success',
        text: 'speichern',
        icon: 'check',
        onClick: () => {
          this.onSave();
        }
      }
    }, {
      location: 'before',
      widget: 'dxButton',
      options: {
        type: 'danger',
        text: 'SensorGroup löschen',
        icon: 'remove',
        onClick: () => {
          this.onDeleteSensorGroup();
        },
        visible: this.netloggerService.currentUserIsAdmin()
      }
    }, {
      location: 'before',
      widget: 'dxButton',
      options: {
        type: 'danger',
        text: 'DeviceGroup löschen',
        icon: 'remove',
        onClick: () => {
          this.onDeleteDeviceGroup();
        },
        visible: this.netloggerService.currentUserIsAdmin()
      }
    }, {
      location: 'before',
      widget: 'dxDropDownMenu',
      options: {
        visible: this.netloggerService.currentUserIsAdmin(),
        text: 'weitere Aktionen ...',
        icon: 'save',
        items: [
          {text: 'als Vorlage bereitstellen (alle Sensoren)'},
          {text: 'als Vorlage bereitstellen (nur Favoriten-Sensoren)'},
          {text: 'Sensorgruppe in aktuellen Kunden verdoppeln (alle Sensoren)'},
          {text: 'Sensorgruppe in aktuellen Kunden verdoppeln (nur Favoriten-Sensoren)'}
        ],
        onItemClick: (e) => {
          notify("Item geklickt: " + e.itemIndex.toString());
          let source_cust_id = this.mySensorGroup.cust_id;
          let source_sens_group_id = this.mySensorGroup.sensor_group_id;
          let dest_cust_id = this.mySensorGroup.cust_id;

          if (this.netloggerService.current_customer != null)
            dest_cust_id = this.netloggerService.current_customer.cust_id;
          if (e.itemIndex === 0 || e.itemIndex === 1)
            dest_cust_id = 0;
          let only_prefered_sensors = false;
          if (e.itemIndex === 1 || e.itemIndex === 3)
            only_prefered_sensors = true;
          this.netloggerService.doCommand(NetLoggerServiceCommands.copySensorGroup(source_cust_id, source_sens_group_id, dest_cust_id, only_prefered_sensors))
            .subscribe(
              data => {
                if (data.ReturnCode === 200) {
                  console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnCode + ' - ' + data.ReturnValue);
                  notify('Sensor-Gruppe wurde erfolgreich kopiert!');
                } else {
                  console.log(data.ReturnMessage);
                  notify(data.ReturnMessage);
                }
              }
            );
        }
      }
    }
    ];
  }

  ngOnInit() {
    this.isAdmin = this.netloggerService.currentUserIsAdmin();
    this.parentRoute = this.route.parent.params.subscribe(params => {
      this.customerIDFromURL = +params['id'];
    });
    this.currentRoute = this.route.params.subscribe(params => {
      this.deviceGroupIDFromURL = +params['id'];
    });
    this.netloggerService.doCommand(NetLoggerServiceCommands.getCustomerList(false, 0)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          console.log("Ich bekam vom Server folgende Daten: " + data.ReturnValue);
          this.customers = JSON.parse(data.ReturnValue);
          this.myform.instance.itemOption("cust_id", {
            editorOptions: {
              items: this.customers,
              value: 0,
              displayExpr: "caption",
              valueExpr: "cust_id",
              disabled: true
            }
          });
          if (this.ipc_list && this.ipc_list.length > 0) {
            this.loadSensorGroup(this.customerIDFromURL, 0, this.deviceGroupIDFromURL);
          }
        }
      }
    );
    this.netloggerService.doCommand(NetLoggerServiceCommands.getIPCList(0)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          console.log('Ich bekam vom Server folgende Daten: ' + data.ReturnValue);
          this.ipc_list = JsonHelper.DeserializeJsonWithDate(data.ReturnValue);
          this.myform.instance.itemOption('ipc_id', {
            editorOptions: {
              items: this.ipc_list,
              value: 0,
              displayExpr: 'location',
              valueExpr: 'ipc_id',
              disabled: !this.isAdmin
            }
          });
          if (this.customers && this.customers.length > 0) {
            this.loadSensorGroup(this.customerIDFromURL, 0, this.deviceGroupIDFromURL);
          }
        }
      }
    );

    // Einen Wert aus einem Formularfeld lesen:
    // var email = formInstance.getEditor('Email').option('value');
  }

  onFieldDataChanged(e) {
    if (e.dataField === 'caption')
      this.onCaptionChanged.emit(e.value);
    else if (e.dataField === 'description')
      this.onDescriptionChanged.emit(e.value);
  }

  loadSensorGroup(cust_id: number, sensor_group_id: number, device_group_id: number) {
    this.netloggerService.doCommand(NetLoggerServiceCommands.getSensorGroup(cust_id, sensor_group_id, device_group_id)).subscribe(
      data => {
        if (data.ReturnCode === 200) {
          // console.log("Ich bekam vom Server folgende Daten: " + data.ReturnValue);
          console.log(data);
          ModelHelper.CopySensorGroup(JsonHelper.DeserializeJsonWithDate(data.ReturnValue), this.mySensorGroup);
          this.lastSensorID = (this.mySensorGroup.sensors.length + 3) * -(1);
        }
      }
    );
  }

  private
  lastSensorID: number = -10;

  createNewSensor() {
    this.lastSensorID -= 1;
    this.mySensorGroup.sensors.push(ModelHelper.CreateSensor(this.lastSensorID));
  }

  autoConfigSolarLog() {
    if (this.mySensorGroup.inter_face === 'SOLARLOG') {
      this.netloggerService.doCommand(NetLoggerServiceCommands.autoSensorConfig(this.customerIDFromURL, this.mySensorGroup.sensor_group_id)).subscribe(
        data => {
          if (data.ReturnCode === 200) {
            // console.log("Ich bekam vom Server folgende Daten: " + data.ReturnValue);
            console.log(data);
            this.loadSensorGroup(this.customerIDFromURL, this.mySensorGroup.sensor_group_id, this.deviceGroupIDFromURL);
          } else {
            notify(data.ReturnValue);
          }
        }
      );
    }
  }

  reImportSolarlogData() {
    if (this.mySensorGroup.inter_face === 'SOLARLOG') {
      const dayFrom = moment(this.reimportSolarLogDataFromDate).utc(true).toDate();
      this.netloggerService.doCommand(NetLoggerServiceCommands.reImportSolarlogData(this.customerIDFromURL, this.mySensorGroup.sensor_group_id, dayFrom,
        this.reimportSolarLogData_ReadEvents, this.reimportSolarLogData_ReadTagesdaten, this.reimportSolarLogData_ReadLeistungsdaten)).subscribe(
        data => {
          if (data.ReturnCode === 200) {
            // console.log("Ich bekam vom Server folgende Daten: " + data.ReturnValue);
            console.log(data);
            this.popupReimportSolarLogDataVisible = false;
            this.loadSensorGroup(this.customerIDFromURL, this.mySensorGroup.sensor_group_id, this.deviceGroupIDFromURL);

          } else {
            notify(data.ReturnValue);
          }
        }
      );
    }
  }

  onSave() {
    var v = this.myform.instance.validate() as DevExpressValidationInterface;
    console.log(v);
    if (v.isValid) {
      console.log("lokale Sensorgruppe");
      console.log(this.mySensorGroup);
      this.netloggerService.doCommand(NetLoggerServiceCommands.updateSensorGroup(this.mySensorGroup))
        .subscribe(
          data => {
            if (data.ReturnCode == 200) {
              console.log("Ich bekam vom Server folgende Daten: " + data.ReturnCode + " - " + data.ReturnValue);
              notify("Sensor-Gruppe wurde erfolgreich gespeichert!");
              this.goBack();
            } else {
              console.log(data.ReturnMessage);
              notify(data.ReturnMessage);
            }
          }
        );
    }
  }

  onDeleteSensorGroup() {
    this.netloggerService.doCommand(NetLoggerServiceCommands.deleteSensorGroup(this.mySensorGroup.cust_id, this.mySensorGroup.sensor_group_id))
      .subscribe(
        data => {
          if (data.ReturnCode == 200) {
            console.log("Ich bekam vom Server folgende Daten: " + data.ReturnCode + " - " + data.ReturnValue);
            notify("Sensor-Gruppe wurde erfolgreich gelöscht!");
            this.goBack();
          } else {
            console.log(data.ReturnMessage);
            notify(data.ReturnMessage);
          }
        }
      );
  }

  onDeleteDeviceGroup() {
    notify('noch nicht implementiert!');

  }

  goBack() {
    this.router.navigateByUrl('/customers/' + this.customerIDFromURL + '/sensors/' + this.deviceGroupIDFromURL);
  }
}
