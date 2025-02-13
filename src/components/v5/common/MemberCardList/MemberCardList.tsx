import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';

import MemberCard from '../MemberCard/MemberCard';

import MemberCardPlaceholder from './partials/MemberCardPlaceholder';
import { MemberCardListProps } from './types';

const displayName = 'v5.common.MemberCardList';

const MemberCardList: FC<MemberCardListProps> = ({
  items,
  placeholderCardProps,
  isSimple,
}) =>
  items?.length || (!items?.length && placeholderCardProps) ? (
    <ul
      className={clsx('grid', {
        'grid-cols-[repeat(auto-fit,minmax(14.75rem,1fr))]':
          !isSimple && items.length > 2,
        'grid-cols-[repeat(auto-fit,minmax(14.75rem,1fr))] lg:grid-cols-4':
          !isSimple && items.length <= 2,
        'grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))]':
          isSimple && items.length > 3,
        'grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] md:grid-cols-4':
          isSimple && items.length <= 3,
        'gap-x-6 gap-y-4': !isSimple,
        'gap-6': isSimple,
      })}
    >
      {/* @todo: update the animation */}
      <AnimatePresence initial={false}>
        {items.map(({ key, ...item }) => (
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0, y: 10 }}
            key={key}
            className={clsx({ 'min-h-[11.5rem]': !isSimple })}
          >
            <MemberCard isSimple={isSimple} {...item} />
          </motion.li>
        ))}
        {placeholderCardProps && (
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            // transition={{ duration: 0.5 }}
            className={clsx({ 'min-h-[11.5rem]': !isSimple })}
          >
            <MemberCardPlaceholder {...placeholderCardProps} />
          </motion.li>
        )}
      </AnimatePresence>
    </ul>
  ) : null;

MemberCardList.displayName = displayName;

export default MemberCardList;
