import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

const scrollToError = (errors: never): void => {
  const errorKeys = Object.keys(errors);
  let elements: Array<Element> = [];

  if (errorKeys.length > 0) {
    errorKeys.forEach((name) => {
      const element = document.querySelector(`.form-field-${name}`);

      if (element && element.getBoundingClientRect().y !== 0) {
        elements.push(element);
      }
    });

    if (elements.length > 0) {
      elements = elements.sort((a, b) => {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
      });

      elements[0].scrollIntoView({ behavior: 'smooth' });
    } else {
      document.documentElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const useScrollToErrorElement = (): (() => void) => {
  const formik = useFormikContext<never>();

  if (!formik) {
    throw new Error(
      'Hook useScrollToErrorElement Must be inside formik context'
    );
  }

  const [clicked, setClicked] = useState(false);
  const { errors } = formik;

  useEffect(() => {
    if (clicked && Object.keys(errors).length > 0) {
      scrollToError(errors);
      setClicked(false);
    }
  }, [errors, clicked]);

  return (): void => {
    setClicked(true);
    scrollToError(errors);
  };
};

export default useScrollToErrorElement;
