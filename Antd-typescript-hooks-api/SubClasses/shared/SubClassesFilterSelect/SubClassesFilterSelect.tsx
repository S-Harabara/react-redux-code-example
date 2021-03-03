import React from 'react';
import { Select } from 'formik-antd';
import { useIntl } from 'react-intl';
import { ClassesTypes, Type } from '../../types';
import FormItem from '../../../../../../components/form/FormItem/FormItem';
import useSubClassesList from '../../hooks/useSubClassesList';
import { getSubClassesByType } from '../../utils';

type Props = {
  classes: ClassesTypes;
  type: Type;
  label: string | JSX.Element;
  placeholder: string | JSX.Element;
  name: string;
};

const SubClassesFilterSelect: React.FC<Props> = (props) => {
  const { type, label, classes, placeholder, name } = props;
  const intl = useIntl();

  const { subClasses, loaded } = useSubClassesList(type);

  return (
    <FormItem name={name} label={label} fast={false}>
      <Select
        allowClear
        loading={!loaded}
        name={name}
        virtual={false}
        mode="multiple"
        placeholder={placeholder}
        optionFilterProp="children"
      >
        {classes.map((classGroup) => {
          const items = getSubClassesByType(subClasses, classGroup);

          return [
            <Select.Option key={classGroup} value={classGroup}>
              {intl.formatMessage({
                id: `groups.settings.class.${classGroup}`,
              })}
            </Select.Option>,
          ].concat(
            items.map((item) => (
              <Select.Option key={item.id} value={String(item.id)}>
                {item.title}
              </Select.Option>
            ))
          );
        })}
      </Select>
    </FormItem>
  );
};

export default SubClassesFilterSelect;
