import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ClassType, SubclassType } from '../../types';
import { fetchSubClass } from '../../api';

type Props = {
  id: ClassType | string;
};

const SubClassesActiveFilter: React.FC<Props> = (props) => {
  const { id } = props;
  const [subClass, setSubClass] = useState<SubclassType | null>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const intl = useIntl();
  const errorMessage = intl.formatMessage({ id: 'groups.settings.load.error' });

  useEffect(() => {
    let isMounted = true;

    if (Number(id)) {
      fetchSubClass(Number(id))
        .then((result) => {
          if (isMounted) {
            setSubClass(result);
          }
        })
        .catch(() => {
          message.error(errorMessage);
        })
        .finally(() => {
          if (isMounted) {
            setLoaded(true);
          }
        });
    } else {
      setLoaded(true);
    }

    return (): void => {
      isMounted = false;
    };
  }, [id, errorMessage]);

  return !loaded ? (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  ) : (
    <>
      {subClass ? (
        <>{subClass.title}</>
      ) : (
        <FormattedMessage id={`groups.settings.class.${id}`} />
      )}
    </>
  );
};

export default SubClassesActiveFilter;
