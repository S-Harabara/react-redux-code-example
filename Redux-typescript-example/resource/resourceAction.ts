import { ErrorType, ResourceActionTypes, SortOrder } from './types';

export const REGISTER_RESOURCE = 'REGISTER_RESOURCE';

export const CLEAN_RESOURCES = 'CLEAN_RESOURCE';

export const FETCH_RESOURCES_REQUEST = 'FETCH_RESOURCES_REQUEST';
export const FETCH_RESOURCES_SUCCESS = 'FETCH_RESOURCES_SUCCESS';
export const FETCH_RESOURCES_ERROR = 'FETCH_RESOURCES_ERROR';

export const FETCH_SINGLE_RESOURCE_REQUEST = 'FETCH_SINGLE_RESOURCE_REQUEST';
export const FETCH_SINGLE_RESOURCE_SUCCESS = 'FETCH_SINGLE_RESOURCE_SUCCESS';
export const FETCH_SINGLE_RESOURCE_ERROR = 'FETCH_SINGLE_RESOURCE_ERROR';

export const FETCH_RESOURCES_FOR_PAGE_START = 'FETCH_RESOURCES_FOR_PAGE_START';

export const CREATE_RESOURCE_REQUEST = 'CREATE_RESOURCE_REQUEST';
export const CREATE_RESOURCE_SUCCESS = 'CREATE_RESOURCE_SUCCESS';
export const CREATE_RESOURCE_ERROR = 'CREATE_RESOURCE_ERROR';

export const EDIT_RESOURCE_REQUEST = 'EDIT_RESOURCE_REQUEST';
export const EDIT_RESOURCE_SUCCESS = 'EDIT_RESOURCE_SUCCESS';
export const EDIT_RESOURCE_ERROR = 'EDIT_RESOURCE_ERROR';

export const CHANGE_PAGINATION_PAGE = 'CHANGE_PAGINATION_PAGE';
export const CHANGE_PER_PAGE = 'CHANGE_PER_PAGE';

export const DELETE_RESOURCE_REQUEST = 'DELETE_RESOURCE_REQUEST';
export const CLEAR_RESOURCE_ERRORS = 'CLEAR_RESOURCE_ERRORS';

export const SORT_BY = 'SORT_BY';

export const SEARCH_RESOURCE = 'SEARCH_RESOURCE';
export const REMOVE_SEARCH_PARAM = 'REMOVE_SEARCH_PARAM';
export const RESET_SEARCH_RESOURCE = 'RESET_SEARCH_RESOURCE';

export const CATCH_RESOURCE_IS_DELETED = 'CATCH_RESOURCE_IS_DELETED';

export const fetchResources = (resourceName: string) => (
  page: number,
  limit: number
): ResourceActionTypes => {
  return {
    type: FETCH_RESOURCES_REQUEST,
    resourceName,
    payload: { page, limit },
  };
};

export const fetchResourcesSuccess = (resourceName: string) => (data: {
  data: any[];
  total: number;
  page: number;
}): ResourceActionTypes => {
  return {
    resourceName,
    type: FETCH_RESOURCES_SUCCESS,
    payload: data,
  };
};

export const fetchResourcesError = (resourceName: string) => (
  page: number
): ResourceActionTypes => {
  return {
    resourceName,
    type: FETCH_RESOURCES_ERROR,
    payload: page,
  };
};

export const registerResource = (resourceName: string) => (
  baseUrl: string,
  singleName: string,
  path: string,
  route: string,
  entityKey: string,
  defaultSort: string,
  defaultSortOrder: SortOrder,
  queryFilter?: { [key: string]: string | number | null }
): ResourceActionTypes => {
  return {
    resourceName,
    type: REGISTER_RESOURCE,
    payload: {
      baseUrl,
      singleName,
      path,
      route,
      entityKey,
      queryFilter,
      defaultSort,
      defaultSortOrder,
    },
  };
};

export const cleanResources = (
  resourceName: string
) => (): ResourceActionTypes => {
  return {
    resourceName,
    type: CLEAN_RESOURCES,
  };
};

export const fetchResourceForPageStart = (resourceName: string) => (
  page: number,
  params: string
): ResourceActionTypes => {
  return {
    resourceName,
    type: FETCH_RESOURCES_FOR_PAGE_START,
    payload: { page, params },
  };
};

