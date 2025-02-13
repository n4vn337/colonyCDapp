import React, { FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl';
import { SuccessContentProps } from '~v5/common/AvatarUploader/types';
import Button from '~v5/shared/Button';

const displayName = 'v5.pages.UserProfilePage.AvatarSuccessContent';

const MSG = defineMessages({
  change: {
    id: `${displayName}.changeAvatar`,
    defaultMessage: 'Change Avatar',
  },
});

const IconSuccessContent: FC<SuccessContentProps> = ({
  open,
  handleFileRemove,
}) => (
  <div className="flex items-center gap-2">
    <Button mode="primarySolid" onClick={open}>
      {formatText(MSG.change)}
    </Button>
    <Button onClick={handleFileRemove} mode="tertiary">
      {formatText({
        id: 'button.delete.avatar',
      })}
    </Button>
  </div>
);

IconSuccessContent.displayName = displayName;

export default IconSuccessContent;
