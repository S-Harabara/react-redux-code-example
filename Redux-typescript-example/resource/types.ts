import { Map, OrderedMap, Record } from 'immutable';
import {
  CHANGE_PAGINATION_PAGE,
  CHANGE_PER_PAGE,
  CLEAN_RESOURCES,
  CLEAR_RESOURCE_ERRORS,
  CREATE_RESOURCE_ERROR,
  CREATE_RESOURCE_REQUEST,
  CREATE_RESOURCE_SUCCESS,
  DELETE_RESOURCE_REQUEST,
  EDIT_RESOURCE_ERROR,
  EDIT_RESOURCE_REQUEST,
  EDIT_RESOURCE_SUCCESS,
  FETCH_RESOURCES_ERROR,
  FETCH_RESOURCES_FOR_PAGE_START,
  FETCH_RESOURCES_REQUEST,
  FETCH_RESOURCES_SUCCESS,
  FETCH_SINGLE_RESOURCE_ERROR,
  FETCH_SINGLE_RESOURCE_REQUEST,
  FETCH_SINGLE_RESOURCE_SUCCESS,
  REGISTER_RESOURCE,
  SORT_BY,
  SEARCH_RESOURCE,
  RESET_SEARCH_RESOURCE,
  REMOVE_SEARCH_PARAM,
  CATCH_RESOURCE_IS_DELETED,
} from './resourceAction';

export type ErrorType = Map<string, Array<string>>;

export interface ResourceReducerState {
  createResourceSubmitting: boolean;
  updateResourceSubmitting: boolean;
  entities: Map<any, any>;
  fullEntities: OrderedMap<any, any>;
  fullEntitiesLoaded: OrderedMap<any, any>;
  fullEntitiesLoading: OrderedMap<any, any>;
  pagination: Map<any, any>;
  entityLoaded: Map<any, any>;
  entityLoading: Map<any, any>;
  createResourceErrors: ErrorType;
  updateResourceErrors: ErrorType;
  limit: number;
  total: number;
  page: number | null;
  baseUrl: string;
  path: string;
  singleName: string;
  queryFilter?: { [key: string]: string | number | null };
  entityKey: string;
  params: string;
  route: string;
  registered: boolean;
  isDeleted: number[];
  defaultSort: string;
  defaultSortOrder: SortOrder;
}

export type SortOrder = 'ascend' | 'descend';

export type ReducerStateType = Record<ResourceReducerState>;

type ResourceBaseActionType = {
  resourceName: string;
};

export interface FetchResourceActionType extends ResourceBaseActionType {
  type: typeof FETCH_RESOURCES_REQUEST;
  payload: { page: number; limit: number };
}

export interface FetchResourcesSuccessActionType
  extends ResourceBaseActionType {
  type: typeof FETCH_RESOURCES_SUCCESS;
  payload: {
    data: any[];
    total: number;
    page: number;
  };
}

export interface FetchResourcesErrorType extends ResourceBaseActionType {
  type: typeof FETCH_RESOURCES_ERROR;
  payload: number;
}

export interface RegisterResourceType extends ResourceBaseActionType {
  type: typeof REGISTER_RESOURCE;
  payload: {
    baseUrl: string;
    singleName: string;
    path: string;
    route: string;
    entityKey: string;
    defaultSort: string;
    defaultSortOrder: SortOrder;
    queryFilter?: { [key: string]: string | number | null };
  };
}

export interface CleanResourcesType extends ResourceBaseActionType {
  type: typeof CLEAN_RESOURCES;
}

export interface FetchResourceForPageStartType extends ResourceBaseActionType {
  type: typeof FETCH_RESOURCES_FOR_PAGE_START;
  payload: { page: number; params: string };
}

export interface FetchSingleResourceType extends ResourceBaseActionType {
  type: typeof FETCH_SINGLE_RESOURCE_REQUEST;
  payload: {
    id: number;
    message: {
      notExist: string;
      unknownError: string;
    };
  };
}

export interface FetchSingleResourceSuccessType extends ResourceBaseActionType {
  type: typeof FETCH_SINGLE_RESOURCE_SUCCESS;
  payload: any;
}

export interface FetchSingleResourceError extends ResourceBaseActionType {
  type: typeof FETCH_SINGLE_RESOURCE_ERROR;
  payload: number;
}

export interface CreateResourceRequestType extends ResourceBaseActionType {
  type: typeof CREATE_RESOURCE_REQUEST;
  payload: {
    values: any;
    quotaExceededMsg?: string;
  };
}

export interface CreateResourceSuccessType extends ResourceBaseActionType {
  type: typeof CREATE_RESOURCE_SUCCESS;
}

export interface CreateResourceErrorType extends ResourceBaseActionType {
  type: typeof CREATE_RESOURCE_ERROR;
  payload?: ErrorType;
}

export interface UpdateResourceType extends ResourceBaseActionType {
  type: typeof EDIT_RESOURCE_REQUEST;
  payload: {
    resourceData: any;
    id: number;
    successMessage: string;
  };
}

export interface UpdateResourceSuccessType extends ResourceBaseActionType {
  type: typeof EDIT_RESOURCE_SUCCESS;
  payload: any;
}

export interface UpdateResourceErrorType extends ResourceBaseActionType {
  type: typeof EDIT_RESOURCE_ERROR;
  payload?: ErrorType;
}

export interface ChangePageType extends ResourceBaseActionType {
  type: typeof CHANGE_PAGINATION_PAGE;
  payload: number;
}

export interface ChangePerPageType extends ResourceBaseActionType {
  type: typeof CHANGE_PER_PAGE;
  payload: number;
}

export interface DeleteResourceType extends ResourceBaseActionType {
  type: typeof DELETE_RESOURCE_REQUEST;
  payload: {
    id: number;
    successMessage: string;
    redirectLink?: string;
    customResourceName?: string;
  };
}

export interface ClearResourceErrorsType extends ResourceBaseActionType {
  type: typeof CLEAR_RESOURCE_ERRORS;
}

export interface SortByType extends ResourceBaseActionType {
  type: typeof SORT_BY;
  payload: {
    sortBy: string;
    sortOrder: string;
  };
}

export interface SearchResourceType extends ResourceBaseActionType {
  type: typeof SEARCH_RESOURCE;
  payload: {
    [key: string]: number | string | Array<string> | null;
  };
}

export interface ResetSearchResourceType extends ResourceBaseActionType {
  type: typeof RESET_SEARCH_RESOURCE;
  payload: string | undefined;
}

export interface RemoveSearchParamsType extends ResourceBaseActionType {
  type: typeof REMOVE_SEARCH_PARAM;
  payload: { removeKey: string; removeValue: string | number };
}

export interface CatchResourceDeleted extends ResourceBaseActionType {
  type: typeof CATCH_RESOURCE_IS_DELETED;
  payload: number;
}

export type ResourceActionTypes =
  | FetchSingleResourceType
  | FetchSingleResourceError
  | FetchSingleResourceSuccessType
  | FetchResourceActionType
  | FetchResourcesSuccessActionType
  | RegisterResourceType
  | CleanResourcesType
  | UpdateResourceSuccessType
  | UpdateResourceType
  | ChangePageType
  | ChangePerPageType
  | UpdateResourceErrorType
  | FetchResourceForPageStartType
  | ClearResourceErrorsType
  | DeleteResourceType
  | CreateResourceErrorType
  | CreateResourceRequestType
  | CreateResourceSuccessType
  | SortByType
  | SearchResourceType
  | ResetSearchResourceType
  | FetchResourcesErrorType
  | RemoveSearchParamsType
  | CatchResourceDeleted;
