import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { Input, InputProps } from '~shared/Fields';
import { Token } from '~types';
import { createAddress, isAddress } from '~utils/web3';

import styles from './TokenSelector.css';

const displayName = 'shared.TokenSelector';

const MSG = defineMessages({
  label: {
    id: `${displayName}.label`,
    defaultMessage: 'Token Address',
  },
  hint: {
    id: `${displayName}.hint`,
    defaultMessage: 'You can find them here: {tokenExplorerLink}',
  },
  preview: {
    id: `${displayName}.preview`,
    defaultMessage: '{name} ({symbol})',
  },
});

interface Props
  extends Pick<InputProps, 'label' | 'appearance' | 'extra' | 'disabled'> {
  /** Name of token address input. Defaults to 'tokenAddress' */
  addressFieldName?: string;
  /** Name of token field. Defaults to 'token' */
  tokenFieldName?: string;
}

interface StatusTextProps {
  hasError: boolean;
  isDirty: boolean;
  token: Token | null;
}
const getStatusText = ({ hasError, token, isDirty }: StatusTextProps) => {
  if (!isDirty && !token) {
    return {
      status: MSG.hint,
      statusValues: {
        tokenExplorerLink: DEFAULT_NETWORK_INFO.tokenExplorerLink,
      },
    };
  }

  if (hasError || !token) {
    return {};
  }

  const { name, symbol } = token;
  return {
    status: MSG.preview,
    statusValues: { name, symbol },
  };
};

const TokenSelector = ({
  extra,
  label,
  appearance,
  addressFieldName = 'tokenAddress',
  tokenFieldName = 'token',
  disabled = false,
}: Props) => {
  const {
    watch,
    formState: { isValid, isDirty, isValidating },
    setValue,
    clearErrors,
  } = useFormContext();
  const tokenAddressField = watch(addressFieldName);
  const tokenAddress = isAddress(tokenAddressField)
    ? createAddress(tokenAddressField)
    : tokenAddressField;

  const {
    data,
    loading: isFetchingAddress,
    error: fetchingTokenError,
  } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress,
      },
    },
    skip: !isAddress(tokenAddress),
  });
  const token = data?.getTokenFromEverywhere?.items?.[0] ?? null;

  useEffect(() => {
    // When token is updated (either found or null), clear errors and set the values in hook-form
    clearErrors(addressFieldName);
    setValue(tokenFieldName, token, {
      shouldValidate: true,
    });
  }, [addressFieldName, clearErrors, setValue, token, tokenFieldName]);

  const displayLoading =
    isFetchingAddress || (isValidating && isAddress(tokenAddress));

  return (
    /**
     * @todo Define custom input component for token addresses
     */
    <div className={styles.inputWrapper}>
      <Input
        name={addressFieldName}
        label={label || MSG.label}
        extra={extra}
        {...getStatusText({
          isDirty,
          hasError: !isValid || !!fetchingTokenError,
          token,
        })}
        isLoading={displayLoading}
        appearance={appearance}
        disabled={disabled}
        dataTest="tokenSelectorInput"
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
