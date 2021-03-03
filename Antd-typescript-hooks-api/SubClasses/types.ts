export type Type = 'vehicles' | 'equipment';

export type ClassType = 'agro' | 'transport' | 'other' | 'special';

export type ClassesTypes = Array<ClassType>;

export type FormValues = {
  title: string | null;
  class: ClassType | null;
};

export type CreateSubclassValuesType = {
  title: string;
  type: Type;
  class: ClassType;
};

export type SubclassesListResponseType = {
  data: {
    subclasses: Array<SubclassType>;
  };
  success: boolean;
};

export type SubclassResponseType = {
  data: {
    subclass: SubclassType;
  };
  success: boolean;
};

export type SubclassType = {
  class: ClassType;
  id: number;
  title: string;
  type: string;
};

export type SubclassesCreateResponseType = {
  data: {
    subclass: SubclassType;
  };
  success: true;
};

export type SubclassesUpdateResponseType = {
  data: {
    subclass: SubclassType;
  };
  success: boolean;
};

export type SubclassesDeleteResponseType = {
  data: {
    deleted: boolean;
  };
  success: boolean;
};
