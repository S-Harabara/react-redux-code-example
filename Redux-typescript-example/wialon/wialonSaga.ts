import { takeEvery, put, take, call, all, select } from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';
import { message } from 'antd';
import queryString from 'query-string';
import jsonp from 'jsonp';
import moment from 'moment';
import axios from '../../config/axios';
import {
  INIT_SESSION,
  WIALON_CONNECT,
  INIT_WIALON_SESSION,
  WIALON_FUEL_REPORT_REQUEST,
  initWialonSession,
  saveUrl,
  initWialonSessionSuccess,
  initWialonSessionError,
  wialonConnectSuccess,
  generateReportSuccess,
  generateReportError,
  InitWialonSessionType,
  WialonConnectSuccessType,
  WialonConnectType,
  GenerateFuelReportType,
  WIALON_CONNECT_SUCCESS,
  WIALON_DISCONNECT,
  ReportType,
} from './wialonAction';
import { WIALON_CLIENT_ID, DATE_TIME_FORMAT } from '../../config';
import { ReduxState } from '../types';
import { ExecReportResponseType } from './types';
import fuelReportTemplate from './reportTemplates/fuelReport';

function* initSessionSaga() {
  try {
    const response: {
      data: { data: { token: string } };
    } = yield call(axios.get, 'wtoken');

    yield put(initWialonSession(response.data.data.token));
  } catch (e) {
    yield put(initWialonSessionError());
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function wialonLoginChannel(token: string, url: string) {
  return eventChannel((emitter) => {
    const sess = wialon.core.Session.getInstance(); // get instance of current Session
    sess.initSession(url); // initialize Wialon session

    sess.loginToken(
      token,
      '', // trying login
      (code): void => {
        if (code) {
          emitter(wialon.core.Errors.getErrorText(code));
        } else {
          emitter('success');
        }
      }
    );

    return (): void => {};
  });
}

function* initWialonSessionSaga(action: InitWialonSessionType) {
  const token = action.payload;
  const response = yield call(axios.get, 'wurl');
  const { url } = response.data.data;

  yield put(saveUrl(url));

  const channel = yield call(wialonLoginChannel, token, url);

  try {
    while (true) {
      const errorMessage: null | string = yield take(channel);

      if (errorMessage === 'success') {
        yield put(initWialonSessionSuccess());
      } else {
        yield put(initWialonSessionError());
        yield message.error(errorMessage);
      }
    }
  } catch (e) {
    yield put(initWialonSessionError());
  }
}

function* wialonConnectSaga(action: WialonConnectType) {
  const wialonGetTokenParems = {
    client_id: WIALON_CLIENT_ID,
    access_type: -1, // Full access
    activation_time: 0,
    duration: 2592000,
    redirect_uri: `${action.payload}/post_token.html`, // post_token.html trigger message with token on window
  };
  const url = `${action.payload}/login.html?${queryString.stringify(
    wialonGetTokenParems
  )}`;
  yield window.open(url, '_blank', 'width=760, height=500, top=300, left=500');
}

function tokenMessageChannel(): EventChannel<string> {
  return eventChannel((emitter) => {
    const handleMessage = (event: { data: string | null }): void => {
      const token = event?.data;
      if (typeof token === 'string' && token.indexOf('access_token=') >= 0) {
        emitter(token.replace('access_token=', ''));
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    return (): void => {
      window.removeEventListener('message', handleMessage);
    };
  });
}

function* watchTokenMessageSaga() {
  const channel = tokenMessageChannel();

  while (true) {
    const token: string = yield take(channel);
    const url = yield select((state: ReduxState) => state.wialon.temporaryUrl);
    yield call(axios.post, '/wurl', { url });
    yield put(wialonConnectSuccess(token));
  }
}

function* saveTokenSaga(action: WialonConnectSuccessType): Generator {
  const token = action.payload;

  yield call(axios.post, 'wtoken', { token });

  // Reload page after success connect.
  // This fix bug in wialon sdk when user is empty after connect
  window.location.reload();
}

function* wialonDisconnectSaga() {
  yield call(axios.delete, 'wtoken');
}

function wialonExecReportChannel(
  url: string,
  from: number,
  to: number,
  vehicleId: number,
  resourceId: number,
  token: string
): EventChannel<Array<[string, string]>> {
  function isResponse(
    response: ExecReportResponseType | { error: number }
  ): response is ExecReportResponseType {
    return !((response as ExecReportResponseType).reportResult === undefined);
  }

  return eventChannel((emitter) => {
    const params = {
      reportResourceId: resourceId,
      reportTemplateId: 0,
      reportTemplate: fuelReportTemplate,
      reportObjectId: vehicleId,
      reportObjectSecId: 0,
      interval: { from, to, flags: 0 },
    };

    jsonp(
      `${url}/wialon/ajax.html?svc=report/exec_report&sid=${token}&params=${JSON.stringify(
        params
      )}`,
      {},
      (error, response: ExecReportResponseType | { error: number }) => {
        if (isResponse(response)) {
          emitter(response.reportResult.stats);
        } else {
          // @ts-ignore
          emitter(Error('Exec report error'));
        }
      }
    );

    return (): void => {};
  });
}

function* generateFuelReportSaga(action: GenerateFuelReportType) {
  const { from, to, vehicleId } = action.payload;

  const sess = wialon.core.Session.getInstance(); // get instance of current Session

  const user = sess.getCurrUser();
  const resourceId = user.getAccountId();
  // @ts-ignore
  const token = sess.__cT;
  const url = yield select((state: ReduxState) => state.wialon.url);

  const channel = yield call(
    wialonExecReportChannel,
    url,
    from,
    to,
    vehicleId,
    resourceId,
    token
  );

  try {
    while (true) {
      const response: ReportType = yield take(channel);

      response.unshift(['from', moment.unix(from).format(DATE_TIME_FORMAT)]);
      response.unshift(['to', moment.unix(to).format(DATE_TIME_FORMAT)]);

      yield put(generateReportSuccess(response));
    }
  } catch (e) {
    yield put(generateReportError());
  }
}

export default function* wialonSaga(): Generator {
  yield all([
    watchTokenMessageSaga(),
    takeEvery(INIT_SESSION, initSessionSaga),
    takeEvery(INIT_WIALON_SESSION, initWialonSessionSaga),
    takeEvery(WIALON_CONNECT, wialonConnectSaga),
    takeEvery(WIALON_CONNECT_SUCCESS, saveTokenSaga),
    takeEvery(WIALON_DISCONNECT, wialonDisconnectSaga),
    takeEvery(WIALON_FUEL_REPORT_REQUEST, generateFuelReportSaga),
  ]);
}
