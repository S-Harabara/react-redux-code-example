import useCurrentUser from './useCurrentUser';

const useIsSuperAdmin = (): boolean => {
  const user = useCurrentUser();
  const { roles } = user.relations;

  return !!(
    roles &&
    roles.find((role) => {
      return role.name === 'super admin';
    })
  );
};

export default useIsSuperAdmin;
