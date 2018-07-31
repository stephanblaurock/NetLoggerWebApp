
import {User, Customer, IPC, SensorGroup, Sensor, DeviceGroup} from './interfaces';
export class ModelHelper {
  static CopyUserData(fromUsr: User, toUsr: User) {
    toUsr.user_id = fromUsr.user_id;
    toUsr.name = fromUsr.name;
    toUsr.email = fromUsr.email;
    toUsr.telefon = fromUsr.telefon;
    toUsr.mobil = fromUsr.mobil;
    toUsr.password = fromUsr.password;
    toUsr.is_admin = fromUsr.is_admin;
    toUsr.inactive = fromUsr.inactive;
  }

  static CopyCustomerData(fromCust: Customer, toCust: Customer) {
    toCust.cust_id = fromCust.cust_id;
    toCust.caption = fromCust.caption;
    toCust.address = fromCust.address;
    toCust.contact_person_name = fromCust.contact_person_name;
    toCust.contact_person_email = fromCust.contact_person_email;
    toCust.contact_person_phone = fromCust.contact_person_phone;
    toCust.notes = fromCust.notes;
    toCust.health_status = fromCust.health_status;
  }

  static CopyIPCData(fromIPC: IPC, toIPC: IPC) {
    toIPC.ipc_id = fromIPC.ipc_id;
    toIPC.customer_id = fromIPC.customer_id;
    toIPC.app_type_name = fromIPC.app_type_name;
    toIPC.app_package_file = fromIPC.app_package_file;
    toIPC.app_settings = fromIPC.app_settings;
    toIPC.is_active = fromIPC.is_active;
    toIPC.mac_address = fromIPC.mac_address;
    toIPC.ip_address = fromIPC.ip_address;
    toIPC.location = fromIPC.location;
    toIPC.install_date = fromIPC.install_date;
  }

  static CopySensorGroup(fromSG: SensorGroup, toSG: SensorGroup) {
    if (fromSG == null || toSG == null)
      return;
    toSG.sensor_group_id = fromSG.sensor_group_id;
    toSG.cust_id = fromSG.cust_id;
    toSG.ipc_id = fromSG.ipc_id;
    toSG.caption = fromSG.caption;
    toSG.typ = fromSG.typ;
    toSG.description = fromSG.description;
    toSG.inter_face = fromSG.inter_face;
    toSG.address = fromSG.address;
    toSG.interval  = fromSG.interval;
    toSG.last_readout = fromSG.last_readout;
    toSG.health_status = fromSG.health_status;
    toSG.location = fromSG.location;
    toSG.is_active = fromSG.is_active;
    toSG.connection_time_out = fromSG.connection_time_out;
    toSG.auto_interpolate_time_span = fromSG.auto_interpolate_time_span;
    toSG.sensors = [];
    for (let sensor of fromSG.sensors) {
      let sens = {
        sensor_id: sensor.sensor_id,
        caption: sensor.caption,
        field: sensor.field,
        data_type: sensor.data_type,
        factor: sensor.factor,
        calibration: sensor.calibration,
        unit: sensor.unit,
        is_favorite: sensor.is_favorite,
        min_sensor_value_precision: sensor.min_sensor_value_precision,
        value_type: sensor.value_type,
        health_status: sensor.health_status,
        current_value: sensor.current_value,
        current_value_timestamp: sensor.current_value_timestamp,
        is_active: sensor.is_active,
        usr_sort: sensor.usr_sort,
        decimal_places: sensor.decimal_places,
        add_to_current_group_value: sensor.add_to_current_group_value
      }
      toSG.sensors.push(sens);
    }
  }

  static CopySensor(fromSensor: Sensor, toSensor: Sensor) {
    toSensor.sensor_id = fromSensor.sensor_id;
    toSensor.caption = fromSensor.caption;
    toSensor.field = fromSensor.field;
    toSensor.data_type = fromSensor.data_type;
    toSensor.factor = fromSensor.factor;
    toSensor.calibration = fromSensor.calibration;
    toSensor.unit = fromSensor.unit;
    toSensor.is_favorite = fromSensor.is_favorite;
    toSensor.min_sensor_value_precision = fromSensor.min_sensor_value_precision;
    toSensor.value_type = fromSensor.value_type;
    toSensor.is_active = fromSensor.is_active;
  }

  static CreateSensor(sensorID: number): Sensor {
    return {
      sensor_id: sensorID,
      caption: "neuer Sensor",
      field: "",
      data_type: "",
      factor: 1,
      calibration: 1,
      unit: "",
      is_favorite: false,
      min_sensor_value_precision: 1,
      health_status: 0,
      value_type: 0,
      current_value: 0,
      current_value_timestamp: new Date(),
      usr_sort: 0,
      decimal_places: 4,
      is_active: true,
      add_to_current_group_value: false
    };
  }

  static CreateDefaultDeviceGroup(): DeviceGroup {
    return {
      device_group_id: -1,
      sensor_group_id: -1,
      plant_id: -1,
      caption: 'leere Meßspurgruppe',
      health_status: 0,
      image_file: ''
    };
  }
  static CreateDefaultSensorGroup(): SensorGroup {
    return {
      sensor_group_id: -1,
      cust_id: -1,
      ipc_id: -1,
      caption: 'leeres Meßgerät',
      typ: '',
      description: '',
      inter_face: '',
      address: '',
      interval: '',
      last_readout: undefined,
      location: '',
      health_status: 0,
      is_active: false,
      connection_time_out: '',
      auto_interpolate_time_span: '',
      sensors: []
    };
  }


}
