import { ClassType, SubclassType } from './types';

export const getSubClassesByType = (
  subClasses: Array<SubclassType>,
  classGroup: ClassType
): Array<SubclassType> => {
  return subClasses.filter((subClass) => subClass.class === classGroup);
};
