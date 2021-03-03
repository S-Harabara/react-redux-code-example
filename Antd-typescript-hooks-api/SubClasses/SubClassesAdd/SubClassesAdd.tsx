import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Map } from 'immutable';
import FrameLoader from '../../../../../components/loaders/FrameLoader';
import { Type, ClassesTypes, SubclassType } from '../types';
import SubClassesForm from '../SubClassesForm';
import { createSubClass } from '../api';
import ErrorContext, {
  ErrorContextType,
} from '../../../../../components/form/error/ErrorContext/ErrorContext';
import { ReactComponent as CloseIcon } from '../../../../../assets/svg/closeIcon.svg';

type Props = {
  type: Type;
  classes: ClassesTypes;
  onAdd: (subClass: SubclassType) => void;
};

const SubClassesAdd: React.FC<Props> = (props) => {
  const { type, classes, onAdd } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorContextType>(Map({}));

  const onCancel = (): void => {
    setShowModal(false);
  };

  useEffect(() => {
    setErrors(Map({}));
  }, [showModal]);

  return (
    <div>
      <Button
        type="primary"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        <FormattedMessage id={`groups.settings.${type}.add`} />
      </Button>
      <Modal
        title={<FormattedMessage id={`groups.settings.${type}.modal.title`} />}
        footer={false}
        visible={showModal}
        onCancel={onCancel}
        closeIcon={<CloseIcon />}
      >
        <ErrorContext.Provider value={errors}>
          <FrameLoader loading={loading}>
            {showModal && (
              <SubClassesForm
                initialValues={{
                  title: null,
                  class: null,
                }}
                classes={classes}
                type={type}
                onCancel={onCancel}
                onSubmit={(values): void => {
                  setLoading(true);

                  createSubClass({
                    title: values.title!,
                    class: values.class!,
                    type,
                  })
                    .then((result) => {
                      onAdd(result);
                      setShowModal(false);
                    })
                    .catch((err) => {
                      setErrors(Map(err.response.data.data));
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              />
            )}
          </FrameLoader>
        </ErrorContext.Provider>
      </Modal>
    </div>
  );
};

export default SubClassesAdd;
