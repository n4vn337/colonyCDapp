import { useGetTotalColonyDomainActionsQuery } from '~gql';
import { notNull } from '~utils/arrays';

import useActionsCount from './useActionsCount';
import useColonyContext from './useColonyContext';
import useGetSelectedDomainFilter from './useGetSelectedDomainFilter';

export const useActivityData = () => {
  const {
    colony: { domains, colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const { actionsCount: totalActions, loading: totalActionsLoading } =
    useActionsCount({
      domainId: selectedDomain?.nativeId,
    });

  const { actionsCount: recentActions, loading: recentActionsLoading } =
    useActionsCount({
      domainId: selectedDomain?.nativeId,
      onlyRecent: true,
    });

  const { data: domainData } = useGetTotalColonyDomainActionsQuery({
    variables: {
      colonyId: colonyAddress,
    },
  });

  const domainCountsResult =
    domainData?.searchColonyActions?.aggregateItems[0]?.result || {};
  const domainsActionCount =
    domainCountsResult?.__typename === 'SearchableAggregateBucketResult'
      ? domainCountsResult?.buckets?.filter(notNull) ?? []
      : [];

  const domainWithMaxActions = domainsActionCount.reduce(
    (max, item) => (item.docCount > (max || 0) ? item : max),
    null,
  );

  const mostActiveDomain = domains?.items
    .filter(notNull)
    .find((domain) => domain.id === domainWithMaxActions?.key || '');

  const mostActiveDomainName = mostActiveDomain?.metadata?.name || '~';

  return {
    totalActions,
    recentActions,
    mostActiveDomainName,
    domainsActionCount,
    totalActionsLoading,
    recentActionsLoading,
  };
};
