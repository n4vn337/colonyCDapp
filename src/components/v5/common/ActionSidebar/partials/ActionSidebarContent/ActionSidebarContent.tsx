import { useApolloClient } from '@apollo/client';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { SearchActionsDocument } from '~gql';
import { ActionForm } from '~shared/Fields';
import { formatText } from '~utils/intl';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import Link from '~v5/shared/Link';
import NotificationBanner from '~v5/shared/NotificationBanner';

import ActionTypeSelect from '../../ActionTypeSelect';
import { ACTION_TYPE_FIELD_NAME } from '../../consts';
import {
  useActionFormProps,
  useSidebarActionForm,
  useReputationValidation,
} from '../../hooks';
import ActionButtons from '../ActionButtons';
import ActionDescriptionMetadata from '../ActionDescriptionMetadata';
import Motions from '../Motions';
import PopularActions from '../PopularActions';

import { useGetActionErrors } from './hooks';
import PermissionSidebar from './partials/PermissionSidebar';
import { SidebarBanner } from './partials/SidebarBanner';
import {
  ActionSidebarContentProps,
  ActionSidebarFormContentProps,
} from './types';

const displayName = 'v5.common.ActionsContent.partials.ActionSidebarContent';

const MSG = defineMessages({
  noReputationErrorTitle: {
    id: `${displayName}.noReputationErrorTitle`,
    defaultMessage: 'There is no reputation in this team yet',
  },
  noReputationError: {
    id: `${displayName}.noReputationError`,
    defaultMessage:
      'If you have the necessary permissions you can bypass the governance process.',
  },
  noPermissionsErrorTitle: {
    id: `${displayName}.noPermissionsErrorTitle`,
    defaultMessage: `You don't have the right permissions to create this action type. Choose another action.`,
  },
});

const ActionSidebarFormContent: FC<ActionSidebarFormContentProps> = ({
  getFormOptions,
  isMotion,
}) => {
  const { formatMessage } = useIntl();

  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const { readonly } = useAdditionalFormOptionsContext();
  const { flatFormErrors, hasErrors } = useGetActionErrors();

  const { setValue } = useFormContext();

  const { noReputationError } = useReputationValidation();

  return (
    <>
      <div className="flex-grow overflow-y-auto px-6">
        <FormInputBase
          name="title"
          placeholder={formatText({ id: 'placeholder.title' })}
          className={`
            heading-3 mb-2
            text-gray-900
            transition-colors
          `}
          message={false}
          shouldFocus
          mode="secondary"
        />
        <div className="text-gray-900 text-md flex gap-1 break-all">
          <ActionDescriptionMetadata />
        </div>
        <SidebarBanner />
        <ActionTypeSelect className="mt-7 mb-3 min-h-[1.875rem] flex flex-col justify-center" />

        {FormComponent && <FormComponent getFormOptions={getFormOptions} />}

        {noReputationError && (
          <div className="mt-6">
            <NotificationBanner
              status="warning"
              icon="warning-circle"
              description={formatMessage(MSG.noReputationError)}
              callToAction={
                <Link to="https://docs.colony.io/use/reputation">
                  {formatMessage({ id: 'text.learnMore' })}
                </Link>
              }
            >
              {formatMessage(MSG.noReputationErrorTitle)}
            </NotificationBanner>
          </div>
        )}
        {hasErrors || flatFormErrors.length ? (
          <div className="mt-7">
            <NotificationBanner
              status="error"
              icon="warning-circle"
              description={
                flatFormErrors.length ? (
                  <ul className="list-disc list-inside text-negative-400 capitalize">
                    {flatFormErrors.map(({ key, message }) => (
                      <li key={key}>{message}</li>
                    ))}
                  </ul>
                ) : null
              }
            >
              {formatText({ id: 'actionSidebar.fields.error' })}
            </NotificationBanner>
          </div>
        ) : null}
      </div>
      {!isMotion && !readonly && (
        <div className="mt-auto">
          {!selectedAction && (
            <PopularActions
              setSelectedAction={(action) =>
                setValue(ACTION_TYPE_FIELD_NAME, action)
              }
            />
          )}
          <ActionButtons isActionDisabled={!selectedAction} />
        </div>
      )}
    </>
  );
};

const ActionSidebarContent: FC<ActionSidebarContentProps> = ({
  transactionId,
  formRef,
  defaultValues,
  isMotion,
}) => {
  const { getFormOptions, actionFormProps } = useActionFormProps(
    defaultValues,
    !!transactionId,
  );
  const client = useApolloClient();

  return (
    <div
      className={clsx('flex w-full flex-grow', {
        'flex-col-reverse overflow-auto sm:overflow-hidden md:flex-row':
          !!transactionId,
        'overflow-hidden': !transactionId,
      })}
    >
      <div
        className={clsx('flex-grow pb-6 pt-8', {
          'w-full': !isMotion,
          'w-full sm:w-[65%]': isMotion,
        })}
      >
        <ActionForm
          {...actionFormProps}
          className="flex flex-col h-full"
          ref={formRef}
          onSuccess={() => {
            client.refetchQueries({
              include: [SearchActionsDocument],
            });
          }}
        >
          <ActionSidebarFormContent
            getFormOptions={getFormOptions}
            isMotion={isMotion}
          />
        </ActionForm>
      </div>
      {transactionId && (
        <div
          className={`
            w-full
            md:w-[35%]
            md:h-full
            md:overflow-y-auto
            md:flex-shrink-0
            px-6
            py-8
            border-b
            border-b-gray-200
            md:border-b-0
            md:border-l
            md:border-l-gray-200
            bg-gray-25
          `}
        >
          {isMotion ? (
            <Motions transactionId={transactionId} />
          ) : (
            <PermissionSidebar transactionId={transactionId} />
          )}
        </div>
      )}
    </div>
  );
};

ActionSidebarContent.displayName = displayName;

export default ActionSidebarContent;
