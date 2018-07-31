import {forEach} from '@angular/router/src/utils/collection';
export class Customer {
    cust_id: number;
    caption: string;
    address: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string;
    notes: string;
    health_status: number;
}

export interface DevExpressValidationInterface {
    isValid: boolean;
}

export class FailureListItem {
    cust_id: number;
    key: string;
    items: FailureListDeviceItem[];
}

export class FailureListDeviceItem {
    cust_id: number;
    event_source_type: number;
    source_id: number;
    source_caption: string;
    health_status: number;
}

export class DeviceWidgetData {
    device_id: number;
    health_status: number;
    label_value1: string;
    value1: number;
    label_value2: string;
    value2: number;
    label_value3: string;
    value3: number;
}

export interface IPC {
    ipc_id: number;
    customer_id: number;
    app_type_name: string;
    app_package_file: string;
    app_settings: string;
    is_active: boolean;
    mac_address: string;
    ip_address: string;
    location: string;
    install_date: Date;
}

export interface NavItem {
    navitem_id: number;
    caption: string;
}

export class Plant {
    plant_id: number;
    parent_plant_id: number;
    caption: string;
    description?: string;
    graph_config?: GraphWidgetConfig;
}

export interface SensorGroup {
    sensor_group_id: number;
    cust_id: number;
    ipc_id: number;
    caption: string;
    typ: string;
    description: string;
    inter_face: string;
    address: string;
    interval: string;
    last_readout: Date;
    location: string;
    health_status: number;
    is_active: boolean;
    connection_time_out: string;
    auto_interpolate_time_span: string;
    sensors: Sensor[];
}

export interface Sensor {
    sensor_id: number;
    caption: string;
    field: string;
    data_type: string;
    factor: number;
    calibration: number;
    unit: string;
    is_favorite: boolean;
    min_sensor_value_precision: number;
    value_type: number;
    health_status: number;
    current_value: number;
    current_value_timestamp: Date;
    is_active: boolean;
    usr_sort: number;
    decimal_places: number;
  add_to_current_group_value: boolean;
}

export class DeviceGroup {
    device_group_id: number;
    sensor_group_id: number;
    plant_id: number
    caption: string;
    is_active?: boolean;
    address?: string;
    health_status: number;
    image_file: string;
    devices?: Device[];
}
export class Device {
    device_id: number;
    device_group_id: number;
    sensor_id: number;
    caption: string;
    unit: string;
    health_status: number;
    is_active: boolean;
    cost_center: string;
    auto_extrapolate: boolean;
    usr_sort: number;
    decimal_places: number;
    device_widget_data?: DeviceWidgetData;
    sensor_current_value?: number;
    sensor_current_value_time_stamp?: Date;
    min_value: number;
    max_value: number;
    value_type: number;
}

export class DayValues {
    oid: number;
    device_id: number;
    day: Date;
    precision: number;
    start_value: number;
    end_value: number;
    min_value: number;
    max_value: number;
    sum_value: number;
    avg_value: number;
    values: any[];
}

export class SensorDeviceMappingGroup {
    mappings: SensorDeviceMappingItem[] = [];

    public initWithSensorAndDevices(sensors: Sensor[], devices: Device[]) {
        this.mappings = [];
        // zuerst alle Sensoren adden, dann können die Devices gemappt werden
        if (sensors) {
            for (let sensor of sensors) {
                this.mappings.push(new SensorDeviceMappingItem(sensor, null));
            }
        }
        if (devices) {
            for (let device of devices) {
                let mapItem = this.getMappingItemBySensorID(device.sensor_id)
                if (mapItem != null)
                    mapItem.device = device;
                else {
                    let mapItem = new SensorDeviceMappingItem(null, device);
                    this.mappings.push(mapItem);
                }
            }
        }
    }

    ///
    public mapSensorsByID(sensors: Sensor[], clearAllMappedSensors: boolean) {
        if (clearAllMappedSensors) {
            for (let mi of this.mappings) {
                mi.sensor = null;
            }
        }
        if (sensors) {
            for (let sensor of sensors) {
                let mapItem = this.getMappingItemByDeviceSensorID(sensor.sensor_id);
                if (mapItem != null)
                    mapItem.sensor = sensor;        // es gibt schon ein Device, das auf diese SensorID gemappt ist.
                else
                    this.mappings.push(new SensorDeviceMappingItem(sensor, null));
            }
        }
        // Jetzt alle Mappings noch nach Sensor-Caption sortieren.
        this.sortMappingsBySensorCaption();
    }


    private getMappingItemByDeviceID(deviceID: number) {
        for (let sdm of this.mappings) {
            if (sdm.device && sdm.device.device_id == deviceID)
                return sdm;
        }
        return null;
    }

    private getMappingItemBySensorID(sensorID: number) {
        for (let sdm of this.mappings) {
            if (sdm.sensor && sdm.sensor.sensor_id == sensorID)
                return sdm;
        }
        return null;
    }

