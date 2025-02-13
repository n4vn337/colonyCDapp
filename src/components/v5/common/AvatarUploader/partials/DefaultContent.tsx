import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import Icon from '~shared/Icon';

import { useFormatFormats } from '../hooks';
import { DefaultContentProps } from '../types';

const displayName = 'v5.common.AvatarUploader.partials.DefaultContent';

const DefaultContent: FC<DefaultContentProps> = ({
  open,
  isSimplified,
  isDragAccept,
  fileOptions: { fileFormat, fileDimension, fileSize },
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const isSimpleOnMobile = isSimplified && isMobile;
  const formattedFormats = useFormatFormats(fileFormat);

  return (
    <div
      className={clsx(
        'flex-col items-center flex px-6 rounded border w-full hover:border-blue-400 hover:bg-blue-100',
        {
          'py-4': !isSimpleOnMobile,
          'py-2': isSimpleOnMobile,
          'border-gray-200 bg-white-100': !isDragAccept,
          'border-blue-400 bg-blue-100': isDragAccept,
        },
      )}
    >
      {isSimpleOnMobile ? (
        <button
          type="button"
          className="flex items-center text-gray-600"
          onClick={open}
        >
          <Icon name="cloud-arrow-up" appearance={{ size: 'small' }} />
          <span className="ml-2 text-3">
            {formatMessage({ id: 'upload' }, { format: fileFormat })}
          </span>
        </button>
      ) : (
        <>
          <div className="w-9 h-9 mb-2">
            <div className="bg-gray-50 p-[0.25rem] rounded-full flex items-start justify-center">
              <div className="bg-gray-200 p-[0.25rem] rounded-full flex items-start justify-center">
                <Icon name="cloud-arrow-up" appearance={{ size: 'small' }} />
              </div>
            </div>
          </div>
          <div className="mb-1 text-blue-400 text-2">
            <button
              aria-label={formatMessage({
                id: isMobile ? 'tap.to.upload' : 'click.to.upload',
              })}
              type="button"
              onClick={open}
            >
              {isMobile ? (
                <span>{formatMessage({ id: 'tap.to.upload' })}</span>
              ) : (
                <>
                  {formatMessage({ id: 'click.to.upload' })}{' '}
                  <span className="text-gray-600 text-1">
                    {formatMessage({ id: 'drag.and.drop' })}
                  </span>
                </>
              )}
            </button>
          </div>
          <span className="text-gray-600 text-sm">
            {formatMessage(
              { id: 'avatar.uploader.text' },
              {
                format: formattedFormats,
                dimension: fileDimension,
                size: fileSize,
              },
            )}
          </span>
        </>
      )}
    </div>
  );
};

DefaultContent.displayName = displayName;

export default DefaultContent;
