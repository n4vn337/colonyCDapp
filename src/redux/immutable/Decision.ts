import { Id } from '@colony/colony-js';
import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types';
import { DecisionDraft } from '~utils/decisions';

const defaultValues: DefaultValues<DecisionDraft & { colonyAddress: string }> =
  {
    description: undefined,
    walletAddress: undefined,
    motionDomainId: Id.RootDomain,
    title: undefined,
    colonyAddress: undefined,
  };

export class DecisionRecord
  extends Record<DecisionDraft>(defaultValues)
  implements RecordToJS<DecisionDraft> {}

export const Decision = (p?: DecisionDraft) => new DecisionRecord(p);
