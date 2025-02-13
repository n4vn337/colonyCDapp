import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, put, all } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';
import { ExpenditurePayout } from '~types';

import {
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions';
import { initiateTransaction, putError, takeFrom } from '../utils';

type PayoutWithSlotId = ExpenditurePayout & {
  slotId: number;
};

const getPayoutChannelId = (payout: PayoutWithSlotId) =>
  `${payout.slotId}-${payout.tokenAddress}`;

function* claimExpenditure({
  meta,
  payload: { colonyAddress, expenditureId, claimableSlots },
}: Action<ActionTypes.EXPENDITURE_CLAIM>) {
  const batchKey = 'claimExpenditure';

  const payoutsWithSlotIds = claimableSlots.flatMap(
    (slot) =>
      slot.payouts
        ?.filter((payout) => payout.amount !== '0')
        .map((payout) => ({
          ...payout,
          slotId: slot.id,
        })) ?? [],
  );

  const channels = yield createTransactionChannels(meta.id, [
    ...payoutsWithSlotIds.map(getPayoutChannelId),
  ]);

  try {
    // Create one claim transaction for each slot
    yield all(
      payoutsWithSlotIds.map((payout, index) =>
        fork(createTransaction, channels[getPayoutChannelId(payout)].id, {
          context: ClientType.ColonyClient,
          methodName: 'claimExpenditurePayout',
          identifier: colonyAddress,
          params: [expenditureId, payout.slotId, payout.tokenAddress],
          group: {
            key: batchKey,
            id: meta.id,
            index,
          },
          ready: false,
        }),
      ),
    );

    for (const payout of payoutsWithSlotIds) {
      const payoutChannelId = getPayoutChannelId(payout);
      yield takeFrom(
        channels[payoutChannelId].channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      yield initiateTransaction({ id: channels[payoutChannelId].id });
      yield waitForTxResult(channels[payoutChannelId].channel);
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CLAIM_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.EXPENDITURE_CLAIM_ERROR, error, meta);
  } finally {
    for (const payout of payoutsWithSlotIds) {
      const payoutChannelId = getPayoutChannelId(payout);
      channels[payoutChannelId].channel.close();
    }
  }

  return null;
}

export default function* claimExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CLAIM, claimExpenditure);
}
