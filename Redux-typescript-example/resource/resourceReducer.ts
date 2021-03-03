import { Map, OrderedMap, Record } from 'immutable';
import {
  ReducerStateType,
  ResourceActionTypes,
  ResourceReducerState,
} from './types';
import * as actions from './resourceAction';
import { arrayToOrderedMap } from './utils';
import { RESOURCE_PAGE_SIZE_OPTIONS } from '../../config';

export const ReducerFactory = Record<ResourceReducerState>({
  createResourceSubmitting: false,
  updateResourceSubmitting: false,
  fullEntities: Map({}),
  fullEntitiesLoaded: Map({}),
  fullEntitiesLoading: Map({}),
  entities: OrderedMap({}),
  entityLoaded: Map({}),
  entityLoading: Map({}),
  pagination: Map({}),
  createResourceErrors: Map({}),
  updateResourceErrors: Map({}),
  limit: RESOURCE_PAGE_SIZE_OPTIONS[0],
  total: 0,
  page: null,
  baseUrl: '',
  path: '',
  singleName: '',
  queryFilter: {},
  entityKey: '',
  route: '',
  params: '',
  defaultSort: '',
  defaultSortOrder: 'descend',
  registered: false,
  isDeleted: [],
});

export function createResoucesReducer<RecordType>(
  reducerFunction: (
    state: ReducerStateType,
    action: ResourceActionTypes,
    EntityRecord: RecordType
  ) => ReducerStateType,
  resorcesName: string,
  EntityRecord: RecordType,
  extendReducer?: (
    state: ReducerStateType,
    action: ResourceActionTypes,
    EntityRecord: RecordType
  ) => ReducerStateType
) {
  return (state: ReducerStateType, action: ResourceActionTypes) => {
    const isInitializationCall = state === undefined;
    const shouldRunWrappedReducer =
      action.resourceName === resorcesName || isInitializationCall;

    if (shouldRunWrappedReducer) {
      return typeof extendReducer === 'function'
        ? extendReducer(
            reducerFunction(state, action, EntityRecord),
            action,
            EntityRecord
          )
        : reducerFunction(state, action, EntityRecord);
    }

    return state;
  };
}

const initialState = ReducerFactory();

const resourceReducer = (
  state: ReducerStateType = initialState,
  action: ResourceActionTypes,
  EntityRecord: Record.Factory<any>
): ReducerStateType => {
  let newState;

  switch (action.type) {
    case actions.REGISTER_RESOURCE:
      return state
        .set('baseUrl', action.payload.baseUrl)
        .set('path', action.payload.path)
        .set('entityKey', action.payload.entityKey)
        .set('queryFilter', action.payload.queryFilter)
        .set('singleName', action.payload.singleName)
        .set('registered', true)
        .set('defaultSort', action.payload.defaultSort)
        .set('defaultSortOrder', action.payload.defaultSortOrder)
        .set('route', action.payload.route);

    case actions.CREATE_RESOURCE_REQUEST:
      return state.set('createResourceSubmitting', true);

    case actions.CREATE_RESOURCE_SUCCESS:
      return state.set('createResourceSubmitting', false);

    case actions.CREATE_RESOURCE_ERROR:
      newState = state.set('createResourceSubmitting', false);

      if (action && action.payload) {
        newState = newState.set('createResourceErrors', Map(action.payload));
      }

      return newState.set('createResourceSubmitting', false);
    case actions.CLEAR_RESOURCE_ERRORS:
      return state
        .set('createResourceErrors', Map({}))
        .set('updateResourceErrors', Map({}));
    case actions.CHANGE_PER_PAGE:
      return state.set('limit', action.payload);

    case actions.FETCH_RESOURCES_FOR_PAGE_START:
      return state
        .setIn(['pagination', action.payload.page, 'loading'], true)
        .set('params', action.payload.params);

    case actions.FETCH_SINGLE_RESOURCE_REQUEST:
      return state
        .setIn(['fullEntitiesLoaded', action.payload], false)
        .setIn(['fullEntitiesLoading', action.payload], true);

    case actions.FETCH_SINGLE_RESOURCE_ERROR:
      return state
        .setIn(['fullEntitiesLoaded', action.payload], true)
        .setIn(['fullEntitiesLoading', false], true);

    case actions.FETCH_SINGLE_RESOURCE_SUCCESS:
      return state

        .setIn(
          ['fullEntities', action.payload.data.id],
          EntityRecord(action.payload.data)
        )
        .setIn(['fullEntitiesLoaded', action.payload.data.id], true)
        .setIn(['fullEntitiesLoading', action.payload.data.id], false);

    case actions.FETCH_RESOURCES_ERROR:
      return state.setIn(['pagination', action.payload, 'loading'], false);

    case actions.FETCH_RESOURCES_REQUEST:
      return state
        .set('limit', action.payload.limit)
        .set('page', action.payload.page);

    case actions.FETCH_RESOURCES_SUCCESS:
      return state
        .update('entities', (entities) => {
          const data = arrayToOrderedMap(
            action.payload.data,
            EntityRecord,
            state.get('entityKey')
          ).merge(entities);

          return data;
        })
        .set('total', action.payload.total)
        .setIn(['pagination', action.payload.page, 'loading'], false)
        .setIn(['pagination', action.payload.page, 'loaded'], true)
        .setIn(
          ['pagination', action.payload.page, 'ids'],
          action.payload.data.map(
            (resource) => resource[state.get('entityKey')]
          )
        );

    case actions.EDIT_RESOURCE_REQUEST:
      return state.set('updateResourceSubmitting', true);

    case actions.EDIT_RESOURCE_SUCCESS:
      return state
        .set('updateResourceSubmitting', false)
        .set('pagination', Map({}))
        .set('entities', OrderedMap({}))
        .set('entityLoaded', Map({}))
        .set('entityLoading', Map({}))
        .setIn(
          ['fullEntities', action.payload.data.id],
          EntityRecord(action.payload.data)
        );

    case actions.EDIT_RESOURCE_ERROR:
      newState = state.set('updateResourceSubmitting', false);

      if (action && action.payload) {
        newState = newState.set('updateResourceErrors', Map(action.payload));
      }

      return newState;

    case actions.CLEAN_RESOURCES:
      return state
        .set('pagination', Map({}))
        .set('entities', OrderedMap({}))
        .set('entityLoaded', Map({}))
        .set('entityLoading', Map({}))
        .set('fullEntities', Map({}))
        .set('fullEntitiesLoaded', Map({}))
        .set('fullEntitiesLoading', Map({}));

    case actions.CATCH_RESOURCE_IS_DELETED:
      return state
        .update('isDeleted', (isDeleted) => [...isDeleted, action.payload])
        .setIn(['fullEntitiesLoaded', action.payload], true)
        .setIn(['fullEntitiesLoading', action.payload], false);

    default:
      return state;
  }
};

export default resourceReducer;
