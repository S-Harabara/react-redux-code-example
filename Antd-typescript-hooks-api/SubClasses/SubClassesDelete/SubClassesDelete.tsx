import React from 'react';
import { Button } from 'antd';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { SubclassType, Type } from '../types';
import { ReactComponent as DeleteIcon } from '../../../../../assets/svg/delete.svg';
import { useConfirmDelete } from '../../../../../hooks/useConfirm';
import { deleteSubClass } from '../api';
import { cleanResources } from '../../../../../redux/resource/resourceAction';

type Props = {
  item: SubclassType;
  type: Type;
  onDeleted: (id: number) => void;
};

const SubClassesDelete: React.FC<Props> = (props) => {
  const { item, type, onDeleted } = props;
  const onConfirm = useConfirmDelete();
  const intl = useIntl();

  const message = intl.formatMessage(
    {
      id: `groups.settings.${type}.delete.confirm`,
    },
    { type: item.title }
  );

  const dispatch = useDispatch();

  return (
    <Button
      type="link"
      htmlType="button"
      onClick={(): void => {
        onConfirm((): void => {
          deleteSubClass(item.id).then(() => {
            onDeleted(item.id);
            if (type === 'vehicles') {
              dispatch(cleanResources('vehicles')());
            } else {
              dispatch(cleanResources('equipments')());
            }
          });
        }, message);
      }}
    >
      <DeleteIcon />
    </Button>
  );
};

export default SubClassesDelete;
