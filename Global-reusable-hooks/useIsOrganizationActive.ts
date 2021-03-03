import useCurrentUser from './useCurrentUser';

const useIsOrganizationActive = (): boolean => {
  const user = useCurrentUser();

  return user.relations.organization.isActive;
};

export default useIsOrganizationActive;
