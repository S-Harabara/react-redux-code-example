import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { ParsedQuery } from 'query-string';
import { ChildType } from '../components/Tabs/TabsItem';

const useTabValidatePath = (
  params: ParsedQuery,
  childElements: ReactNode,
  activeTab: string | string[] | null,
  pathname: string
): void => {
  const history = useHistory();

  // Redirect to first tab if tab is not exist
  if (
    params.tab &&
    childElements &&
    Array.isArray(childElements) &&
    childElements.every(
      (child) =>
        React.isValidElement<ChildType & React.ReactElement>(child) &&
        child &&
        child.key !== activeTab
    )
  ) {
    history.push(
      `${pathname}?tab=${
        React.isValidElement<ChildType & React.ReactElement>(childElements[0])
          ? childElements[0].key
          : ''
      }`
    );
  }
};

export default useTabValidatePath;
