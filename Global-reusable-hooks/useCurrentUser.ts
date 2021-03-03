import { useSelector } from 'react-redux';
import { userSelector } from '../redux/auth/authSelectors';
import { CurrentUser } from '../redux/auth/types';

const useCurrentUser = (): CurrentUser => {
  const user = useSelector(userSelector)!;

  return user;
};

export default useCurrentUser;
