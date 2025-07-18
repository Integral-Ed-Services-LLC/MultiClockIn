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
    Teams: 'Team',
    Tasks: 'Tasks_Active',
    Sprints: 'Sprint_Code',
    BillingCodes: 'Project_Product_JobCode3',
    Timesheets: 'Timesheet_Hours'
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
    SprintLinkedTasks: 'Tasks_Linked',
    TeamBillingCodesDDL: 'billing-codes-timesheet-ddl',
    BillingCode: 'Product_Name',
    BillingCodeProjectsLink: 'Projects_Active',
    SprintCode: 'Sprint_Code',
    SprintProjectLink: 'Projects_Active',
    TimesheetBillingCode: 'Product_Jobcode3',
    TimesheetStartTimeManual: 'Start_Time_Manual',
    TimesheetNotes: 'Notes',
    TimesheetTeamMember: 'Team_Member',
    TimesheetMinutesEntered: 'Intended_Duration',
    TeamEmail: 'Email',
    TeamFullName: 'Full Name'
  }
};
