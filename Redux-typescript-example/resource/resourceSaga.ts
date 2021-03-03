import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import pickBy from 'lodash.pickby';
import { push, replace } from 'connected-react-router';
import { message } from 'antd';
import { objectToFormData } from 'object-to-formdata';
import queryString from 'query-string';
import * as actions from './resourceAction';
import {
  FetchResourceActionType,
  FetchSingleResourceType,
  CreateResourceRequestType,
  ResetSearchResourceType,
  ChangePageType,
  SortByType,
  DeleteResourceType,
  UpdateResourceType,
  SearchResourceType,
  RemoveSearchParamsType,
} from './types';
import * as selector from './resourceSelectors';
import axios from '../../config/axios';
import { paramsToString, combineParams } from './utils';

export function* fetchResourcesSaga(
  action: FetchResourceActionType
): SagaIterator<void> {
  const { resourceName } = action;

  const page: number = yield select(selector.pageSelector(resourceName));
  const resourceRoute: string = yield select(
    selector.resourceRoueSelector(resourceName)
  );

  const pagination = yield select(selector.paginationSelector(resourceName));

  if (pagination.getIn([page, 'loaded']) || pagination.getIn([page, 'loading']))
    return;

  try {
    const params = yield select(
      selector.resourceFetchParamsSelector(resourceName)
    );

    yield put(
      actions.fetchResourceForPageStart(resourceName)(
        page,
        queryString.stringify(params)
      )
    );

    const response = yield call(axios.get, `/${resourceRoute}`, {
      params,
    });

    const customResourceName =
      (resourceName === 'archiveUsers' && 'users') ||
      (resourceName === 'archiveVehicles' && 'vehicles') ||
      (resourceName === 'archiveEquipments' && 'equipments') ||
      resourceName;

    const resources = response.data.data[customResourceName];

    const total =
      response.data.data.meta?.pagination?.total || resources.length;

    yield put(
      actions.fetchResourcesSuccess(resourceName)({
        page,
        data: resources,
        total,
      })
    );
  } catch (error) {
    const { status } = error.response;

    yield put(actions.fetchResourcesError(resourceName)(page));

    message.error(`Fetch resource error, error status: ${status} `);
  }
}

export function* fetchSingleResourceSaga(
  action: FetchSingleResourceType
): SagaIterator<void> {
  const { resourceName } = action;

  const {
    id,
    message: { notExist, unknownError },
  } = action.payload;

  const singleName = yield select(selector.selectSingleName(resourceName));
  const path: string = yield select(selector.pathUrlSelector(resourceName));
  const resourceRoute: string = yield select(
    selector.resourceRoueSelector(resourceName)
  );

  try {
    const response = yield call(axios.get, `${resourceRoute}/${id}`);

    yield put(
      actions.fetchSingleResourceSuccess(resourceName)({
        data: response.data.data[singleName],
      })
    );
  } catch (error) {
    const { status, data } = error.response;

    if (status === 404 && data?.data?.deleted) {
      yield put(actions.catchResourceDeleted(resourceName)(id));
    } else {
      yield put(push(`${path}/list`));
      yield put(actions.fetchSingleResourceError(resourceName)(id));

      if (status === 404) {
        message.error(notExist);
      } else {
        message.error(`${unknownError} ${status}`);
      }
    }
  }
}

export function* addResourceSaga(
  action: CreateResourceRequestType
): SagaIterator<void> {
  const { resourceName, payload } = action;

  const { values, quotaExceededMsg } = payload;

  const resourceRoute: string = yield select(
    selector.resourceRoueSelector(resourceName)
  );

  const formData = objectToFormData(
    pickBy({ ...values }, (value) => !(!value && typeof value === 'object')),
    {
      indices: true,
    }
  );

  try {
    yield call(axios.post, `${resourceRoute}`, formData);

    yield put(actions.createResourceSuccess(resourceName)());

    const path: string = yield select(selector.pathUrlSelector(resourceName));

    yield put(actions.cleanResources(resourceName)());

    yield put(push(`${path}/list`));
  } catch (error) {
    const { status } = error.response;

    if (status === 409) {
      message.error(quotaExceededMsg || 'Error status 409', 8);
      yield put(actions.createResourceError(resourceName)());
    } else if (status === 400) {
      yield put(
        actions.createResourceError(resourceName)(error.response.data.data)
      );
    } else {
      message.error(`Create resource error, error status: ${status} `);
      yield put(actions.createResourceError(resourceName)());
    }
  }
}

export function* updateResourceSaga(
  action: UpdateResourceType
): SagaIterator<void> {
  const { resourceName, payload } = action;
  const { id, resourceData, successMessage } = payload;
  const path = yield select(selector.pathUrlSelector(resourceName));
  const singleName = yield select(selector.selectSingleName(resourceName));
  const search = yield select(selector.searchSelector);

  const resourceRoute: string = yield select(
    selector.resourceRoueSelector(resourceName)
  );

  try {
    const response = yield call(
      axios.put,
      `${resourceRoute}/${id}`,
      resourceData
    );

    yield put(
      actions.updateResourceSuccess(resourceName)({
        data: response.data.data[singleName],
      })
    );

    message.success(successMessage);

    yield put(push(`${path}/${id}${search}`));
  } catch (error) {
    const { status } = error.response;

    if (status === 400) {
      yield put(
        actions.updateResourceError(resourceName)(error.response.data.data)
      );
    } else {
      message.error(`Update resource error, error status: ${status} `);
      yield put(actions.updateResourceError(resourceName)());
    }
  }
}

