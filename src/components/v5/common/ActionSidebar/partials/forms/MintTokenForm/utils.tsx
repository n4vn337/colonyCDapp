import moveDecimal from 'move-decimal-point';
import { DeepPartial } from 'utility-types';
import { BigNumber } from 'ethers';

import { ColonyActionType } from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { formatText } from '~utils/intl';
import { Colony } from '~types';
import { RootMotionMethodNames } from '~redux';

import { MintTokenFormValues } from './consts';

export const mintTokenDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<MintTokenFormValues>
> = async ({ amount, decisionMethod }, { getActionTitleValues, colony }) => {
  return getActionTitleValues(
    {
      token: amount?.amount ? colony?.nativeToken : undefined,
      type:
        decisionMethod === DecisionMethod.Permissions
          ? ColonyActionType.MintTokens
          : ColonyActionType.MintTokensMotion,
      amount: amount?.amount
        ? moveDecimal(
            amount.amount.toString(),
            getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
          )
        : undefined,
    },
    {
      [ActionTitleMessageKeys.Amount]: '',
      [ActionTitleMessageKeys.TokenSymbol]: formatText({
        id: 'actionSidebar.metadataDescription.nativeTokens',
      }),
    },
  );
};

export const getMintTokenDialogPayload = (
  colony: Colony,
  values: MintTokenFormValues,
) => {
  const {
    amount: { amount: inputAmount },
    description: annotationMessage,
    title,
  } = values;

  const amount = BigNumber.from(
    moveDecimal(
      inputAmount,
      getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
    ),
  );

  return {
    operationName: RootMotionMethodNames.MintTokens,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    nativeTokenAddress: colony.nativeToken.tokenAddress,
    motionParams: [amount],
    amount,
    annotationMessage,
    customActionTitle: title,
  };
};
