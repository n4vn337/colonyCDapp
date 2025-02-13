import { InferType, object, string, number } from 'yup';

import { MAX_COLONY_DISPLAY_NAME, MAX_DOMAIN_PURPOSE_LENGTH } from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    team: number().defined(),
    teamName: string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => 'Team name required.'),
    domainPurpose: string().trim().max(MAX_DOMAIN_PURPOSE_LENGTH).notRequired(),
    domainColor: string().notRequired(),
    createdIn: number().defined(),
    decisionMethod: string().defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type EditTeamFormValues = InferType<typeof validationSchema>;
