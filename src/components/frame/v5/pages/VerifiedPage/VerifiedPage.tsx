import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import Table from './partials/Table';
import { useVerifiedPage } from './hooks';

const displayName = 'v5.pages.VerifiedPage';

const VerifiedPage: FC = () => {
  const {
    verifiedMembers,
    loadingMembers,
    onSortReputationClick,
    isSortedDesc,
  } = useVerifiedPage();

  return (
    <Spinner
      loading={loadingMembers}
      loadingText={{ id: 'loading.verifiedPage' }}
    >
      <TwoColumns aside={<Navigation pageName="members" />}>
        <div className="flex justify-between mt-6">
          <div className="w-full">
            <Table
              list={verifiedMembers}
              isSorted={isSortedDesc}
              onReputationSortClick={onSortReputationClick}
            />
          </div>
        </div>
      </TwoColumns>
    </Spinner>
  );
};

VerifiedPage.displayName = displayName;

export default VerifiedPage;
