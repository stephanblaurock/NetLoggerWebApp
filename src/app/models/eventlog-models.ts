export interface EventLogPlainGroup {
  cust_id: number;
  cust_caption: string;
  event_logs: EventLogPlainItem[];
}

export interface EventLogPlainItem {
  id: number;    // event_id
  cid: number;    // cust_id
  ts: Date;       // time_stamp
  et: number;     // event_type
  est: number;    // event_source_type
  esc: string;    // event_source_caption
  sid: number;    // source_id
  ec: number;     // event_code
  ecc: string;    // event_code_caption
  ack: boolean;   // ack
  act: Date;      // ack_timestamp
  acu: string;    // ack_user
  se: boolean;    // is_software_error
  occ: number;    // occurance
}

export interface EventLog {
  id: number;
  cust_id: number;
  time_stamp: Date;
  event_type: number;
  event_source_type: number;
  event_source_caption: number;
  source_id: number;
  event_code: number;
  event_code_caption: string;
  description: string;
  ack: boolean;
  ack_timestamp: Date;
  ack_user: string;
  is_software_error: boolean;
  occurance: number;
}

export class EventLogFilter {
  cust_id: number;
  min_event_type: number;
  event_source_type_filter: number;
  source_id_filter: number;
  max_rows: number;
}
