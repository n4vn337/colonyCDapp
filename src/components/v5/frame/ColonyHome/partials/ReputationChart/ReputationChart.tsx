import { Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { ACTION } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import DonutChart from '~v5/common/DonutChart';
import { ChartData } from '~v5/common/DonutChart/types';
import TeamReputationSummaryRow from '~v5/common/TeamReputationSummary/partials/TeamReputationSummaryRow';
import WidgetBox from '~v5/common/WidgetBox';
import EmptyWidgetState from '~v5/common/WidgetBox/partials/EmptyWidgetState';

import { summaryLegendColor } from './consts';
import { getTeamReputationChartData } from './utils';

const displayName = 'v5.frame.ColonyHome.ReputationChart';

const MSG = defineMessages({
  legendNoTeams: {
    id: `${displayName}.legendNoTeams`,
    defaultMessage: 'There are no teams with reputation in the Colony',
  },
  legendNoTeamsAction: {
    id: `${displayName}.legendNoTeamsAction`,
    defaultMessage: 'Create a new action',
  },
});

const ReputationChart = () => {
  const {
    colony: { domains },
  } = useColonyContext();

  const [hoveredSegment, setHoveredSegment] = useState<
    ChartData | undefined | null
  >();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const updateHoveredSegment = (segmentData: ChartData | null | undefined) => {
    setHoveredSegment(segmentData);
  };

  const openCreateNewTeam = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
    });
  };

  const allTeams = (domains?.items || [])
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const chartData = getTeamReputationChartData(allTeams);

  const getChartLegend = () => {
    const doesReputationExist = chartData[0] ? chartData[0].value > 0 : false;

    if (chartData.length === 0) {
      return (
        <EmptyWidgetState
          title={formatText({
            id: 'dashboard.team.widget.noData',
          })}
          actionTitle={formatText({
            id: 'dashboard.team.widget.createTeam',
          })}
          className="px-[1.8rem] py-[2.3rem]"
          onClick={openCreateNewTeam}
        />
      );
    }

    if (!doesReputationExist) {
      return (
        <EmptyWidgetState
          title={<p className="text-center">{formatText(MSG.legendNoTeams)}</p>}
          actionTitle={formatText(MSG.legendNoTeamsAction)}
          className="px-[1.8rem] py-[2.3rem]"
          onClick={() => {
            toggleActionSidebarOn();
          }}
        />
      );
    }

    return (
      <div className="w-full">
        <ul className="flex flex-col justify-center gap-2">
          {chartData.map(({ id, label, color, value }) => (
            <li
              key={id}
              className={clsx('flex items-center text-sm', {
                'transition-all font-semibold': hoveredSegment?.id === id,
              })}
            >
              <TeamReputationSummaryRow
                color={summaryLegendColor[color] || summaryLegendColor.default}
                name={label}
                totalReputation={value.toString()}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <WidgetBox
      value={
        <div className="grid grid-cols-[36%_1fr] justify-items-center w-full gap-6">
          <div className="relative w-full max-w-[9.375rem] flex-shrink-0 flex justify-center items-center">
            <DonutChart
              data={chartData || []}
              hoveredSegment={hoveredSegment}
              updateHoveredSegment={updateHoveredSegment}
            />
          </div>
          <div className="flex flex-col w-full">
            <div>
              <p className="uppercase text-4 text-gray-400">
                {formatText({ id: 'dashboard.team.widget.title' })}
              </p>
              <h3 className="text-2 mb-3">
                {formatText({ id: 'dashboard.team.widget.subtitle' })}
              </h3>
            </div>
            {getChartLegend()}
          </div>
        </div>
      }
      className="flex-col items-start p-6 bg-base-white min-h-[12.5rem] sm:hover:text-gray-900"
      // @BETA: Disabled for now
      // href={allTeams?.length ? COLONY_TEAMS_ROUTE : undefined}
    />
  );
};

ReputationChart.displayName = displayName;
export default ReputationChart;
