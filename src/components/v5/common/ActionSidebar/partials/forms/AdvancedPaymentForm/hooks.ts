import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';
import { array, InferType, number, object, string } from 'yup';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions';
import { formatText } from '~utils/intl';
import { toFinite } from '~utils/lodash';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const validationSchema = useMemo(
    () =>
      object()
        .shape({
          from: number().required(),
          decisionMethod: string().defined(),
          createdIn: number().defined(),
          payments: array()
            .of(
              object()
                .shape({
                  recipient: string().required(),
                  amount: object()
                    .shape({
                      amount: number()
                        .required()
                        .transform((value) => toFinite(value))
                        .moreThan(0, () =>
                          formatText({ id: 'errors.amount.greaterThanZero' }),
                        )
                        .test(
                          'enough-tokens',
                          ({ path }) =>
                            formatText(
                              { id: 'errors.amount.notEnoughTokensIn' },
                              {
                                path,
                              },
                            ),
                          (value, context) =>
                            hasEnoughFundsValidation(
                              value,
                              context,
                              selectedTeam,
                              colony,
                            ),
                        ),
                      tokenAddress: string().address().required(),
                    })
                    .required(),
                  delay: number().moreThan(0).required(),
                })
                .required(),
            )
            .required(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, selectedTeam],
  );

  return validationSchema;
};

export type AdvancedPaymentFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useAdvancedPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const {
    colony: { nativeToken },
  } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const validationSchema = useValidationSchema();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<AdvancedPaymentFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        payments: [
          {
            delay: 0,
            amount: {
              amount: 0,
              tokenAddress: nativeToken.tokenAddress,
            },
          },
        ],
      }),
      [nativeToken.tokenAddress],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EXPENDITURE_PAYMENT
        : ActionTypes.MOTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    transform: mapPayload((payload: AdvancedPaymentFormValues) => {
      // @TODO: Add a helper function mapping form values to action payload
      return payload;
    }),
  });
};
