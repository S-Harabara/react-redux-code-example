import axios from '../../../../config/axios';

import {
  Type,
  SubclassesListResponseType,
  CreateSubclassValuesType,
  SubclassesCreateResponseType,
  SubclassesUpdateResponseType,
  SubclassesDeleteResponseType,
  SubclassResponseType,
  SubclassType,
} from './types';

export const getSubClassesList = async (
  type: Type
): Promise<Array<SubclassType>> => {
  const result = await axios.get<SubclassesListResponseType>(
    `/subclasses?type=${type}`
  );

  if (!result?.data?.success) {
    throw new Error();
  }

  return result.data.data.subclasses;
};

export const fetchSubClass = async (id: number): Promise<SubclassType> => {
  const result = await axios.get<SubclassResponseType>(`/subclasses/${id}`);

  if (!result?.data?.success) {
    throw new Error();
  }

  return result.data.data.subclass;
};

export const createSubClass = async (
  values: CreateSubclassValuesType
): Promise<SubclassType> => {
  const result = await axios.post<SubclassesCreateResponseType>('subclasses', {
    ...values,
  });

  if (!result.data.success) {
    throw new Error();
  }

  return result.data.data.subclass;
};

export const updateSubClass = async (
  values: CreateSubclassValuesType,
  id: number
): Promise<SubclassType> => {
  const result = await axios.put<SubclassesUpdateResponseType>(
    `subclasses/${id}`,
    {
      ...values,
    }
  );

  if (!result?.data?.success) {
    throw new Error();
  }

  return result.data.data.subclass;
};

export const deleteSubClass = async (id: number): Promise<boolean> => {
  const result = await axios.delete<SubclassesDeleteResponseType>(
    `subclasses/${id}`
  );

  if (!result?.data?.success) {
    throw new Error();
  }

  return result.data.data.deleted;
};
