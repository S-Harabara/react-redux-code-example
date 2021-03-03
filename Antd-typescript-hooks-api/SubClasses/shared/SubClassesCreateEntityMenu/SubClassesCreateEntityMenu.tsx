import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Menu, Popover } from 'antd';
import { Link } from 'react-router-dom';
import { CaretDownOutlined, PlusOutlined } from '@ant-design/icons';
import FrameLoader from '../../../../../../components/loaders/FrameLoader';
import { ClassType, Type } from '../../types';
import { getSubClassesByType } from '../../utils';
import useSubClassesList from '../../hooks/useSubClassesList';
import './SubClassesCreateEntityMenu.scss';

type Props = {
  classes: Array<ClassType>;
  type: Type;
  label: JSX.Element | string;
  link: string;
};

const SubClassesCreateEntityMenu: React.FC<Props> = (props) => {
  const { classes, type, label, link } = props;

  const { subClasses, loaded } = useSubClassesList(type);

  const menu = (
    <div className="subclass-create-menu">
      <FrameLoader loading={!loaded}>
        <div className="subclass-create-menu__frame">
          {classes.map((classGroup) => {
            const items = getSubClassesByType(subClasses, classGroup);

            return (
              <div className="subclass-create-menu__group" key={classGroup}>
                <Menu style={{ width: '250px' }} className="ant-menu-small">
                  <Menu.Item key="class">
                    <Link to={`${link}?type=${classGroup}`}>
                      <FormattedMessage
                        id={`groups.settings.class.${classGroup}`}
                      />
                    </Link>
                  </Menu.Item>
                  {items.map((item) => {
                    return (
                      <Menu.Item key={item.id}>
                        <Link
                          to={`${link}?type=${classGroup}&subclass=${item.id}`}
                        >
                          {item.title}
                        </Link>
                      </Menu.Item>
                    );
                  })}
                </Menu>
              </div>
            );
          })}
        </div>
      </FrameLoader>
    </div>
  );

  return (
    <Popover trigger="click" content={menu} placement="bottomRight" key="add">
      <Button size="middle" shape="round" className="ant-btn-secondary">
        <PlusOutlined />
        {label}
        <CaretDownOutlined />
      </Button>
    </Popover>
  );
};

export default SubClassesCreateEntityMenu;
