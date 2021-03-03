import { Modal, Typography } from 'antd';
import Icon from '@ant-design/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import { ReactComponent as DeleteIcon } from '../assets/svg/delete-lg.svg';
import { ReactComponent as Attention } from '../assets/svg/attention.svg';

export const confirmModal = ({
  onConfirm,
  message,
  title,
  okText,
  cancelText,
  icon,
}: any) =>
  Modal.confirm({
    content: (
      <ConfirmModal>
        <Icon
          component={icon}
          style={{ fontSize: '133px', marginTop: '-34px' }}
        />
        <Typography.Title level={2}>{title}</Typography.Title>
        <div>{message}</div>
      </ConfirmModal>
    ),
    onOk() {
      onConfirm();
    },
    okText,
    cancelText,
    okButtonProps: {
      size: 'middle',
      className: 'ant-btn-wide',
      style: { minWidth: '110px' },
    },
    cancelButtonProps: { size: 'middle', className: 'ant-btn-wide' },
    width: 614,
    autoFocusButton: null,
    onCancel() {},
    zIndex: 1050,
  });

export const useConfirmDelete = () => {
  const intl = useIntl();

  return (onConfirm: any, message: string) => {
    confirmModal({
      onConfirm,
      message,
      title: intl.formatMessage({ id: 'confirm.delete' }),
      okText: intl.formatMessage({ id: 'confirm.delete.ok' }),
      cancelText: intl.formatMessage({ id: 'confirm.cancel' }),
      icon: DeleteIcon,
    });
  };
};

export const useConfirmCancel = () => {
  const intl = useIntl();

  return (onConfirm: any) => {
    confirmModal({
      onConfirm,
      message: intl.formatMessage({ id: 'confirm.cancelForm.message' }),
      title: intl.formatMessage({ id: 'confirm.cancelForm' }),
      okText: intl.formatMessage({ id: 'confirm.cancelForm.ok' }),
      cancelText: intl.formatMessage({ id: 'confirm.cancel' }),
      icon: Attention,
    });
  };
};