    private getMappingItemByDeviceSensorID(sensorID: number) {
        for (let sdm of this.mappings) {
            if (sdm.device && sdm.device.sensor_id == sensorID)
                return sdm;
        }
        return null;
    }

    // löscht ein mapping raus. Das wird gemacht, wenn z.B. eine Meßspur gelöscht wird
    // und kein Sensor verknüpft ist (also wenn es quasi eine leere Zeile wird)
    // Wichtig ist ebenfalls, dass DAVOR(!) dieses Device über den Service gelöscht werden sollte!
    public removeDevice(device_id: number) {
        let indexFromItemToDelete = -1;
        let currentIndex = 0;
        for (let sdm of this.mappings) {
            if (sdm.device && sdm.device.device_id == device_id) {
                if (sdm.sensor == null)
                    indexFromItemToDelete = currentIndex;
                else
                    sdm.device = null;
            }
            currentIndex++;
        }
        if (indexFromItemToDelete >= 0)
            this.mappings.splice(indexFromItemToDelete, 1);
    }

    public removeAllSensors() {
        for (let sdm of this.mappings) {
            sdm.sensor = null;
        }
    }

    public sortMappingsBySensorCaption(): void {
        this.mappings.sort((leftSide, rightSide): number => {
            if (leftSide.sensor) {
                if (leftSide.sensor.caption < rightSide.sensor.caption) return -1;
                if (leftSide.sensor.caption > rightSide.sensor.caption) return 1;
            }
            return 0;
        });
    }
}

export class SensorDeviceMappingItem {
    constructor(sensor: Sensor, device: Device) {
        this.sensor = sensor;
        this.device = device;
    }

    sensor: Sensor;
    device: Device;

    /*
     public createDeviceFromSensor() {
     if (this.device == null) {
     this.device = new Device();
     this.device.sensor_id = this.sensor.sensor_id;
     this.device.caption = this.sensor.caption;
     this.device.unit
     }
     }*/
}

export interface MeasuredValueType {
    id: number;
    caption: string;
}

export interface SensorValuePrecision {
    id: number;
    caption: string;
}

export interface UserCustomerAccess {
    has_access: boolean;
    cust_id: number;
    cust_caption: string;
    is_admin: boolean;
    allow_sensor_config: boolean;
}
export class UserCustomerAccessObject {
  id: 0;
  user_id: 0;
  customer_id: 0;
  is_admin: false;
  allow_sensor_config: false;
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    telefon: string;
    mobil: string;
    password: string;
    is_admin: boolean;
    inactive: boolean;
}

export class ChartSeriesType {
    caption: string;
    value: string;
}
export class PredefinedTimeRange {
    caption: string;
    value: string;
}

export class PredefinedColor {
    caption: string;
    value: string;
}

export class DisplayItemNumberValue {
    caption: string;
    value: number;
}
export class DisplayItemStringValue {
    caption: string;
    value: string;
}

// ******************* DASHBOARDS ******************************
export class Dashboard {
    id: number;
    dashboard_type: number;
    caption: string;
    usr_sort: number;
    health_status: number;
    widgets?: DashboardWidget[];
}
export class DashboardWidget {
    id: number;
    dashboard_id: number;
    caption: string;
    config_data: string;
    widget_type: string;
    width_ratio: number;
    height: number;
    usr_sort: number;
}
export class GraphWidgetConfig {
    cust_id: number;
    predefined_time_range: string;
    // predefined_time_range_offset: number;
    // predefined_time_range_offset_label: string;     // wird dann vom Server ausgefüllt
    date_begin?: Date;
    date_end?: Date;
    precision: string;
    stacked_1_series_type: string;
    stacked_2_series_type: string;
    categories?: string[];
    series: GraphWidgetSeries[] = [];
}

export class GraphSumValues {
    unit: string;
    avg: number;
    sum: number;
    max: number;
    min: number;
    start: number;
    end: number;
}

export class GraphWidgetSeries {
    devices: DisplayItemNumberValue[] = [];
    color: string = '#000000';
    caption: string = 'neue Serie';
    unit: string = '';
    series_type: string = 'areaspline';
    convert_to_percent?: boolean = false;
    only_sum_values: boolean = false;
    sum_values?: GraphSumValues;        // Platzhalter: wird vom Service ausgefüllt
    values?: any[];                     // Platzhalter: wird vom Service ausgefüllt
    public removeDevice(device_id: number) {
        let index = -1;
        let currentIndex = 0;
        for (let device of this.devices) {
            if (device.value == device_id) {
                index = currentIndex;
                //break;
            }
            currentIndex++;
        }
        if (index >= 0)
            this.devices.splice(index, 1);
    }
}

export class YearCostCenterGraphItem {
    device_id: number;
    value_type: number;
    caption: string;
    values: number[];
    sum_value_type: string;
    sum_value: number;
    sum_value_unit: string;
    chartoptions?: any;
}

export class ManualValue {
  id: number;
  device_id: number;
  timestamp: Date;
  value: number;
  interpolate: boolean;
}
