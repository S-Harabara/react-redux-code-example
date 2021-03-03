import { Record } from 'immutable';
import {
  INIT_WIALON_SESSION,
  INIT_WIALON_SESSION_ERROR,
  INIT_WIALON_SESSION_SUCCESS,
  WIALON_FUEL_REPORT_SUCCESS,
  WIALON_FUEL_REPORT_REQUEST,
  WIALON_FUEL_REPORT_ERROR,
  monitoringActionType,
  SAVE_URL,
  WIALON_CONNECT,
  WIALON_CONNECT_SUCCESS,
  WIALON_DISCONNECT,
  WIALON_FUEL_REPORT_CLEAN,
} from './wialonAction';
import { WialonStateType } from './types';

const ReducerStateFactory = Record<WialonStateType>({
  sessionId: '',
  token: '',
  url: '',
  temporaryUrl: '',
  loaded: false,
  connected: false,
  fuelReport: null,
  fuelReportError: false,
  fuelReportLoading: false,
});

export default function (
  state = new ReducerStateFactory(),
  action: monitoringActionType
): WialonStateType {
  switch (action.type) {
    case INIT_WIALON_SESSION:
      return state.set('token', action.payload);
    case INIT_WIALON_SESSION_SUCCESS:
      return state.set('loaded', true).set('connected', true);
    case INIT_WIALON_SESSION_ERROR:
      return state.set('loaded', true).set('connected', false);
    case SAVE_URL:
      return state.set('url', action.payload);
    case WIALON_CONNECT:
      return state.set('temporaryUrl', action.payload);
    case WIALON_FUEL_REPORT_REQUEST:
      return state.set('fuelReportLoading', true);
    case WIALON_FUEL_REPORT_ERROR:
      return state
        .set('fuelReportError', true)
        .set('fuelReportLoading', false)
        .set('loaded', true);
    case WIALON_FUEL_REPORT_CLEAN:
      return state.set('fuelReport', null).set('fuelReportError', false);
    case WIALON_FUEL_REPORT_SUCCESS:
      return state
        .set('fuelReport', action.payload)
        .set('fuelReportLoading', false);
    case WIALON_CONNECT_SUCCESS:
      return state
        .set('token', action.payload)
        .set('loaded', true)
        .set('connected', true)
        .set('url', state.get('temporaryUrl'));
    case WIALON_DISCONNECT:
      return state
        .set('token', '')
        .set('url', '')
        .set('temporaryUrl', '')
        .set('loaded', true)
        .set('connected', false);
    default:
      return state;
  }
}
