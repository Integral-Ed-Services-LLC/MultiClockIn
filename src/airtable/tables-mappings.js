import { EnvironmentTypes } from '../config';

export const TablesMapping = {
  [EnvironmentTypes.DEVELOP]: {
    Teams: 'team',
    Tasks: 'tasks',
    Sprints: 'sprints',
    BillingCodes: 'billing-codes',
    Timesheets: 'timesheets'
  },
  [EnvironmentTypes.PRODUCTION]: {
    Teams: 'team',
    Tasks: 'tasks',
    Sprints: 'sprints',
    BillingCodes: 'billing-codes',
    Timesheets: 'timesheets'
  }
};

export const FieldsMapping = {
  [EnvironmentTypes.DEVELOP]: {
    TeamTasksDDL: 'task-ddl-timesheets',
    TaskID: 'Task_ID',
    TaskBillingCode: 'billing-code',
    SprintLinkedTasks: 'tasks-linked',
    TeamBillingCodesDDL: 'billing-codes-timesheet-ddl',
    BillingCode: 'billing-code',
    BillingCodeProjectsLink: 'projects-link',
    SprintCode: 'sprint-code',
    SprintProjectLink: 'project-link',
    TimesheetBillingCode: 'billing-code',
    TimesheetStartTimeManual: 'Start_Time_Manual',
    TimesheetNotes: 'Notes',
    TimesheetTeamMember: 'Team_Member',
    TimesheetMinutesEntered: 'minutes-entered',
    TeamEmail: 'email',
    TeamFullName: 'Full Name'
  },
  [EnvironmentTypes.PRODUCTION]: {
    TeamTasksDDL: 'task-ddl-timesheets',
    TaskID: 'Task_ID',
    TaskBillingCode: 'billing-code',
    SprintLinkedTasks: 'tasks-linked',
    TeamBillingCodesDDL: 'billing-codes-timesheet-ddl',
    BillingCode: 'billing-code',
    BillingCodeProjectsLink: 'projects-link',
    SprintCode: 'sprint-code',
    SprintProjectLink: 'project-link',
    TimesheetBillingCode: 'billing-code',
    TimesheetStartTimeManual: 'Start_Time_Manual',
    TimesheetNotes: 'Notes',
    TimesheetTeamMember: 'Team_Member',
    TimesheetMinutesEntered: 'minutes-entered',
    TeamEmail: 'email',
    TeamFullName: 'Full Name'
  }
};
