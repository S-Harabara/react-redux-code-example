import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Type, ClassesTypes, SubclassType } from './types';
import SubClassesAdd from './SubClassesAdd';
import SubClassesDelete from './SubClassesDelete';
import ContentFrame from '../../../../components/sections/ContentFrame';
import FrameLoader from '../../../../components/loaders/FrameLoader';
import useHasPermission from '../../../../hooks/useHasPermission';
import SubClassesEdit from './SubClassesEdit';
import useSubClassesList from './hooks/useSubClassesList';
import { getSubClassesByType } from './utils';
import './SubClasses.scss';

type Props = {
  type: Type;
  classes: ClassesTypes;
};

const SubClasses: React.FC<Props> = (props) => {
  const { type, classes } = props;
  const hasPermission = useHasPermission();

  const { subClasses, setSubClasses, loaded } = useSubClassesList(type);

  const onAdd = (item: SubclassType): void => {
    setSubClasses(subClasses.concat([item]));
  };

  const onUpdate = (newItem: SubclassType): void => {
    setSubClasses(
      subClasses.map((item) => {
        if (item.id === newItem.id) {
          return newItem;
        }
        return item;
      })
    );
  };

  const onDeleted = (id: number): void => {
    setSubClasses(subClasses.filter((item) => item.id !== id));
  };

  return (
    <ContentFrame>
      <FrameLoader loading={!loaded}>
        <div className="settings-subclasses">
          <div className="settings-subclasses__header">
            <div className="settings-subclasses__title">
              <FormattedMessage id={`groups.settings.${type}.title`} />
            </div>
            {hasPermission('subclasses.update.any') && (
              <div className="settings-subclasses__add">
                <SubClassesAdd type={type} classes={classes} onAdd={onAdd} />
              </div>
            )}
          </div>
          <div className="settings-subclasses__body">
            {classes.map((classGroup) => {
              const items = getSubClassesByType(subClasses, classGroup);

              return (
                <div className="settings-subclasses__group" key={classGroup}>
                  <h2
                    className={`settings-subclasses__group-title ${
                      items.length === 0
                        ? 'settings-subclasses__group-title--empty'
                        : ''
                    }`}
                  >
                    <FormattedMessage
                      id={`groups.settings.class.${classGroup}`}
                    />
                    {` (${items.length}) `}
                  </h2>
                  {items.length > 0 ? (
                    <ul className="settings-subclasses__group-list">
                      {items.map((item) => {
                        return (
                          <li
                            key={item.id}
                            className="settings-subclasses__group-list-item"
                          >
                            {item.title}
                            {hasPermission('subclasses.update.any') && (
                              <div className="settings-subclasses__group-list-actions">
                                <SubClassesEdit
                                  onUpdate={onUpdate}
                                  type={type}
                                  item={item}
                                  classes={classes}
                                />
                                <i className="settings-subclasses__actions-separator" />
                                <SubClassesDelete
                                  item={item}
                                  type={type}
                                  onDeleted={onDeleted}
                                />
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </FrameLoader>
    </ContentFrame>
  );
};

export default SubClasses;
