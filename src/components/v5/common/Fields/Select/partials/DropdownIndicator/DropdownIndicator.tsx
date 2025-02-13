import React from 'react';
import { DropdownIndicatorProps, components } from 'react-select';

import Icon from '~shared/Icon';

const displayName = 'v5.common.Fields.Select.partials.DropdownIndicator';

function DropdownIndicator<TValue>(
  props: DropdownIndicatorProps<TValue, false>,
): JSX.Element {
  return (
    <components.DropdownIndicator {...props}>
      <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />
    </components.DropdownIndicator>
  );
}

Object.assign(DropdownIndicator, { displayName });

export default DropdownIndicator;
