import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowLineRight, ArrowsOutSimple, X } from 'phosphor-react';
import React, { FC, PropsWithChildren, useLayoutEffect } from 'react';

import { isFullScreen } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ColonyActionType } from '~gql';
import { useColonyContext, useMobile } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import useToggle from '~hooks/useToggle';
import { SpinnerLoader } from '~shared/Preloaders';
import { AnyActionType } from '~types';
import { getExtendedActionType } from '~utils/colonyActions';
import { formatText } from '~utils/intl';
import Modal from '~v5/shared/Modal';

import CompletedAction from '../CompletedAction';

import { actionSidebarAnimation } from './consts';
import {
  useCloseSidebarClick,
  useGetActionData,
  useRemoveTxParamOnClose,
} from './hooks';
import ActionSidebarContent from './partials/ActionSidebarContent/ActionSidebarContent';
import { ActionSidebarProps } from './types';

const displayName = 'v5.common.ActionSidebar';

const SUPPORTED_ACTIONS: AnyActionType[] = [
  ColonyActionType.Payment,
  ColonyActionType.MintTokens,
  ColonyActionType.MoveFunds,
  ColonyActionType.CreateDomain,
  ColonyActionType.UnlockToken,
  ColonyActionType.VersionUpgrade,
  ColonyActionType.CreateDecisionMotion,
  // @TODO uncomment when social links are added to action display
  // ColonyActionType.ColonyEdit,
];

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  initialValues,
  transactionId,
}) => {
  const { colony } = useColonyContext();
  const { action, defaultValues, loadingAction, isMotion } =
    useGetActionData(transactionId);

  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggle: toggleActionSidebarOff, registerContainerRef },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
  } = useActionSidebarContext();
  const [isSidebarFullscreen, { toggle: toggleIsSidebarFullscreen, toggleOn }] =
    useToggle();

  useLayoutEffect(() => {
    if (localStorage.getItem(isFullScreen) === 'true') {
      toggleOn();
    }
  }, [toggleOn]);

  const { formRef, closeSidebarClick } = useCloseSidebarClick();
  const isMobile = useMobile();

  useDisableBodyScroll(isActionSidebarOpen);
  useRemoveTxParamOnClose();

  const getSidebarContent = () => {
    if (loadingAction) {
      return (
        <div className="h-full flex items-center justify-center flex-col gap-4">
          <SpinnerLoader appearance={{ size: 'huge' }} />
          <p className="text-gray-600">
            {formatText({ id: 'actionSidebar.loading' })}
          </p>
        </div>
      );
    }

    if (action !== undefined && action !== null) {
      const actionType = getExtendedActionType(action, colony.metadata);

      if (SUPPORTED_ACTIONS.includes(actionType)) {
        return <CompletedAction action={action} />;
      }
    }

    return (
      <ActionSidebarContent
        key={transactionId}
        transactionId={transactionId}
        formRef={formRef}
        defaultValues={defaultValues || initialValues}
        isMotion={!!isMotion}
      />
    );
  };

  return (
    <motion.div
      transition={{
        ease: 'easeInOut',
      }}
      variants={actionSidebarAnimation}
      exit="hidden"
      initial="hidden"
      animate="visible"
      className={clsx(
        `
          transition-[max-width]
          fixed
          top-0
          sm:top-4
          bottom-4
          sm:bottom-0
          right-0
          h-full
          sm:h-[calc(100vh-2rem)]
          w-full
          sm:w-[calc(100vw-8.125rem)]
          bg-base-white
          rounded-bl-lg
          border
          border-r-0
          border-gray-200
          rounded-l-lg
          shadow-default
          z-[60]
          flex
          flex-col
        `,
        {
          'sm:max-w-full': isSidebarFullscreen,
          'sm:max-w-[43.375rem]': !isSidebarFullscreen && !isMotion,
          'sm:max-w-[67.3125rem]': !isSidebarFullscreen && !!transactionId,
        },
      )}
      ref={registerContainerRef}
    >
      <div className="py-4 px-6 flex w-full items-center justify-between border-b border-gray-200">
        {isMobile ? (
          <button
            type="button"
            className="py-2.5 flex items-center justify-center text-gray-400"
            onClick={closeSidebarClick}
            aria-label={formatText({ id: 'ariaLabel.closeModal' })}
          >
            <X size={18} />
          </button>
        ) : (
          <button
            type="button"
            className="py-2.5 flex items-center justify-center text-gray-400 transition sm:hover:text-blue-400"
            onClick={toggleIsSidebarFullscreen}
            aria-label={formatText({ id: 'ariaLabel.fullWidth' })}
          >
            {isSidebarFullscreen ? (
              <ArrowLineRight size={18} />
            ) : (
              <ArrowsOutSimple size={18} />
            )}
          </button>
        )}
        {children}
      </div>
      {getSidebarContent()}
      <Modal
        title={formatText({ id: 'actionSidebar.cancelModal.title' })}
        subTitle={formatText({
          id: 'actionSidebar.cancelModal.subtitle',
        })}
        isOpen={isCancelModalOpen}
        onClose={toggleCancelModalOff}
        onConfirm={() => {
          toggleCancelModalOff();
          toggleActionSidebarOff();
        }}
        icon="warning-circle"
        buttonMode="primarySolid"
        confirmMessage={formatText({ id: 'button.cancelAction' })}
        closeMessage={formatText({
          id: 'button.continueAction',
        })}
      />
    </motion.div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
