import { ImgHTMLAttributes } from 'react';

import { AvatarSize } from '../Avatar/types';

export interface ColonyAvatarProps {
  colonyAddress: string;
  chainIconName?: string;
  colonyImageProps?: ImgHTMLAttributes<HTMLImageElement>;
  className?: string;
  size?: AvatarSize;
}
