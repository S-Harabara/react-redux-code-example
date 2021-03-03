import React from 'react';
import * as Yup from 'yup';
import { Button } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Input, Select } from 'formik-antd';
import { Formik, FormikHelpers } from 'formik';
import FormItem from '../../../../../components/form/FormItem/FormItem';
import { ClassesTypes, FormValues, Type } from '../types';
import './SubClassesForm.scss';

type Props = {
  onCancel: () => void;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
  classes: ClassesTypes;
  disableClass?: boolean;
  initialValues: FormValues;
  type: Type;
};

const SubClassesForm: React.FC<Props> = (props) => {
  const {
    onCancel,
    onSubmit,
    classes,
    initialValues,
    disableClass,
    type,
  } = props;

  const intl = useIntl();

  return (
    <div className="settings-subclasses-form">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
        validationSchema={Yup.object().shape({
          class: disableClass
            ? Yup.string().nullable()
            : Yup.string().required('validation.required').nullable(),
          title: Yup.string()
            .max(25, 'validation.max.25.string')
            .required('validation.required')
            .nullable(),
        })}
      >
        <Form layout="vertical">
          <FormItem
            required
            name="class"
            label={
              <FormattedMessage id={`groups.settings.${type}.form.parent`} />
            }
          >
            <Select
              disabled={disableClass}
              name="class"
              placeholder={
                <FormattedMessage
                  id={`groups.settings.${type}.form.parent.placeholder`}
                />
              }
            >
              {classes.map((item) => {
                return (
                  <Select.Option value={item} key={item}>
                    <FormattedMessage id={`groups.settings.class.${item}`} />
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            required
            name="title"
            label={<FormattedMessage id="groups.settings.form.name" />}
          >
            <Input
              autoComplete="off"
              name="title"
              placeholder={intl.formatMessage({
                id: 'groups.settings.form.name.placeholder',
              })}
            />
          </FormItem>
          <div className="settings-subclasses-form__footer">
            <Button htmlType="submit" type="primary" className="ant-btn-wide">
              <FormattedMessage id="save" />
            </Button>
            <Button
              htmlType="button"
              onClick={onCancel}
              className="ant-btn-wide"
            >
              <FormattedMessage id="cancel" />
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default SubClassesForm;
