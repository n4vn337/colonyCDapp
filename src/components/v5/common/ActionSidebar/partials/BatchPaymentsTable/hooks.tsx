import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

import { formatText } from '~utils/intl';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

import { BatchPaymentsTableModel } from './types';

export const useBatchPaymentsTableColumns = (): ColumnDef<
  BatchPaymentsTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<BatchPaymentsTableModel>(),
    [],
  );

  const columns: ColumnDef<BatchPaymentsTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'recipient',
        header: () => formatText({ id: 'table.row.recipient' }),
        cell: () => {
          // @TODO: display data
        },
      }),
      columnHelper.display({
        id: 'amount',
        header: () => formatText({ id: 'table.row.amount' }),
        cell: () => {
          // @TODO: display data
        },
      }),
      columnHelper.display({
        id: 'token',
        header: () => formatText({ id: 'table.row.token' }),
        cell: () => {
          // @TODO: display data
        },
      }),
    ],
    [columnHelper],
  );

  return columns;
};

export const useGetTableMenuProps = ({ remove }) =>
  useCallback<
    TableWithMeatballMenuProps<BatchPaymentsTableModel>['getMenuProps']
  >(
    ({ index }) => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'remove',
          onClick: () => remove(index),
          label: formatText({ id: 'table.row.remove' }),
          icon: 'trash',
        },
      ],
    }),
    [remove],
  );
