import React from 'react';
import { useIntl } from 'react-intl';

import { ExternalLinkProps } from './types';

import styles from './ExternalLink.module.css';

const displayName = 'Extensions.ExternalLink';

const ExternalLink = ({
  children,
  href,
  text,
  textValues,
  className,
  title,
  download,
}: ExternalLinkProps) => {
  const { formatMessage } = useIntl();
  const typeOfText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);
  const linkText = children || typeOfText || href;

  return (
    <a
      className={`${className} ${styles.main}`}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      title={title}
      {...(download !== undefined ? { download } : {})}
    >
      {linkText}
    </a>
  );
};

ExternalLink.displayName = displayName;

export default ExternalLink;
