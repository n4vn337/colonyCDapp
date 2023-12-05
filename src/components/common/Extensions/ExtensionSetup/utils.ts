import { object } from 'yup';

import { ExtensionInitParam } from '~types';

export const createExtensionSetupInitialValues = (
  initializationParams: ExtensionInitParam[],
) => {
  return initializationParams.reduce((initialValues, param) => {
    return {
      ...initialValues,
      [param.paramName]: param.defaultValue,
    };
  }, {});
};

export const createExtensionSetupValidationSchema = (
  initializationParams: ExtensionInitParam[],
) => {
  const validationFields = initializationParams.reduce((fields, param) => {
    return {
      ...fields,
      [param.paramName]: param.validation,
    };
  }, {});
  return object().shape(validationFields).defined();
};

export const mapExtensionActionPayload = (
  payload: Record<string, any>,
  initializationParams?: ExtensionInitParam[],
) => {
  return initializationParams?.reduce(
    (formattedPayload, { paramName, transformValue, defaultValue }) => {
      const value = paramName in payload ? payload[paramName] : defaultValue;
      const paramValue = transformValue ? transformValue(value) : value;
      return {
        ...formattedPayload,
        [paramName]: paramValue,
      };
    },
    {},
  );
};
