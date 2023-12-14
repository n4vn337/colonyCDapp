import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { formatText } from '~utils/intl';
import { useSetPageHeadingTitle } from '~context';
import { LANDING_PAGE_ROUTE } from '~routes';
import { useAppContext } from '~hooks';
import LoadingTemplate from '~frame/LoadingTemplate';
import { Form } from '~shared/Fields';
import { useUserProfile } from './hooks';
import { FormValues, validationSchema } from '../validation';
import UserAccountForm from '../UserAccountForm';

const displayName = 'v5.pages.UserProfilePage.partials.UserAccountPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading user profile...',
  },
});

const UserAccountPage: FC = () => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { handleSubmit } = useUserProfile();

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <Form<FormValues>
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      defaultValues={{
        hasDisplayNameChanged: false,
        bio: user?.profile?.bio || '',
        displayName: user?.profile?.displayName || '',
        location: user?.profile?.location || '',
        website: user?.profile?.website || '',
      }}
      resetOnSubmit
    >
      <UserAccountForm />
    </Form>
  );
};

UserAccountPage.displayName = displayName;

export default UserAccountPage;