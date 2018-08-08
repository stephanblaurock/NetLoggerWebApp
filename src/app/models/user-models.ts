export class UserProfile {
  UserID: number;
  Name: string;
  EMail: string;
  Mobil: string;
  Password: string;
  ChatToken: string;
  UserNotification: UserNotification;
}

export class UserNotification {
  UserID: number;
  ErrorsPerMail: boolean;
  ErrorsPerMessenger: boolean;
  ReportsDaily: boolean;
  ReportsDailyMailAddresses: boolean;
  ReportsMonthly: boolean;
  ReportsMonthlyMailAddresses: boolean;

  DailyStatus: boolean;
  DailyOnlyOnError: boolean;
  DailyWithEMail: boolean;
  DailyWithMessenger: boolean;
  TimestampDailyReport: Date;
  ErrorStatus: boolean;
  ErrorWithEMail: boolean;
  ErrorWithMessenger: boolean;
  TimestampErrorReport: Date;
  ErrorLastChecked: Date;
  DailyDashboardReports: DashboardReportInfo[];
  MonthlyStatus: boolean;
  MonthlyDashboardReports: DashboardReportInfo[];
}

export class DashboardReportInfo {
  IsSelected: boolean;
  CustomerID: number;
  CustomerCaption: string;
  DashboardID: number;
  DashboardCaption: string;
  MailAddresses: string;
}
