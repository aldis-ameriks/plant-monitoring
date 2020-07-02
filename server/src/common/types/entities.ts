/* eslint-disable @typescript-eslint/no-namespace,@typescript-eslint/class-name-casing */

/**
 * AUTO-GENERATED FILE @ 2020-07-02 21:12:07 - DO NOT EDIT!
 *
 */

export enum DeviceStatus {
  new = 'new',
  paired = 'paired',
  pairing = 'pairing',
  reset = 'reset',
}
export enum DeviceType {
  hub = 'hub',
  sensor = 'sensor',
}
export enum DeviceVersion {
  hub_10 = 'hub_10',
  sensor_10 = 'sensor_10',
}
export enum NotificationType {
  low_battery = 'low_battery',
  low_moisture = 'low_moisture',
}

export namespace DevicesFields {
  export type id = number;
  export type room = string;
  export type test = boolean;
  export type name = string;
  export type firmware = string;
  export type address = string;
  export type last_seen_at = Date;
  export type version = DeviceVersion;
  export type status = DeviceStatus;
  export type type = DeviceType;
}

export interface DeviceEntity {
  id: DevicesFields.id;
  room?: DevicesFields.room;
  test?: DevicesFields.test;
  name?: DevicesFields.name;
  firmware?: DevicesFields.firmware;
  address?: DevicesFields.address;
  last_seen_at?: DevicesFields.last_seen_at;
  version: DevicesFields.version;
  status: DevicesFields.status;
  type: DevicesFields.type;
}

export namespace UsersAccessKeysFields {
  export type user_id = number;
  export type access_key = string;
  export type roles = Array<string>;
}

export interface UsersAccessKeyEntity {
  user_id?: UsersAccessKeysFields.user_id;
  access_key?: UsersAccessKeysFields.access_key;
  roles?: UsersAccessKeysFields.roles;
}

export namespace ReadingsFields {
  export type device_id = number;
  export type timestamp = Date;
  export type moisture = number;
  export type moisture_raw = number;
  export type moisture_max = number;
  export type moisture_min = number;
  export type temperature = number;
  export type light = number;
  export type battery_voltage = number;
  export type signal = number;
  export type reading_id = number;
  export type hub_id = number;
}

export interface ReadingEntity {
  device_id: ReadingsFields.device_id;
  timestamp: ReadingsFields.timestamp;
  moisture?: ReadingsFields.moisture;
  moisture_raw?: ReadingsFields.moisture_raw;
  moisture_max?: ReadingsFields.moisture_max;
  moisture_min?: ReadingsFields.moisture_min;
  temperature?: ReadingsFields.temperature;
  light?: ReadingsFields.light;
  battery_voltage?: ReadingsFields.battery_voltage;
  signal?: ReadingsFields.signal;
  reading_id?: ReadingsFields.reading_id;
  hub_id?: ReadingsFields.hub_id;
}

export namespace FaultyReadingsFields {
  export type device_id = number;
  export type timestamp = Date;
  export type moisture = number;
  export type moisture_raw = number;
  export type moisture_max = number;
  export type moisture_min = number;
  export type temperature = number;
  export type light = number;
  export type battery_voltage = number;
  export type signal = number;
  export type reading_id = number;
  export type hub_id = number;
}

export interface FaultyReadingEntity {
  device_id: FaultyReadingsFields.device_id;
  timestamp: FaultyReadingsFields.timestamp;
  moisture?: FaultyReadingsFields.moisture;
  moisture_raw?: FaultyReadingsFields.moisture_raw;
  moisture_max?: FaultyReadingsFields.moisture_max;
  moisture_min?: FaultyReadingsFields.moisture_min;
  temperature?: FaultyReadingsFields.temperature;
  light?: FaultyReadingsFields.light;
  battery_voltage?: FaultyReadingsFields.battery_voltage;
  signal?: FaultyReadingsFields.signal;
  reading_id?: FaultyReadingsFields.reading_id;
  hub_id?: FaultyReadingsFields.hub_id;
}

export namespace UsersFields {
  export type id = number;
}

export interface UserEntity {
  id: UsersFields.id;
}

export namespace UserSettingsFields {
  export type user_id = number;
  export type name = string;
  export type value = string;
}

export interface UserSettingEntity {
  user_id?: UserSettingsFields.user_id;
  name: UserSettingsFields.name;
  value: UserSettingsFields.value;
}

export namespace NotificationsFields {
  export type id = string;
  export type user_id = number;
  export type device_id = number;
  export type created_at = Date;
  export type sent_at = Date;
  export type type = NotificationType;
  export type title = string;
  export type body = string;
}

export interface NotificationEntity {
  id: NotificationsFields.id;
  user_id: NotificationsFields.user_id;
  device_id?: NotificationsFields.device_id;
  created_at: NotificationsFields.created_at;
  sent_at?: NotificationsFields.sent_at;
  type: NotificationsFields.type;
  title: NotificationsFields.title;
  body: NotificationsFields.body;
}

export namespace UsersDevicesFields {
  export type user_id = number;
  export type device_id = number;
}

export interface UsersDeviceEntity {
  user_id?: UsersDevicesFields.user_id;
  device_id?: UsersDevicesFields.device_id;
}
