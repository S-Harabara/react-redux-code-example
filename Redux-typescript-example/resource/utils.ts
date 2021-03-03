import { Record, OrderedMap } from 'immutable';
import queryString from 'query-string';
import { ReduxState } from '../types';

export function arrayToOrderedMap<T extends { [key: string]: number | string }>(
  array: Array<T>,
  DataRecord: Record.Factory<T>,
  entityKey: string
): OrderedMap<number | string, Record<T>> {
  return array.reduce((acc, item): OrderedMap<number | string, Record<T>> => {
    return acc.set(item[entityKey], DataRecord(item));
  }, OrderedMap<number | string, Record<T>>([]));
}

export const paramsToString = (params: { [key: string]: string }): string => {
  return Object.entries(params)
    .filter(([, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export const combineParams = (extendsParams: any) => (state: ReduxState) => {
  const oldParams = queryString.parse(state.router.location.search);
  return { ...oldParams, ...extendsParams };
};
