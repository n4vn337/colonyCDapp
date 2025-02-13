import ReputationBadge from '~v5/shared/ReputationBadge';

import type { Meta, StoryObj } from '@storybook/react';

const reputationBadgeMeta: Meta<typeof ReputationBadge> = {
  title: 'Shared/Reputation Badge',
  component: ReputationBadge,
  args: {
    reputation: 25.5,
  },
};

export default reputationBadgeMeta;

export const Base: StoryObj<typeof ReputationBadge> = {};
