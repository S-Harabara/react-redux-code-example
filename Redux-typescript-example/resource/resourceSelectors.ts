import queryString from 'query-string';
import { ErrorType, ReducerStateType } from './types';
import { ReduxState } from '../types';

const resourceStateSelector = (
  resourceName: string,
  state: ReduxState
): ReducerStateType => {
  return state.resources[resourceName];
};

export const pageSelector = (resourceName: string) => (
  state: ReduxState
): number | null => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('page');
};

export const resourceRoueSelector = (resourceName: string) => (
  state: ReduxState
): string => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('route');
};

export const queryFilterSelector = (resourceName: string) => (
  state: ReduxState
): { [key: string]: string | number | null } | undefined => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('queryFilter');
};

export const defaultSortSelector = (resourceName: string) => (
  state: ReduxState
): { defaultSort: string; defaultSortOrder: string } => {
  const resourceState = resourceStateSelector(resourceName, state);
  return {
    defaultSort: resourceState.get('defaultSort'),
    defaultSortOrder: resourceState.get('defaultSortOrder'),
  };
};

export const limitSelector = (resourceName: string) => (
  state: ReduxState
): number => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('limit');
};

export const paginationSelector = (resourceName: string): any => (
  state: ReduxState
) => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('pagination');
};

export const baseUrlSelector = (resourceName: string) => (
  state: ReduxState
): string => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('baseUrl');
};

export const pathUrlSelector = (resourceName: string) => (
  state: ReduxState
): string => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('path');
};

export const searchSelector = (state: ReduxState): string => {
  return state.router.location.search;
};

export const searchStringSelector = (state: ReduxState): string => {
  return state.router.location.search;
};

export const paramsSelector = (state: ReduxState) => {
  return queryString.parse(state.router.location.search);
};

export const entitiesSelector = (resourceName: string) => (
  state: ReduxState,
  entityKeys: Array<number>
): Array<any> => {
  const resourceState = resourceStateSelector(resourceName, state);

  const entityKey = resourceState.get('entityKey');

  return resourceState
    .get('entities')
    .filter(
      (entity: any) =>
        entityKeys && entityKeys.indexOf(entity[entityKey]) !== -1
    )
    .valueSeq()
    .toArray();
};

export const entitySelector = (
  resourceName: string,
  state: ReduxState,
  id: number
) => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.getIn(['fullEntities', id]);
};

export const entityLoadedSelector = (
  resourceName: string,
  state: ReduxState,
  id: number
) => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.getIn(['fullEntitiesLoaded', id]);
};

export const entityLoadingSelector = (
  resourceName: string,
  state: ReduxState,
  id: number
) => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.getIn(['fullEntitiesLoading', id]);
};

export const selectSingleName = (resourceName: string) => (
  state: ReduxState
): string => {
  const resourceState = resourceStateSelector(resourceName, state);
  return resourceState.get('singleName');
};

export const errorSelector = (
  resourceName: string,
  errorType: 'createResourceErrors' | 'updateResourceErrors'
) => (state: ReduxState): ErrorType => {
  const resourceState = resourceStateSelector(resourceName, state);

  return resourceState.get(errorType);
};

export const entityIsDeletedSelector = (
  resourceName: string,
  state: ReduxState,
  id: number
): boolean => {
  const resourceState = resourceStateSelector(resourceName, state);
  return !!resourceState.get('isDeleted').find((el) => el === id);
};

export const resourceFetchParamsSelector = (resourceName: string) => (
  state: ReduxState
): {
  [key: string]: string | number | null;
} => {
  const limit: number = limitSelector(resourceName)(state);

  const queryFilter = queryFilterSelector(resourceName)(state);

  const { defaultSortOrder, defaultSort } = defaultSortSelector(resourceName)(
    state
  );

  const { sort, sortOrder, ...restParams } = paramsSelector(state);

  const page: number | null = pageSelector(resourceName)(state);

  const currentSort = sort
    ? `${sortOrder === 'ascend' ? '-' : ''}${sort}`
    : `${defaultSortOrder === 'ascend' ? '-' : ''}${defaultSort}`;

  return {
    perPage: limit,
    sort: currentSort,
    page,
    ...queryFilter,
    ...restParams,
  };
};
