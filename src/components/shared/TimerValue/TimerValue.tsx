import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const MSG = defineMessages({
  days: {
    id: 'TimerValue.days',
    defaultMessage: ' {days}d',
  },
  hours: {
    id: 'TimerValue.hours',
    defaultMessage: ' {hours}h',
  },
  minutes: {
    id: 'TimerValue.minutes',
    defaultMessage: ' {minutes}m',
  },
  seconds: {
    id: 'TimerValue.seconds',
    defaultMessage: ' {seconds}s',
  },
});

export interface TimerValueProps {
  splitTime?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const displayName = 'TimerValue';

const TimerValue = ({ splitTime }: TimerValueProps) => {
  if (!splitTime) {
    return null;
  }

  return (
    <>
      {splitTime.days > 0 && (
        <FormattedMessage {...MSG.days} values={{ days: splitTime.days }} />
      )}
      {(splitTime.days > 0 || splitTime.hours > 0) && (
        <FormattedMessage {...MSG.hours} values={{ hours: splitTime.hours }} />
      )}
      {(splitTime.days > 0 || splitTime.hours > 0 || splitTime.minutes) > 0 && (
        <FormattedMessage
          {...MSG.minutes}
          values={{ minutes: splitTime.minutes }}
        />
      )}
      <FormattedMessage
        {...MSG.seconds}
        values={{ seconds: splitTime.seconds }}
      />
    </>
  );
};

TimerValue.displayName = displayName;

export default TimerValue;
