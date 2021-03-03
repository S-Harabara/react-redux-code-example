export const INIT_SESSION = 'INIT_SESSION';
export const INIT_WIALON_SESSION = 'INIT_WIALON_SESSION';
export const INIT_WIALON_SESSION_SUCCESS = 'INIT_WIALON_SESSION_SUCCESS';
export const SAVE_URL = 'SAVE_URL';
export const INIT_WIALON_SESSION_ERROR = 'INIT_WIALON_SESSION_ERROR';
export const WIALON_CONNECT = 'WIALON_CONNECT';
export const WIALON_CONNECT_SUCCESS = 'WIALON_CONNECT_SUCCESS';
export const WIALON_DISCONNECT = 'WIALON_DISCONNECT';
export const WIALON_FUEL_REPORT_REQUEST = 'WIALON_FUEL_REPORT_REQUEST';
export const WIALON_FUEL_REPORT_SUCCESS = 'WIALON_FUEL_REPORT_SUCCESS';
export const WIALON_FUEL_REPORT_ERROR = 'WIALON_FUEL_REPORT_ERROR';
export const WIALON_FUEL_REPORT_CLEAN = 'WIALON_FUEL_REPORT_CLEAN';

export type FuelReportCleanType = {
  type: typeof WIALON_FUEL_REPORT_CLEAN;
};
export const fuelReportClean = (): FuelReportCleanType => {
  return {
    type: WIALON_FUEL_REPORT_CLEAN,
  };
};

export type GenerateFuelReportType = {
  type: typeof WIALON_FUEL_REPORT_REQUEST;
  payload: {
    from: number;
    to: number;
    vehicleId: number;
  };
};
export const generateFuelReport = (
  from: number,
  to: number,
  vehicleId: number
): GenerateFuelReportType => {
  return {
    type: WIALON_FUEL_REPORT_REQUEST,
    payload: {
      from,
      to,
      vehicleId,
    },
  };
};

export type ReportType = Array<[string, string]>;

export type GenerateFuelReportSuccessType = {
  type: typeof WIALON_FUEL_REPORT_SUCCESS;
  payload: ReportType;
};

export const generateReportSuccess = (
  report: ReportType
): GenerateFuelReportSuccessType => {
  return {
    type: WIALON_FUEL_REPORT_SUCCESS,
    payload: report,
  };
};

export type GenerateFuelReportErrorType = {
  type: typeof WIALON_FUEL_REPORT_ERROR;
};

export const generateReportError = (): GenerateFuelReportErrorType => {
  return {
    type: WIALON_FUEL_REPORT_ERROR,
  };
};

export type InitSessionType = {
  type: typeof INIT_SESSION;
};
export const initSession = (): InitSessionType => {
  return {
    type: INIT_SESSION,
  };
};

export type InitWialonSessionType = {
  type: typeof INIT_WIALON_SESSION;
  payload: string;
};
export const initWialonSession = (token: string): InitWialonSessionType => {
  return {
    type: INIT_WIALON_SESSION,
    payload: token,
  };
};

export type InitWialonSessionSuccessType = {
  type: typeof INIT_WIALON_SESSION_SUCCESS;
};
export const initWialonSessionSuccess = (): InitWialonSessionSuccessType => {
  return {
    type: INIT_WIALON_SESSION_SUCCESS,
  };
};

export type SaveUrlType = {
  type: typeof SAVE_URL;
  payload: string;
};
export const saveUrl = (url: string): SaveUrlType => {
  return {
    type: SAVE_URL,
    payload: url,
  };
};

export type InitWialonSessionErrorType = {
  type: typeof INIT_WIALON_SESSION_ERROR;
};
export const initWialonSessionError = (): InitWialonSessionErrorType => {
  return {
    type: INIT_WIALON_SESSION_ERROR,
  };
};

export type WialonConnectType = {
  type: typeof WIALON_CONNECT;
  payload: string;
};
export const wialonConnect = (url: string): WialonConnectType => {
  return {
    type: WIALON_CONNECT,
    payload: url,
  };
};

export type WialonConnectSuccessType = {
  type: typeof WIALON_CONNECT_SUCCESS;
  payload: string;
};
export const wialonConnectSuccess = (
  token: string
): WialonConnectSuccessType => {
  return {
    type: WIALON_CONNECT_SUCCESS,
    payload: token,
  };
};

export type WialonDisconnectType = {
  type: typeof WIALON_DISCONNECT;
};
export const wialonDisconnect = (): WialonDisconnectType => {
  return {
    type: WIALON_DISCONNECT,
  };
};

export type monitoringActionType =
  | InitSessionType
  | SaveUrlType
  | InitWialonSessionSuccessType
  | InitWialonSessionErrorType
  | WialonConnectType
  | WialonConnectSuccessType
  | WialonDisconnectType
  | GenerateFuelReportType
  | GenerateFuelReportSuccessType
  | GenerateFuelReportErrorType
  | FuelReportCleanType
  | InitWialonSessionType;
