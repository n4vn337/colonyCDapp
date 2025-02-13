import React from 'react';
import { FormattedMessage } from 'react-intl';

import { TransactionType } from '~redux/immutable';
import Card from '~shared/Card';
import Heading from '~shared/Heading';
import { arrayToObject } from '~utils/arrays';

import { Appearance } from '../GasStationContent';
import {
  getGroupKey,
  getGroupStatus,
  getGroupValues,
} from '../transactionGroup';

import GroupedTransactionCard from './GroupedTransactionCard';
import TransactionStatus from './TransactionStatus';

import styles from './GroupedTransaction.css';

interface Props {
  appearance: Appearance;
  transactionGroup: TransactionType[];
  selectedTransactionIdx: number;
}

const displayName = 'frame.GasStation.GroupedTransaction';

const GroupedTransaction = ({
  appearance,
  selectedTransactionIdx,
  transactionGroup,
}: Props) => {
  const { interactive } = appearance;
  const groupKey = getGroupKey(transactionGroup);
  const status = getGroupStatus(transactionGroup);
  const values = getGroupValues<TransactionType>(transactionGroup);

  const defaultTransactionGroupMessageDescriptorTitleId = {
    id: `${
      transactionGroup[0].metatransaction ? 'meta' : ''
    }transaction.${groupKey}.title`,
  };
  const defaultTransactionGroupMessageDescriptorDescriptionId = {
    id: process.env.DEBUG
      ? `${
          transactionGroup[0].metatransaction ? 'meta' : ''
        }transaction.debug.description`
      : `${
          transactionGroup[0].metatransaction ? 'meta' : ''
        }transaction.${groupKey}.description`,
  };

  return (
    <Card className={styles.main}>
      {interactive && (
        <div className={styles.summary}>
          <div className={styles.description}>
            <Heading
              appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
              text={{
                ...defaultTransactionGroupMessageDescriptorTitleId,
                ...values.group?.title,
              }}
              textValues={
                values.group?.titleValues || arrayToObject(values.params)
              }
            />
            <FormattedMessage
              {...defaultTransactionGroupMessageDescriptorDescriptionId}
              {...values.group?.description}
              values={
                values.group?.descriptionValues || arrayToObject(values.params)
              }
            />
          </div>
          <TransactionStatus
            groupCount={transactionGroup.length}
            status={status}
          />
        </div>
      )}
      <ul
        className={styles.transactionList}
        data-test="gasStationGroupedTransaction"
      >
        {transactionGroup.map((transaction, idx) => (
          <GroupedTransactionCard
            key={transaction.id}
            idx={idx}
            selected={idx === selectedTransactionIdx}
            transaction={transaction}
            appearance={appearance}
          />
        ))}
      </ul>
    </Card>
  );
};

GroupedTransaction.displayName = displayName;

export default GroupedTransaction;
