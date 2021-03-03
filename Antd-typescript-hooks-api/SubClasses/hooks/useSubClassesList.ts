import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import { SubclassType, Type } from '../types';
import { getSubClassesList } from '../api';

const useSubClassesList = (
  type: Type
): {
  subClasses: Array<SubclassType>;
  loaded: boolean;
  setSubClasses: (state: Array<SubclassType>) => void;
} => {
  const [loaded, setLoaded] = useState(false);
  const [subClasses, setSubClasses] = useState<Array<SubclassType>>([]);
  const intl = useIntl();
  const errorMessage = intl.formatMessage({ id: 'groups.settings.load.error' });

  useEffect(() => {
    let isMounted = true;

    getSubClassesList(type)
      .then((result) => {
        if (isMounted) {
          setSubClasses(result);
        }
      })
      .catch(() => {
        message.error(errorMessage);
      })
      .finally(() => {
        setLoaded(true);
      });

    return (): void => {
      isMounted = false;
    };
  }, [type, errorMessage]);

  return { subClasses, loaded, setSubClasses };
};

export default useSubClassesList;
