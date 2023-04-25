import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { UserPermissionsBadgeProps } from './types';
import styles from './UserPermissionsBadge.module.css';
import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';

const displayName = 'common.Extensions.UserPermissionsBadge';

const UserPermissionsBadge: FC<PropsWithChildren<UserPermissionsBadgeProps>> = ({
  children,
  text,
  textValues,
  description,
  descriptionValues,
  name,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const userPermissionsBadgeText = typeof text == 'string' ? text : text && formatMessage(text, textValues);

  const userPermissionsBadgeDescription =
    typeof description == 'string' ? description : description && formatMessage(description, descriptionValues);

  const content = (
    <>
      <span className="flex flex-shrink-0 w-[0.75rem]">
        <Icon name={name} />
      </span>
      <span className="ml-1.5">{userPermissionsBadgeText || children}</span>
    </>
  );

  return (
    <Tooltip
      tooltipContent={
        <>
          <span className={clsx(styles.tooltipBadge, 'mb-2.5')}>{content}</span>
          {userPermissionsBadgeText}: {userPermissionsBadgeDescription}
        </>
      }
    >
      <span className={styles.badge} {...rest}>
        {content}
      </span>
    </Tooltip>
  );
};

UserPermissionsBadge.displayName = displayName;

export default UserPermissionsBadge;
