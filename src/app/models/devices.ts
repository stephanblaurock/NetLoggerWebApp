// Diese Klasse wird z.B. vom Dashboard "EnergyBalance" genutzt
export class DeviceInfo {
    id: number;
    caption_group?: string;
    caption: string;
    unit: string;
    energy_type: number;
    selected?: boolean;
    sum_id?: number;      // wird benötigt, um verschiedene Meßspuren zusammenzufassen (siehe EnergyBalance)
                          // ist sie > 0, so werden die Devices zusammengefasst
}

// Diese wird für die Anzeige der Sensor-Seite genutzt (Sensoren + Devices in transparenter Form)
export class SummarizedSensorDeviceInfo {
    device_group_id: number;
    caption: string;
    health_status: number;
    image_file: string;
    current_value: number;
    device_group_type: number;
    is_active: boolean;
    is_connected: boolean;
    last_connected: Date;
    unit: string;
    address: string;
    devices?: DeviceInfo[];
}


// Jetzt noch 2 Models für die DeviceGroup-Seite
export class DeviceGroupLight {
  cust_id: number;
  image_file: string;
  device_group_id: number;
  sensor_group_id: number;
  caption: string;
  address: string;
  is_active: boolean;
  devices?: DeviceLight[];
}

export class DeviceLight {
  device_id: number;
  is_active: boolean;
  value_type: number;
  min_value: number;
  max_value: number;
  caption: string;
  unit: string;
  sensor_id: number;
  sensor_current_value: number;
  sensor_current_value_time_stamp: Date;
}
