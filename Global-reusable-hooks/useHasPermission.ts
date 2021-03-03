import { useSelector } from 'react-redux';
import { permissionSelector, rolesSelector } from '../redux/auth/authSelectors';

const useHasPermission = (): ((
  permission: string | Array<string>
) => boolean) => {
  const userPermissions = useSelector(permissionSelector);
  const userRoles = useSelector(rolesSelector);

  return (permission: string | Array<string>): boolean => {
    if (
      userRoles &&
      userRoles.find((role) => {
        return role.name === 'super admin';
      })
    ) {
      return true;
    }

    if (!userPermissions) {
      return false;
    }

    if (Array.isArray(permission)) {
      return !!userPermissions.find((userPermission) => {
        return permission.indexOf(userPermission) !== -1;
      });
    }

    return !!userPermissions.find((userPermission) => {
      return userPermission === permission;
    });
  };
};

export default useHasPermission;
