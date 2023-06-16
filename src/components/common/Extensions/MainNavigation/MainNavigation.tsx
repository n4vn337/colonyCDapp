import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import {
  useAppContext,
  useColonyContext,
  useMobile,
  useUserReputation,
} from '~hooks';
import { LEARN_MORE_PAYMENTS } from '~constants';
import Nav from './partials/Nav';
import { navMenuItems } from './partials/consts';
import { SubNavigationMobile } from '~common/Extensions/SubNavigation';
import LearnMore from '~shared/Extensions/LearnMore';
import Button from '~shared/Extensions/Button';
import PopoverBase from '~shared/Extensions/PopoverBase';
import styles from './MainNavigation.module.css';
import { MainNavigationProps } from './types';
import NavigationTools from '~common/Extensions/NavigationTools/NavigationTools';

const displayName = 'common.Extensions.MainNavigation';

const MainNavigation: FC<MainNavigationProps> = ({
  setTooltipRef,
  tooltipProps,
  isMenuOpen,
}) => {
  const { colony } = useColonyContext();
  const isMobile = useMobile();
  const { user, wallet } = useAppContext();
  const { profile } = user || {};
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );
  const { formatMessage } = useIntl();

  return (
    <div className="py-6 sm:py-0">
      <div className="hidden sm:block">
        <Nav items={navMenuItems} />
      </div>
      {isMobile && isMenuOpen && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={tooltipProps}
          classNames="w-full border-none shadow-none px-0 pb-6"
        >
          <div className={styles.mobileButtons}>
            <NavigationTools
              buttonLabel={formatMessage({
                id: 'helpAndAccount',
              })}
              nativeToken={nativeToken}
              totalReputation={totalReputation}
              userName={profile?.displayName || user?.name || ''}
              userReputation={userReputation}
              user={user}
            />
          </div>
          <div className="px-6">
            <Nav items={navMenuItems} />
            <div className="border-t border-gray-200 mb-3" />
            <SubNavigationMobile />
            <div className="flex flex-col items-center justify-between border-t border-gray-200 mt-4">
              <div className="my-6 w-full">
                <Button
                  text="Create new action"
                  mode="secondaryOutline"
                  isFullSize={isMobile}
                />
              </div>
              <LearnMore
                message={{
                  id: `${displayName}.helpText`,
                  defaultMessage:
                    'Need help and guidance? <a>Visit our docs</a>',
                }}
                href={LEARN_MORE_PAYMENTS}
              />
            </div>
          </div>
        </PopoverBase>
      )}
    </div>
  );
};

MainNavigation.displayName = displayName;

export default MainNavigation;
