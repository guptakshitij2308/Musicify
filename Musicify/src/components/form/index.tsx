import {ReactNode} from 'react';
import {Formik, FormikHelpers} from 'formik';

interface Props<T> {
  initialValues?: T;
  validationSchema?: any;
  onSubmit: (values: T, formikHelpers: FormikHelpers<any>) => void;
  children: ReactNode;
}

const Form = <T extends object>(props: Props<T>) => {
  return (
    <Formik
      initialValues={props.initialValues || ({} as T)}
      onSubmit={props.onSubmit}
      validationSchema={props.validationSchema}>
      {props.children}
    </Formik>
  );
};

export default Form;
