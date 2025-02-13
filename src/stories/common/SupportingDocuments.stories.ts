import SupportingDocuments from '~common/Extensions/SupportingDocuments';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SupportingDocuments> = {
  title: 'Common/Supporting Documents list',
  component: SupportingDocuments,
};

export default meta;
type Story = StoryObj<typeof SupportingDocuments>;

export const SingleLink: Story = {
  args: {
    isDoubleLinkVisible: false,
  },
};

export const DoubleLink: Story = {
  args: {
    isDoubleLinkVisible: true,
  },
};
