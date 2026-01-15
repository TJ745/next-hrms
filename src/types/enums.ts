export enum UserRole {
  ADMIN = "ADMIN",
  HR = "HR",
  EMPLOYEE = "EMPLOYEE",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  LEAVE = "LEAVE",
}

export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum AssetStatus {
  ASSIGNED = "ASSIGNED",
  RETURNED = "RETURNED",
}

export enum ApprovalType {
  LEAVE = "LEAVE",
  OVERTIME = "OVERTIME",
  ASSET = "ASSET",
}

export enum ApprovalLevel {
  MANAGER = "MANAGER",
  HR = "HR",
  ADMIN = "ADMIN",
}

export enum WeekDay {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN",
}

export enum DocumentType {
  ID = "ID",
  PASSPORT = "PASSPORT",
  CONTRACT = "CONTRACT",
  CERTIFICATE = "CERTIFICATE",
  OTHER = "OTHER",
  IQAMA = "IQAMA",
  CV = "CV",
  HIGH_SCHOOL_CERTIFICATE = "High School Certificate",
  UNIVERSITY_CERTIFICATE = "University Certificate",
  OTHER_CERTIFICATE = "Other Certificate",
}

export enum NotificationType {
  APPROVAL = "APPROVAL",
  DOCUMENT_EXPIRY = "DOCUMENT_EXPIRY",
  ATTENDANCE = "ATTENDANCE",
  PAYROLL = "PAYROLL",
  SYSTEM = "SYSTEM",
}
