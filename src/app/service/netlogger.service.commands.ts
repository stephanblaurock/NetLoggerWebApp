import {JsonCommand} from '../utils/json/json-command';
import {
  Plant,
  User,
  UserCustomerAccess,
  Customer,
  IPC,
  SensorGroup,
  GraphWidgetConfig,
  Device,
  DeviceGroup,
  Dashboard,
  DashboardWidget,
  ManualValue
} from '../models/interfaces';
import * as moment from 'moment';
import {CounterCorrection} from '../models/counter-correction';
import {UserProfile} from '../models/user-models';
import {EventLogFilter} from '../models/eventlog-models';
import {DeviceGroupLight} from '../models/devices';

export class NetLoggerServiceCommands {
  public static getUsers(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.Users.Service.UserService';
    cmd.CommandName = 'GetUsers';
    return cmd;
  }

  public static setDebugging(is_active: boolean): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SetDebugging';
    cmd.addParameter('is_active', is_active);
    return cmd;
  }

  public static doMaintenance(is_active: boolean): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DoMaintenance';
    return cmd;
  }

  public static getUser(user_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.Users.Service.UserService';
    cmd.CommandName = 'GetUser';
    cmd.addParameter('user_id', user_id);
    return cmd;
  }

  public static setUser(usr: User): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.Users.Service.UserService';
    cmd.CommandName = 'SetUser';
    cmd.addParameter('user_data', usr);
    return cmd;
  }

  public static createUser(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.Users.Service.UserService';
    cmd.CommandName = 'CreateUser';
    return cmd;
  }

  public static deleteUser(user_id: number): any {

  }

  public static validateLastConnected(custID: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'ValidateLastConnected';
    cmd.addParameter('cust_id', custID);
    return cmd;
  }

  public static getUserHealthStatus(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetUserHealthStatus';
    return cmd;
  }

  public static refreshHealthStatus(custID: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'RefreshHealthStatus';
    cmd.addParameter('cust_id', custID);
    return cmd;
  }

  public static recalculateHealthStatus(custID: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'RecalculateHealthStatus';
    cmd.addParameter('cust_id', custID);
    return cmd;
  }


  public static getCustomerList(withMaster: boolean, sortOrder: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetCustomerList';
    cmd.addParameter('with_master', withMaster);
    cmd.addParameter('sort_order', sortOrder);
    return cmd;
  }

  public static getUserCustomerAccessList(user_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetUserCustomerAccessList';
    cmd.addParameter('user_id', user_id);
    return cmd;
  }

  public static getUserCustomerAccessObject(cust_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetUserCustomerAccessObject';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static setUserCustomerAccessList(user_id: number, accessList: Array<UserCustomerAccess>): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SetUserCustomerAccessList';
    cmd.addParameter('user_id', user_id);
    cmd.addParameter('user_customer_access_list', accessList);
    return cmd;
  }

  public static createCustomer(): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CreateCustomer';
    return cmd;
  }

  public static getCustomer(cust_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetCustomer';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static updateCustomer(cust: Customer): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateCustomer';
    cmd.addParameter('customer', cust);
    return cmd;
  }

  public static deleteCustomer(cust_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteCustomer';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static getIPCList(cust_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetIPCList';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static getIPC(ipc_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetIPC';
    cmd.addParameter('ipc_id', ipc_id);
    return cmd;
  }

  public static updateIPC(ipc: IPC): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateIPC';
    cmd.addParameter('ipc', ipc);
    return cmd;
  }

  public static deleteIPC(ipc_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteIPC';
    cmd.addParameter('ipc_id', ipc_id);
    return cmd;
  }

  public static getAppTypeNames(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetAppTypeNames';
    return cmd;
  }

  public static getAppPackages(app_type_name: string): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetAppPackages';
    cmd.addParameter('app_type_name', app_type_name);
    return cmd;
  }

  public static getManualSensorGroups(cust_id: number) {
    return NetLoggerServiceCommands.getSensorGroupList(cust_id, false, false, false, false, 'MAN');
  }

  public static getSensorGroupList(cust_id: number, include_templates: boolean, only_templates: boolean, only_unmapped_ipc: boolean, only_unmapped_device, inter_face: string): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetSensorGroupList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('include_templates', include_templates);
    cmd.addParameter('only_templates', only_templates);
    cmd.addParameter('only_unmapped', only_unmapped_ipc);
    cmd.addParameter('only_unmapped_device', only_unmapped_device);
    cmd.addParameter('inter_face', inter_face);
    return cmd;
  }
  public static disconnectSensorGroup(cust_id: number, sensor_group_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DisconnectSensorGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('sensor_group_id', sensor_group_id);
    return cmd;
  }

  public static updateSensorGroupsCurrentValue(cust_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateSensorGroupsCurrentValue';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static connectSensorGroup(cust_id: number, sensor_group_id: number, device_group_id): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'ConnectSensorGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('sensor_group_id', sensor_group_id);
    cmd.addParameter('device_group_id', device_group_id);
    return cmd;
  }

  public static createSensorGroup(cust_id: number, caption: string): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CreateSensorGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('caption', caption);
    return cmd;
  }

  public static getSensorGroup(cust_id: number, sensor_group_id: number, device_group_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetSensorGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('sensor_group_id', sensor_group_id);
    cmd.addParameter('device_group_id', device_group_id);
    return cmd;
  }

  public static updateSensorGroup(sensor_group: SensorGroup): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateSensorGroup';
    cmd.addParameter('sensor_group', sensor_group);
    return cmd;
  }

  public static setLastReadOut(cust_id: number, sensorGroupID: number, timeStamp: Date): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SetLastReadOut';
    cmd.addParameter('CustomerID', cust_id);
    cmd.addParameter('Data', sensorGroupID + ';' + moment(timeStamp).format('YYYY-MM-DD HH:mm'));
    return cmd;
  }

  public static deleteSensorGroup(cust_id: number, sensor_group_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteSensorGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('sensor_group_id', sensor_group_id);
    return cmd;
  }

  public static copySensorGroup(source_cust_id: number, source_sensor_group_id: number, dest_cust_id: number, only_prefered_sensors: boolean): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CopySensorGroup';
    cmd.addParameter('source_cust_id', source_cust_id);
    cmd.addParameter('source_sensor_group_id', source_sensor_group_id);
    cmd.addParameter('dest_cust_id', dest_cust_id);
    cmd.addParameter('only_prefered_sensors', only_prefered_sensors);
    return cmd;
  }

  public static uploadSensorData(cust_id: number, data: string): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UploadSensorData';
    cmd.addParameter('CustID', cust_id);
    cmd.addParameter('Data', data);
    return cmd;
  }

  public static uploadSimpleSensorData(custID: number, sensorID: number, deviceID: number, timeStamp: Date, value: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UploadSimpleSensorData';
    cmd.addParameter('CustID', custID);
    cmd.addParameter('SensorID', sensorID);
    cmd.addParameter('DeviceID', deviceID);
    cmd.addParameter('TimeStamp', timeStamp);
    cmd.addParameter('Value', value);
    return cmd;
  }

  public static copyMeasuredValues(cust_id: number, sourceDeviceID: number, destDeviceID: number, from: Date, to: Date, overwrite: boolean): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CopyMeasuredValues';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('source_device_id', sourceDeviceID);
    cmd.addParameter('dest_device_id', destDeviceID);
    cmd.addParameter('from_time_stamp', from);
    cmd.addParameter('to_time_stamp', to);
    cmd.addParameter('overwrite', overwrite);
    return cmd;
  }

  public static getEventLogs(filter: EventLogFilter): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetEventLogs';
    cmd.addParameter('cust_id', filter.cust_id);
    cmd.addParameter('min_event_type', filter.min_event_type);
    cmd.addParameter('event_source_type_filter', filter.event_source_type_filter);
    cmd.addParameter('source_id_filter', filter.source_id_filter);
    cmd.addParameter('max_rows', filter.max_rows);
    return cmd;
  }

  public static getEventLog(custID: number, eventID: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetEventLog';
    cmd.addParameter('cust_id', custID);
    cmd.addParameter('event_id', eventID);
    return cmd;
  }

  public static deleteEventLogs(cust_id: number, event_type_filter: number, event_code_filter: number, event_source_type_filter: number, source_id_filter: number, eventlog_ids: number[]): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteEventLogs';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('event_type_filter', event_type_filter);
    cmd.addParameter('event_code_filter', event_code_filter);
    cmd.addParameter('event_source_type_filter', event_source_type_filter);
    cmd.addParameter('source_id_filter', source_id_filter);
    cmd.addParameter('eventlog_ids', eventlog_ids);
    return cmd;
  }

  public static getPlantList(cust_id: number, parent_plant_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetPlantList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('parent_plant_id', parent_plant_id);
    return cmd;
  }

  public static getPlant(cust_id: number, plant_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetPlant';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('plant_id', plant_id);
    return cmd;
  }

  public static createPlant(cust_id: number, parent_plant_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CreatePlant';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('parent_plant_id', parent_plant_id);
    return cmd;
  }

  public static updatePlant(cust_id: number, plant: Plant): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdatePlant';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('plant', plant);
    return cmd;
  }

  public static setDeviceGroupPlantRelation(cust_id: number, device_group_id: number, plant_id: number) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SetDeviceGroupPlantRelation';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_group_id', device_group_id);
    cmd.addParameter('plant_id', plant_id);
    return cmd;
  }

  public static deletePlant(cust_id: number, plant_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeletePlant';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('plant_id', plant_id);
    return cmd;
  }

  public static createDeviceFromSensor(cust_id: number, from_sensor_id: number, to_device_group_id: number) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CreateDeviceFromSensor';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('from_sensor_id', from_sensor_id);
    cmd.addParameter('to_device_group_id', to_device_group_id);
    return cmd;
  }

  public static deleteDevice(cust_id: number, device_id: number) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteDevice';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    return cmd;
  }

  public static getDevice(cust_id: number, device_id: number) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDevice';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    return cmd;
  }

  public static updateDevice(cust_id: number, device: Device) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateDevice';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device', device);
    return cmd;
  }

  public static getDeviceGroupList(cust_id: number, plant_id: number, include_devices: boolean): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDeviceGroupList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('plant_id', plant_id);
    cmd.addParameter('include_devices', include_devices);
    return cmd;
  }

  public static getSummarizedDeviceAndSensorList(cust_id: number, include_devices: boolean): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetSummarizedDeviceAndSensorList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('include_devices', include_devices);
    return cmd;
  }

  public static deleteDeviceGroup(cust_id: number, device_group_id: number) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteDeviceGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_group_id', device_group_id);
    return cmd;
  }

  public static createDeviceGroup(cust_id: number, caption: string) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CreateDeviceGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('caption', caption);
    return cmd;
  }

  public static getDeviceGroup(cust_id: number, device_group_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDeviceGroup';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_group_id', device_group_id);
    return cmd;
  }

  public static updateDeviceGroup(deviceGroup: DeviceGroup): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateDeviceGroup';
    cmd.addParameter('device_group', deviceGroup);
    return cmd;
  }
  public static getDeviceGroupLight(cust_id: number, device_group_id: number): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDeviceGroupLight';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_group_id', device_group_id);
    return cmd;
  }

  public static updateDeviceGroupLight(deviceGroup: DeviceGroupLight): any {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateDeviceGroupLight';
    cmd.addParameter('device_group', deviceGroup);
    return cmd;
  }

  public static copyDeviceGroup(custID: number, sourceDeviceGroupID: number, destDeviceGroupID: number, destDeviceGroupCaption: string, deviceIDList: number[], fromDay: Date, toDay: Date): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CopyDeviceGroup';
    cmd.addParameter('cust_id', custID);
    cmd.addParameter('source_device_group_id', sourceDeviceGroupID);
    cmd.addParameter('dest_device_group_id', destDeviceGroupID);
    cmd.addParameter('dest_device_group_caption', destDeviceGroupCaption);
    cmd.addParameter('device_id_list', deviceIDList);
    cmd.addParameter('from_day', fromDay);
    cmd.addParameter('to_day', toDay);
    return cmd;
  }

  public static getDeviceListByGroupID(cust_id: number, device_group_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDeviceList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_group_id', device_group_id);
    return cmd;
  }

  public static getDeviceListByDeviceIDs(cust_id: number, device_ids: number[]): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDeviceList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_ids', device_ids);
    return cmd;
  }

  public static getDayValues(cust_id: number, device_id: number, day: Date): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDayValues';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    cmd.addParameter('day', day);
    return cmd;
  }
  public static calculateDayValues(cust_id: number, device_id: number, from_day: Date, to_day: Date): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CalculateDayValues';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    cmd.addParameter('from_day', from_day);
    cmd.addParameter('to_day', to_day);
    return cmd;
  }
  public static deleteDayValues(cust_id: number, device_id: number, from_day: Date, to_day: Date): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteDayValues';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    cmd.addParameter('from_day', from_day);
    cmd.addParameter('to_day', to_day);
    return cmd;
  }

  public static getFailureList(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetFailureList';
    return cmd;
  }

  public static sendPVReport(cust_ids: number[], do_shrink: boolean) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SendPVReport';
    cmd.addParameter('cust_ids', cust_ids);
    cmd.addParameter('do_shrink', do_shrink);
    return cmd;
  }

  public static setACK(cust_id: number, eventlog_ids: number[]) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SetACK';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('eventlog_ids', eventlog_ids);
    return cmd;
  }

  public static getCostCenterList(cust_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetCostCenterList';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static getYearCostCenterGraphs(cust_id: number, year: number, costcenter: string): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetYearCostCenterGraphs';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('year', year);
    cmd.addParameter('cost_center', costcenter);
    return cmd;
  }

  public static getDeviceWidgetDataList(cust_id: number, device_ids: number[]): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDeviceWidgetDataList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_ids', device_ids);
    return cmd;
  }

  // ********** DASHBOARDS ************* //
  public static getDashboardList(cust_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDashboardList';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static getDashboard(cust_id: number, dashboard_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDashboard';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('dashboard_id', dashboard_id);
    return cmd;
  }

  public static createDashboard(cust_id: number, dashboard_type: number, caption: string): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CreateDashboard';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('caption', caption);
    cmd.addParameter('dashboard_type', dashboard_type);
    return cmd;
  }

  public static updateDashboard(cust_id: number, dashboard: Dashboard): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateDashboard';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('dashboard', dashboard);
    return cmd;
  }

  public static deleteDashboard(cust_id: number, dashboard_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteDashboard';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('dashboard_id', dashboard_id);
    return cmd;
  }

  public static getDashboardWidget(cust_id: number, widget_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDashboardWidget';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('widget_id', widget_id);
    return cmd;
  }

  public static createDashboardWidget(cust_id: number, dashboard_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CreateDashboardWidget';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('dashboard_id', dashboard_id);
    return cmd;
  }

  public static updateDashboardWidget(cust_id: number, widget: DashboardWidget): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateDashboardWidget';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('widget', widget);
    return cmd;
  }

  public static deleteDashboardWidget(cust_id: number, widget_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteDashboardWidget';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('widget_id', widget_id);
    return cmd;
  }

  public static getGraphData(graph_config: GraphWidgetConfig) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetGraphData';
    cmd.addParameter('graph_config', graph_config);
    cmd.addParameter('cust_id', graph_config.cust_id);
    return cmd;
  }

  public static getDashboardData(cust_id: number, config: any) {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetDashboardData';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('config', config);
    return cmd;
  }

  public static setCounterCorrection(cust_id: number, counter_correction: CounterCorrection): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SetCounterCorrection';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('counter_correction', counter_correction);
    return cmd;
  }

  public static calculateSummen(cust_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'CalculateSummen';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static getManualValueList(cust_id: number, device_id: number, max_rows: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetManualValueList';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    cmd.addParameter('max_rows', max_rows);
    return cmd;
  }

  public static uploadManualValue(cust_id: number, override: boolean, manual_value: ManualValue): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UploadManualValue';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('override', override);
    cmd.addParameter('manual_value', manual_value);
    return cmd;
  }

  public static updateManualValue(cust_id: number, device_id: number, manual_value_id: number, manual_value: ManualValue): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'UpdateManualValue';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    cmd.addParameter('manual_value_id', manual_value_id);
    cmd.addParameter('manual_value', manual_value);
    return cmd;
  }

  public static deleteManualValue(cust_id: number, device_id: number, manual_value_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'DeleteManualValue';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('device_id', device_id);
    cmd.addParameter('manual_value_id', manual_value_id);
    return cmd;
  }

  public static recalculateMonthValues(cust_id: number, from_month: Date, to_month: Date, device_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'RecalculateMonthValues';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('from_month', from_month);
    cmd.addParameter('to_month', to_month);
    cmd.addParameter('device_id', device_id);
    return cmd;
  }

  public static recalculateYearValues(cust_id: number, from_year: Date, to_year: Date, device_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'RecalculateYearValues';
    cmd.addParameter('cust_id', cust_id);
    cmd.addParameter('from_year', from_year);
    cmd.addParameter('to_year', to_year);
    cmd.addParameter('device_id', device_id);
    return cmd;
  }

  public static recalculateAndValidateAllMonthValues(cust_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'RecalculateAndValidateAllMonthValues';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static recalculateAndValidateAllYearValues(cust_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'RecalculateAndValidateAllYearValues';
    cmd.addParameter('cust_id', cust_id);
    return cmd;
  }

  public static autoSensorConfig(cust_id: number, sensor_group_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'AutoSensorConfig';
    cmd.addParameter('CustomerID', cust_id);
    cmd.addParameter('SensorGroupID', sensor_group_id);
    return cmd;
  }

  public static getSolarlogConfig(cust_id: number, sensor_group_id: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetSolarlogConfig';
    cmd.addParameter('CustomerID', cust_id);
    cmd.addParameter('SensorGroupID', sensor_group_id);
    return cmd;
  }

  public static reImportSolarlogData(cust_id: number, sensor_group_id: number, time_stamp: Date, readEvents: boolean, readTagesdaten: boolean, readLeistungsdaten: boolean): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'ReImportSolarlogData';
    cmd.addParameter('CustomerID', cust_id);
    cmd.addParameter('SensorGroupID', sensor_group_id);
    cmd.addParameter('TimeStamp', time_stamp);
    cmd.addParameter('ReadEvents', readEvents);
    cmd.addParameter('ReadTagesdaten', readTagesdaten);
    cmd.addParameter('ReadLeistungsdaten', readLeistungsdaten);
    return cmd;
  }

  public static telegramSendAuthRequest(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'Telegram_SendAuthRequest';
    return cmd;
  }

  public static telegramMakeAuth(code: string): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'Telegram_MakeAuth';
    cmd.addParameter('code', code);
    return cmd;
  }

  public static telegramReconnect(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'Telegram_Reconnect';
    return cmd;
  }

  public static telegramSendMessage(message: string, number: string): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'Telegram_SendMessage';
    cmd.addParameter('message', message);
    cmd.addParameter('number', number);
    return cmd;
  }

  public static setUserProfile(userProfile: UserProfile): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SetUserProfile';
    cmd.addParameter('UserProfile', userProfile);
    return cmd;
  }

  public static getUserProfile(): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'GetUserProfile';
    return cmd;
  }

  public static sendUserNotification(sendStatusMail: boolean, sendStatusMessage: boolean, sendErrorMail: boolean, sendErrorMessage): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SendUserNotification';
    cmd.addParameter('StatusPerMail', sendStatusMail);
    cmd.addParameter('StatusPerMessenger', sendStatusMessage);
    cmd.addParameter('ErrorPerMail', sendErrorMail);
    cmd.addParameter('ErrorPerMessenger', sendErrorMessage);
    return cmd;
  }
  public static sendStatusNotification(userID: number, since: Date, mobile_number: string, email: string, mode: number): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SendStatusNotification';
    cmd.addParameter('user_id', userID);
    cmd.addParameter('since', since);
    cmd.addParameter('mobile_number', mobile_number);
    cmd.addParameter('email', email);
    cmd.addParameter('mode', mode);
    return cmd;
  }
  public static sendDashboardReport(custID: number, dashboardID: number, stichdatum: Date): JsonCommand {
    const cmd = new JsonCommand();
    cmd.ModuleName = 'Modules.NetLogger.Service.NetLoggerService';
    cmd.CommandName = 'SendDashboardReport';
    cmd.addParameter('cust_id', custID);
    cmd.addParameter('dashboard_id', dashboardID);
    cmd.addParameter('stichdatum', stichdatum);
    return cmd;
  }
}
