import { MotionState as NetworkMotionState } from '@colony/colony-js';
import clsx from 'clsx';
import React, { FC } from 'react';

import { useAppContext } from '~hooks';
import useToggle from '~hooks/useToggle';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem';
import Button from '~v5/shared/Button';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';
import StatusText from '~v5/shared/StatusText';

import MotionBadge from '../../partials/MotionBadge/MotionBadge';

import { useRevealStep } from './hooks';
import RevealInformationList from './partials/RevealInformationList';
import { RevealStepProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep';

const RevealStep: FC<RevealStepProps> = ({
  motionData,
  motionState,
  startPollingAction,
  stopPollingAction,
  transactionId,
}) => {
  const { canInteract } = useAppContext();
  const [isInformationAccordionOpen, { toggle: toggleInformationAccordion }] =
    useToggle();
  const {
    hasUserVoted,
    handleSuccess,
    nativeToken,
    transform,
    userVoteRevealed,
    voterReward,
    voters,
    isSupportVote,
    revealProgress,
    totalVoters,
  } = useRevealStep(
    motionData,
    startPollingAction,
    stopPollingAction,
    transactionId,
  );

  const { decimals, symbol } = nativeToken || {};

  const motionFinished =
    motionState === NetworkMotionState.Finalizable ||
    motionState === NetworkMotionState.Finalized ||
    motionState === NetworkMotionState.Failed;

  const revealPhaseEnded = hasUserVoted && userVoteRevealed && motionFinished;

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: formatText({ id: 'motion.revealStep.statusText' }),
        textClassName: 'text-4',
        content: (
          <div className="mt-1 flex flex-col gap-2">
            <ProgressBar
              progress={revealProgress}
              max={totalVoters}
              additionalText={formatText({
                id:
                  revealProgress === 1
                    ? 'motion.revealStep.voteRevealed'
                    : 'motion.revealStep.votesRevealed',
              })}
              className="ml-1"
              isTall
            />
            {!revealPhaseEnded && canInteract && (
              <StatusText
                status="warning"
                textClassName="text-4 text-gray-900"
                iconAlignment="top"
              >
                {formatText({ id: 'motion.revealStep.warning' })}
              </StatusText>
            )}
          </div>
        ),
      }}
      sections={[
        {
          key: '1',
          content: (
            <ActionForm
              actionType={ActionTypes.MOTION_REVEAL_VOTE}
              transform={transform}
              onSuccess={handleSuccess}
            >
              {hasUserVoted ? (
                <>
                  <div className={clsx({ 'mb-6': !userVoteRevealed })}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-2">
                        {formatText({ id: 'motion.revealStep.title' })}
                      </h4>
                      <MotionBadge
                        status={isSupportVote ? 'support' : 'oppose'}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <p className="text-gray-600">
                        {formatText({ id: 'motion.revealStep.rewards' })}
                      </p>
                      <Numeral
                        value={voterReward || '0'}
                        decimals={decimals}
                        suffix={symbol}
                      />
                    </div>
                  </div>
                  {!motionFinished && !userVoteRevealed && (
                    <Button
                      mode="primarySolid"
                      type="submit"
                      isFullSize
                      text={formatText({ id: 'motion.revealStep.submit' })}
                    />
                  )}
                </>
              ) : (
                <>
                  <h4 className="text-1 mb-2">
                    {formatText({ id: 'motion.revealStep.emptyTitle' })}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatText({ id: 'motion.revealStep.emptyDescription' })}
                  </p>
                </>
              )}
            </ActionForm>
          ),
        },
      ]}
      footer={
        <AccordionItem
          className="text-sm text-gray-500"
          isOpen={isInformationAccordionOpen}
          onToggle={toggleInformationAccordion}
          title={formatText({
            id: isInformationAccordionOpen
              ? 'motion.revealStep.buttonHide'
              : 'motion.revealStep.buttonShow',
          })}
          iconName="caret-down"
          iconSize="extraSmall"
        >
          <RevealInformationList items={voters} />
        </AccordionItem>
      }
    />
  );
};

RevealStep.displayName = displayName;

export default RevealStep;
