import { Domain } from '~types';
import { formatText } from '~utils/intl';
import { setHexTeamColor } from '~utils/teams';
import { ChartData } from '~v5/common/DonutChart/types';

const WIDGET_TEAM_LIMIT = 4;
const TOP_TEAMS_WIDGET_LIMIT = WIDGET_TEAM_LIMIT - 1;

export const getTeamReputationChartData = (allTeams: Domain[]): ChartData[] => {
  if (allTeams.length <= WIDGET_TEAM_LIMIT) {
    return allTeams.map(({ id, metadata, reputationPercentage }) => {
      return {
        id,
        label: metadata?.name || '',
        value: Number(reputationPercentage),
        color: setHexTeamColor(metadata?.color),
        stroke: setHexTeamColor(metadata?.color),
      };
    });
  }

  const otherTeamsReputation = allTeams
    .slice(TOP_TEAMS_WIDGET_LIMIT)
    .reduce(
      (acc, item) =>
        item.reputationPercentage !== null
          ? acc + Number(item.reputationPercentage)
          : acc,
      0,
    );

  const otherTeams = {
    id: 'otherTeams',
    label: formatText({ id: 'label.allOther' }),
    value: otherTeamsReputation ?? 0,
    color: '--color-teams-grey-100',
    stroke: '--color-teams-grey-100',
  };

  const topTeams = allTeams
    .slice(0, TOP_TEAMS_WIDGET_LIMIT)
    .map(({ id, metadata, reputationPercentage }) => {
      return {
        id,
        label: metadata?.name || '',
        value: Number(reputationPercentage),
        color: setHexTeamColor(metadata?.color),
        stroke: setHexTeamColor(metadata?.color),
      };
    });

  return [...topTeams, otherTeams];
};