export function* changePaginationPageSaga(
  action: ChangePageType
): SagaIterator<void> {
  const { resourceName, payload } = action;
  const page = payload;
  const path: string = yield select(selector.pathUrlSelector(resourceName));
  const search: string = yield select(selector.searchSelector);
  yield put(push(`${path}/list/${page}${search}`));
}

export function* deleteResourceSaga(
  action: DeleteResourceType
): SagaIterator<void> {
  const { resourceName, payload } = action;
  const { id, successMessage, redirectLink, customResourceName } = payload;
  const resourceRoute: string = yield select(
    selector.resourceRoueSelector(resourceName)
  );

  try {
    yield call(axios.delete, `${resourceRoute}/${id}`);
    const path: string = yield select(selector.pathUrlSelector(resourceName));
    yield put(actions.catchResourceDeleted(resourceName)(id));
    yield put(actions.cleanResources(customResourceName || resourceName)());
    yield put(push(`${redirectLink || path}/list`));
    message.success(successMessage);
  } catch (error) {
    const { status } = error.response;
    message.error(`Delete resource error, error status: ${status} `);
  }
}

export function* sortResourceSaga(action: SortByType): SagaIterator<void> {
  const { resourceName, payload } = action;
  const { sortBy, sortOrder } = payload;

  const path: string = yield select(selector.pathUrlSelector(resourceName));

  const params = yield select(
    combineParams({
      sort: sortBy ? `${sortBy}` : '',
      sortOrder,
    })
  );
  const paramsString = paramsToString(params);

  yield put(push(`${path}/list/1?${paramsString}`));
}

export function* searchResourceSaga(
  action: SearchResourceType
): SagaIterator<void> {
  const { resourceName } = action;
  const searchValues = action.payload;

  const searchParams: { [key: string]: string | number | null } = {};

  Object.entries(searchValues).forEach(([key, value]): void => {
    if (Array.isArray(value)) {
      searchParams[key] = encodeURIComponent(value.join(','));
    } else if (typeof value === 'string' || value) {
      searchParams[key] = encodeURIComponent(value);
    } else {
      searchParams[key] = null;
    }
  });

  const path = yield select(selector.pathUrlSelector(resourceName));

  const params = yield select(
    combineParams({
      ...searchParams,
      sort: '',
      sortOrder: '',
    })
  );

  const paramsString = paramsToString(params);

  yield put(replace(`${path}/list/1?${paramsString}`));
}

export function* resetSearchResourceSaga(
  action: ResetSearchResourceType
): SagaIterator<void> {
  const { resourceName, payload } = action;

  const redirectLink = payload;

  const path = yield select(selector.pathUrlSelector(resourceName));

  if (redirectLink) {
    yield put(replace(`/${redirectLink}`));
  } else {
    yield put(replace(`${path}/list/1`));
  }
}

export function* changePerPageSaga(action: SearchResourceType): Generator {
  const { resourceName } = action;
  yield put(actions.cleanResources(resourceName)());
}

export function* removeSearchParamSaga(
  action: RemoveSearchParamsType
): SagaIterator<void> {
  const { resourceName } = action;

  const { removeKey, removeValue } = action.payload;
  const pathUrl = yield select(selector.pathUrlSelector(resourceName));
  const search = yield select(selector.searchSelector);
  const parsedSearch = queryString.parse(search);
  const newParams: { [key: string]: string | string[] | null | undefined } = {};

  const newSearchParams = Object.entries(parsedSearch).reduce(
    (acc, [key, value]) => {
      if (key !== removeKey) {
        return { ...acc, [key]: value };
      }

      if (typeof value === 'string' && value.split(',').length > 1) {
        const newValue = value.split(',');

        return {
          ...acc,
          [key]: newValue.filter((val) => val !== removeValue),
        };
      }

      delete acc[key];

      return acc;
    },
    newParams
  );

  yield put(
    push(
      `${pathUrl}/list/1?${queryString.stringify(newSearchParams, {
        arrayFormat: 'comma',
      })}`
    )
  );
}

export default function* saga(): Generator {
  yield all([
    takeEvery(actions.FETCH_RESOURCES_REQUEST, fetchResourcesSaga),
    takeEvery(actions.CHANGE_PER_PAGE, changePerPageSaga),
    takeEvery(actions.SORT_BY, sortResourceSaga),
    takeEvery(actions.FETCH_SINGLE_RESOURCE_REQUEST, fetchSingleResourceSaga),
    takeEvery(actions.CREATE_RESOURCE_REQUEST, addResourceSaga),
    takeEvery(actions.CHANGE_PAGINATION_PAGE, changePaginationPageSaga),
    takeEvery(actions.EDIT_RESOURCE_REQUEST, updateResourceSaga),
    takeEvery(actions.DELETE_RESOURCE_REQUEST, deleteResourceSaga),
    takeEvery(actions.SEARCH_RESOURCE, searchResourceSaga),
    takeEvery(actions.RESET_SEARCH_RESOURCE, resetSearchResourceSaga),
    takeEvery(actions.REMOVE_SEARCH_PARAM, removeSearchParamSaga),
  ]);
}
