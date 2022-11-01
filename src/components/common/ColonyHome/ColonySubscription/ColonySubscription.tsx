import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

// import { SpinnerLoader } from '~core/Preloaders';
import Button /* ThreeDotsButton */ from '~shared/Button';
import Link from '~shared/Link';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';

import { Colony } from '~types';
import { useAppContext } from '~hooks';

// import { checkIfNetworkIsAllowed } from '~utils/networks';
import { CREATE_USER_ROUTE } from '~routes/index';

import ColonySubscriptionInfoPopover from './ColonySubscriptionInfoPopover';

import styles from './ColonySubscription.css';

const MSG = defineMessages({
  copyMessage: {
    id: 'dashboard.ColonyHome.ColonySubscription.copyMessage',
    defaultMessage: 'Click to copy colony address',
  },
  joinColony: {
    id: 'dashboard.ColonyHome.ColonySubscription.joinColony',
    defaultMessage: 'Join this colony',
  },
  colonyMenuTitle: {
    id: 'dashboard.ColonyHome.ColonySubscription.colonyMenuTitle',
    defaultMessage: 'Colony Menu',
  },
});

interface Props {
  colony: Colony;
}

const ColonySubscription = ({ colony: { colonyAddress }, colony }: Props) => {
  const { user } = useAppContext();

  // const [
  //   subscribe,
  //   { loading: loadingSubscribe },
  // ] = useSubscribeToColonyMutation({
  //   variables: { input: { colonyAddress } },
  //   update: cacheUpdates.subscribeToColony(colonyAddress),
  // });
  // const [
  //   unsubscribe,
  //   { loading: loadingUnsubscribe },
  // ] = useUnsubscribeFromColonyMutation({
  //   variables: { input: { colonyAddress } },
  //   update: cacheUpdates.unsubscribeFromColony(colonyAddress),
  // });

  const isSubscribed = !!(user?.watchlist?.items || []).find(
    (item) => (item?.colony as Colony)?.colonyAddress === colonyAddress,
  );

  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const isNetworkAllowed = true;

  return (
    <div className={styles.main}>
      {/* {loadingSubscribe ||
        (loadingUnsubscribe && (
          <div className={styles.spinnerContainer}>
            <SpinnerLoader appearance={{ theme: 'primary', size: 'small' }} />
          </div>
        ))} */}
      <div className={isSubscribed ? styles.colonySubscribed : ''}>
        {colonyAddress && (
          <InvisibleCopyableAddress
            address={colonyAddress}
            copyMessage={MSG.copyMessage}
          >
            <div className={styles.colonyAddress}>
              <MaskedAddress address={colonyAddress} />
            </div>
          </InvisibleCopyableAddress>
        )}
        {isSubscribed && (
          <ColonySubscriptionInfoPopover
            colony={colony}
            // onUnsubscribe={() => unsubscribe()}
            canUnsubscribe={isNetworkAllowed}
          >
            {/* {({ isOpen, toggle, ref, id }) => (
              <ThreeDotsButton
                id={id}
                innerRef={ref}
                isOpen={isOpen}
                className={styles.menuIconContainer}
                activeStyles={styles.menuActive}
                onClick={toggle}
                tabIndex={0}
                data-test="colonyMenuPopover"
                title={MSG.colonyMenuTitle}
              />
            )} */}
            <div>***</div>
          </ColonySubscriptionInfoPopover>
        )}
        {!isSubscribed && (
          <div className={styles.colonyJoin}>
            {user?.name && (
              <Button
                onClick={() => {
                  /* subscribe() */
                }}
                appearance={{ theme: 'blue', size: 'small' }}
                data-test="joinColonyButton"
                className={styles.colonyJoinBtn}
              >
                <FormattedMessage {...MSG.joinColony} />
              </Button>
            )}
            {!user?.name && (
              <Link
                className={styles.colonyJoinBtn}
                to={{
                  pathname: CREATE_USER_ROUTE,
                  // state: { colonyURL: `/colony/${colonyName}` },
                }}
                text={MSG.joinColony}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ColonySubscription.displayName = 'dashboard.ColonyHome.ColonySubscription';

export default ColonySubscription;