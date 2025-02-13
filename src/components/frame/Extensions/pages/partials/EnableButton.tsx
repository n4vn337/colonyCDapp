import { ColonyRole, Extension, Id } from '@colony/colony-js';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppContext, useColonyContext, useMobile } from '~hooks';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { AnyExtensionData } from '~types';
import { addressHasRoles } from '~utils/checks';
import {
  canExtensionBeInitialized,
  isInstalledExtensionData,
} from '~utils/extensions';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button/Button';

import ReenableButton from '../ExtensionDetailsPage/partials/ExtensionDetails/ReenableButton';

interface EnableButtonProps {
  userHasRoot: boolean;
  extensionData: AnyExtensionData;
  isSetupRoute: boolean;
  waitingForEnableConfirmation: boolean;
}

const displayName = 'frame.Extensions.pages.partials.EnableButton';

const EnableButton = ({
  userHasRoot,
  extensionData,
  isSetupRoute,
  waitingForEnableConfirmation,
}: EnableButtonProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();

  const userHasArchitecture =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Architecture],
      requiredRolesDomains: [Id.RootDomain],
    });

  /* To enable, a user must have the root permission. They also need architecture for the permissions tx to be successful. */
  const isEnableButtonVisible =
    userHasRoot &&
    (extensionData.neededColonyPermissions.length
      ? userHasArchitecture
      : true) &&
    isInstalledExtensionData(extensionData) &&
    canExtensionBeInitialized(extensionData.extensionId) &&
    !extensionData.isDeprecated &&
    !extensionData.isInitialized;

  /* If deprecated, can be re-enabled */
  const canExtensionBeRenabled = !!(
    userHasRoot &&
    isInstalledExtensionData(extensionData) &&
    extensionData.isDeprecated
  );

  if (isEnableButtonVisible) {
    if (
      !isSetupRoute &&
      extensionData.extensionId === Extension.VotingReputation
    ) {
      return (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate(`${pathname}/${COLONY_EXTENSION_SETUP_ROUTE}`);
          }}
          isFullSize={isMobile}
        >
          {formatText({ id: 'button.enable' })}
        </Button>
      );
    }

    return (
      <Button
        type="submit"
        disabled={!isValid}
        isFullSize={isMobile}
        loading={isSubmitting || waitingForEnableConfirmation}
      >
        {formatText({ id: 'button.enable' })}
      </Button>
    );
  }

  if (canExtensionBeRenabled) {
    return <ReenableButton extensionData={extensionData} />;
  }

  return null;
};

EnableButton.displayName = displayName;

export default EnableButton;
