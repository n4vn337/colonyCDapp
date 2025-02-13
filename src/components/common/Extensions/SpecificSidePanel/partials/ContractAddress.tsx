import React, { FC } from 'react';

import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import { splitWalletAddress } from '~utils/splitWalletAddress';

import { PanelTypeProps } from '../types';

import styles from '../SpecificSidePanel.module.css';

const displayName = 'common.Extensions.partials.ContractAddress';

const ContractAddress: FC<PanelTypeProps> = ({ title, description }) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();

  return (
    <div className={styles.panelRow}>
      <p className={styles.panelTitle}>{title}</p>
      {description && (
        <Tooltip
          interactive
          isSuccess={isCopied}
          tooltipContent={
            <a className="block" href={description}>
              {formatText({ id: isCopied ? 'copied' : 'copy.address' })}
            </a>
          }
        >
          <button
            type="button"
            aria-label={formatText({ id: 'copy.address' })}
            className="font-normal text-md justify-start text-ellipsis overflow-hidden"
            onClick={() => handleClipboardCopy(description || '')}
          >
            {splitWalletAddress(description)}
          </button>
        </Tooltip>
      )}
    </div>
  );
};

ContractAddress.displayName = displayName;

export default ContractAddress;