export const fetchSingleResource = (resourceName: string) => (
  id: number,
  notExist: string,
  unknownError: string
): ResourceActionTypes => {
  return {
    resourceName,
    type: FETCH_SINGLE_RESOURCE_REQUEST,
    payload: {
      id,
      message: {
        notExist,
        unknownError,
      },
    },
  };
};

export const fetchSingleResourceSuccess = (resourceName: string) => (
  data: any
): ResourceActionTypes => {
  return {
    resourceName,
    type: FETCH_SINGLE_RESOURCE_SUCCESS,
    payload: data,
  };
};

export const fetchSingleResourceError = (resourceName: string) => (
  id: number
): ResourceActionTypes => {
  return {
    resourceName,
    type: FETCH_SINGLE_RESOURCE_ERROR,
    payload: id,
  };
};

export const createResourceRequest = (resourceName: string) => (
  values: any,
  quotaExceededMsg?: string
): ResourceActionTypes => {
  return {
    resourceName,
    type: CREATE_RESOURCE_REQUEST,
    payload: {
      values,
      quotaExceededMsg,
    },
  };
};

export const createResourceSuccess = (
  resourceName: string
) => (): ResourceActionTypes => {
  return {
    resourceName,
    type: CREATE_RESOURCE_SUCCESS,
  };
};

export const createResourceError = (resourceName: string) => (
  errors?: ErrorType
): ResourceActionTypes => {
  return {
    resourceName,
    type: CREATE_RESOURCE_ERROR,
    payload: errors,
  };
};

export const updateResource = (resourceName: string) => (
  resourceData: any,
  id: number,
  successMessage: string
): ResourceActionTypes => {
  return {
    resourceName,
    type: EDIT_RESOURCE_REQUEST,
    payload: { resourceData, id, successMessage },
  };
};

export const updateResourceSuccess = (resourceName: string) => (
  data: any
): ResourceActionTypes => {
  return {
    resourceName,
    type: EDIT_RESOURCE_SUCCESS,
    payload: data,
  };
};

export const updateResourceError = (resourceName: string) => (
  error?: ErrorType
): ResourceActionTypes => {
  return {
    resourceName,
    type: EDIT_RESOURCE_ERROR,
    payload: error,
  };
};

export const changePage = (resourceName: string) => (
  page: number
): ResourceActionTypes => {
  return {
    resourceName,
    type: CHANGE_PAGINATION_PAGE,
    payload: page,
  };
};

export const changePerPage = (resourceName: string) => (
  limit: number
): ResourceActionTypes => {
  return {
    resourceName,
    type: CHANGE_PER_PAGE,
    payload: limit,
  };
};

export const deleteResource = (resourceName: string) => (
  id: number,
  successMessage: string,
  redirectLink?: string,
  customResourceName?: string
): ResourceActionTypes => {
  return {
    resourceName,
    type: DELETE_RESOURCE_REQUEST,
    payload: { id, successMessage, redirectLink, customResourceName },
  };
};

export const clearResourceErrors = (
  resourceName: string
) => (): ResourceActionTypes => {
  return {
    type: CLEAR_RESOURCE_ERRORS,
    resourceName,
  };
};

export const sortBy = (resourceName: string) => (
  sort: string,
  sortOrder: string
): ResourceActionTypes => {
  return {
    resourceName,
    type: SORT_BY,
    payload: {
      sortBy: sort,
      sortOrder,
    },
  };
};

export const searchResource = (resourceName: string) => (search: {
  [key: string]: number | string | Array<string> | null;
}): ResourceActionTypes => {
  return {
    type: SEARCH_RESOURCE,
    resourceName,
    payload: search,
  };
};

export const resetSearchResource = (resourceName: string) => (
  redirectLink?: string
): ResourceActionTypes => {
  return {
    type: RESET_SEARCH_RESOURCE,
    resourceName,
    payload: redirectLink,
  };
};

export const removeSearchParams = (resourceName: string) => (
  removeKey: string,
  removeValue: string | number
): ResourceActionTypes => {
  return {
    type: REMOVE_SEARCH_PARAM,
    resourceName,
    payload: { removeKey, removeValue },
  };
};

export const catchResourceDeleted = (resourceName: string) => (
  id: number
): ResourceActionTypes => {
  return {
    type: CATCH_RESOURCE_IS_DELETED,
    resourceName,
    payload: id,
  };
};
