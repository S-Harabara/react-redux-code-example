import React, { useMemo } from 'react';
import { Select } from 'antd';
import { useFormikContext } from 'formik';
import { useIntl } from 'react-intl';
import { ClassType, Type } from '../../types';
import FormItem from '../../../../../../components/form/FormItem/FormItem';
import useSubClassesList from '../../hooks/useSubClassesList';
import { getSubClassesByType } from '../../utils';

type Props = {
  type: Type;
  label: string | JSX.Element;
};

const SubClassesEntitySelect: React.FC<Props> = (props) => {
  const { type, label } = props;
  const intl = useIntl();

  const { subClasses, loaded } = useSubClassesList(type);

  const { values, setFieldValue } = useFormikContext<{
    class: ClassType;
    subclassId: number | null;
  }>();

  const { class: classValue, subclassId } = values;

  const value = subclassId || '-1';

  const mainClass = intl.formatMessage({
    id: `groups.settings.class.${classValue}`,
  });

  return useMemo(() => {
    const onChange = (newValue: number | string | undefined): void => {
      if (newValue === '-1' || !newValue) {
        setFieldValue('subclassId', null);
      } else if (typeof newValue === 'number') {
        setFieldValue('subclassId', newValue);
      }
    };

    return (
      <FormItem name="class" label={label} required fast={false}>
        <Select
          loading={!loaded}
          value={value}
          onChange={onChange}
          virtual={false}
          optionFilterProp="children"
          showSearch
        >
          <Select.Option key="-1" value="-1">
            {mainClass}
          </Select.Option>

          {getSubClassesByType(subClasses, classValue).map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </FormItem>
    );
  }, [subClasses, loaded, value, classValue, mainClass, label, setFieldValue]);
};

export default SubClassesEntitySelect;
