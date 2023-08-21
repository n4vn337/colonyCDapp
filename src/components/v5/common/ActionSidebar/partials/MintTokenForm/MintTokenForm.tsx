import React, { FC, PropsWithChildren } from 'react';

import { FormProvider } from 'react-hook-form';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useMintToken } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.MintTokenForm';

const MintTokenForm: FC<PropsWithChildren> = ({ children }) => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { methods, onSubmit } = useMintToken(toggleActionSidebarOff);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        {children}
      </form>
    </FormProvider>
  );
};

MintTokenForm.displayName = displayName;

export default MintTokenForm;
