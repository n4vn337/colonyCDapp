import React, { FC } from 'react';

import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';

import { useDecisionMethods } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';
import BatchPaymentsTable from '../../BatchPaymentsTable';

const displayName = 'v5.common.ActionSidebar.partials.BatchPaymentForm';

const BatchPaymentForm: FC<ActionFormBaseProps> = () => {
  const { decisionMethods } = useDecisionMethods();

  return (
    <>
      <ActionFormRow
        icon="users-three"
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
      >
        <TeamsSelect name="from" />
      </ActionFormRow>
      <ActionFormRow
        icon="scales"
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
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          options={decisionMethods}
          title={formatText({ id: 'actionSidebar.availableDecisions' })}
        />
      </ActionFormRow>
      <ActionFormRow
        icon="house-line"
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
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        icon="pencil"
        fieldName="description"
        // Tooltip disabled to experiment with improving user experience
        // tooltips={{
        //   label: {
        //     tooltipContent: formatText({
        //       id: 'actionSidebar.tooltip.description',
        //     }),
        //   },
        // }}
        title={formatText({ id: 'actionSidebar.description' })}
        isExpandable
      >
        {([
          isDecriptionFieldExpanded,
          {
            toggleOff: toggleOffDecriptionSelect,
            toggleOn: toggleOnDecriptionSelect,
          },
        ]) => (
          <DescriptionField
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
            fieldName="annotation"
          />
        )}
      </ActionFormRow>
      <BatchPaymentsTable name="payments" />
    </>
  );
};

BatchPaymentForm.displayName = displayName;

export default BatchPaymentForm;
