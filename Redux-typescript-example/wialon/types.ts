export type WialonStateType = {
  sessionId: string;
  token: string;
  loaded: boolean;
  url: string;
  temporaryUrl: string;
  connected: boolean;
  fuelReport: WialonReportType | null;
  fuelReportError: boolean;
  fuelReportLoading: boolean;
};

export type WialonReportType = Array<[string, string]>;

export type ExecReportResponseType = {
  reportResult: {
    attachments: Array<unknown>;
    msgsRendered: number;
    stats: WialonReportType;
    tables: Array<unknown>;
  };
};

export type WialonOptionType = {
  $$hash: string;
  $$user_dataFlags: number;
  $$user_measureUnits: number;
  $$user_name: string;
  $$user_userAccess: number;
  _id: number;
};