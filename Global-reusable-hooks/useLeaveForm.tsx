import { useFormikContext } from 'formik';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useConfirmCancel } from './useConfirm';

const useLeaveForm = (disabled?: boolean): void => {
  const formik = useFormikContext();
  const onConfirm = useConfirmCancel();
  const currentLocation = useLocation();
  const history = useHistory();

  useEffect(
    () => {
      const unblock = history.block((location) => {
        if (
          !disabled &&
          currentLocation.pathname !== location.pathname &&
          formik.dirty &&
          !formik.isSubmitting
        ) {
          onConfirm(() => {
            unblock();
            history.push(location.pathname);
          });
          return false;
        }
      });

      return (): void => {
        unblock();
      };
    },
    // eslint-disable-next-line
    [formik.dirty, formik.isSubmitting]
  );
};

export default useLeaveForm;
