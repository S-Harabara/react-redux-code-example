import React, { useState } from 'react';
import { Map } from 'immutable';
import { FormattedMessage } from 'react-intl';
import { Modal, Button } from 'antd';
import FrameLoader from '../../../../../components/loaders/FrameLoader';
import { ReactComponent as EditIcon } from '../../../../../assets/svg/edit.svg';
import { ClassesTypes, SubclassType, Type } from '../types';
import SubClassesForm from '../SubClassesForm';
import { updateSubClass } from '../api';
import ErrorContext, {
  ErrorContextType,
} from '../../../../../components/form/error/ErrorContext/ErrorContext';
import { ReactComponent as CloseIcon } from '../../../../../assets/svg/closeIcon.svg';

type Props = {
  item: SubclassType;
  classes: ClassesTypes;
  type: Type;
  onUpdate: (newItem: SubclassType) => void;
};

const SubClassesEdit: React.FC<Props> = (props) => {
  const { item, classes, type, onUpdate } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorContextType>(Map({}));

  const onCancel = (): void => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        htmlType="button"
        type="link"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        <EditIcon />
      </Button>
      <Modal
        footer={false}
        title={
          <FormattedMessage id={`groups.settings.${type}.modal.edit.title`} />
        }
        visible={showModal}
        onCancel={onCancel}
        closeIcon={<CloseIcon />}
      >
        <ErrorContext.Provider value={errors}>
          <FrameLoader loading={loading}>
            {showModal && (
              <SubClassesForm
                classes={classes}
                onCancel={onCancel}
                type={type}
                disableClass
                onSubmit={(values): void => {
                  setLoading(true);

                  updateSubClass(
                    {
                      title: values.title!,
                      class: values.class!,
                      type,
                    },
                    item.id
                  )
                    .then((updatedItem) => {
                      onUpdate(updatedItem);
                      setShowModal(false);
                    })
                    .catch((err) => {
                      setErrors(Map(err.response.data.data));
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
                initialValues={{
                  title: item.title,
                  class: item.class,
                }}
              />
            )}
          </FrameLoader>
        </ErrorContext.Provider>
      </Modal>
    </>
  );
};

export default SubClassesEdit;
