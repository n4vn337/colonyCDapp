import React, { FC } from 'react';
import { useSearchParams } from 'react-router-dom';

import ActionFormRow from '~v5/common/ActionFormRow';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { formatText } from '~utils/intl';

import { useColonyContext } from '~hooks';
import { TX_SEARCH_PARAM } from '~routes';
import { ActionFormBaseProps } from '../../../types';
import { useDecisionMethods } from '../../../hooks';
import DescriptionRow from '../../DescriptionRow';
import { useUnlockToken } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.UnlockTokenForm';

const UnlockTokenForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();
  const { colony } = useColonyContext();
  const isNativeTokenUnlocked = !!colony?.status?.nativeToken?.unlocked;
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get(TX_SEARCH_PARAM);

  useUnlockToken(getFormOptions);

  return isNativeTokenUnlocked && !transactionId ? null : (
    <>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.decisionMethod',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.decisionMethod' })}
      >
        <FormCardSelect
          name="decisionMethod"
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.createdIn',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.createdIn' })}
      >
        <TeamsSelect name="createdIn" readonly />
      </ActionFormRow>
      <DescriptionRow />
    </>
  );
};

UnlockTokenForm.displayName = displayName;

export default UnlockTokenForm;
