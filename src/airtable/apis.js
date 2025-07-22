import { TimesheetBase } from './airtable-base';
import { TablesMapping, FieldsMapping } from './tables-mappings';
import { ENV } from '../config';

const Tables = TablesMapping[ENV];
const Fields = FieldsMapping[ENV];

export async function getTaskAndSprints(teamId) {
  const team = await TimesheetBase(Tables.Teams).find(teamId);
  const taskValues = team.get(Fields.TeamTasksDDL) || [];

  const parsedTasks = taskValues
    .map((value) => {
      const [idPart, ...nameParts] = value.split(' - ');
      return {
        original: value,
        taskId: idPart.trim(),
        taskName: nameParts.join(' - ').trim()
      };
    })
    .sort((a, b) => a.original.localeCompare(b.original));

  const taskIdList = parsedTasks.map((t) => t.taskId);

  const taskRecords = await TimesheetBase(Tables.Tasks)
    .select({
      filterByFormula: `OR(${taskIdList.map((id) => `{${Fields.TaskID}} = '${id}'`).join(',')})`
    })
    .all();

  const taskIdToRecordId = {};
  taskRecords.forEach((task) => {
    const taskId = task.get(Fields.TaskID);
    if (taskId) {
      taskIdToRecordId[taskId] = {
        recordId: task.id,
        billingCode: task.fields[Fields.TaskBillingCode]
      };
    }
  });

  const sprints = await TimesheetBase(Tables.Sprints)
    .select({ fields: [Fields.SprintLinkedTasks] })
    .all();

  const sprintsMap = {};

  parsedTasks.forEach((parsed) => {
    const { recordId } = taskIdToRecordId[parsed.taskId];
    sprintsMap[recordId] = [];

    if (recordId) {
      for (const sprint of sprints) {
        const linkedTasks = sprint.fields[Fields.SprintLinkedTasks] || [];
        if (linkedTasks.includes(recordId)) {
          sprintsMap[recordId] = [sprint.id];
          break;
        }
      }
    }
  });

  return {
    taskIdToRecordId,
    parsedTasks,
    sprintsMap
  };
}

export async function getBillingCodes(teamId) {
  const user = await TimesheetBase(Tables.Teams).find(teamId);
  const billingCodeUnCleaned = user.get(Fields.TeamBillingCodesDDL) || [];
  const billingCodeValues =
    billingCodeUnCleaned.length > 0 && billingCodeUnCleaned[0]
      ? billingCodeUnCleaned[0].split(';')
      : [];

  if (billingCodeValues.length === 0) {
    return {
      billingCodes: [],
      sprintMap: {}
    };
  }

  const billingCodeFilter = `OR(${billingCodeValues.map((v) => `{${Fields.BillingCode}} = "${v}"`).join(',')})`;

  const billingCodeRecords = await TimesheetBase(Tables.BillingCodes)
    .select({
      filterByFormula: billingCodeFilter,
      fields: [Fields.BillingCode, Fields.BillingCodeProjectsLink]
    })
    .all();

  const billingCodeToRecordsMap = {};

  const billingCodeMap = {};
  billingCodeRecords.forEach((record) => {
    const code = record.get(Fields.BillingCode);
    billingCodeToRecordsMap[code] = record.id;
    const projectId = (record.get(Fields.BillingCodeProjectsLink) || [])[0]; // single value
    if (code && projectId) {
      billingCodeMap[code] = projectId;
    }
  });

  // // Step 3: Get all relevant project IDs
  const projectIds = [...new Set(Object.values(billingCodeMap))];

  let sprints = [];

  if (projectIds.length > 0) {
    const sprintFilter = `OR(${projectIds.map((id) => `{${Fields.SprintProjectLink}} = '${id}'`).join(',')})`;

    sprints = await TimesheetBase(Tables.Sprints)
      .select({
        filterByFormula: sprintFilter,
        fields: [Fields.SprintCode, Fields.SprintProjectLink]
      })
      .all();
  }

  // Step 5: Build sprint map: billing-code → list of { sprintId, sprintCode }
  const sprintMap = {}; // billing-code → array of sprints
  billingCodeValues.forEach((code) => (sprintMap[code] = []));

  sprints.forEach((sprint) => {
    const sprintProjectId = (sprint.get(Fields.SprintProjectLink) || [])[0];
    const sprintCode = sprint.get(Fields.SprintCode);
    const sprintId = sprint.id;

    // Match each billing-code string that links to this project
    Object.entries(billingCodeMap).forEach(([code, projectId]) => {
      if (projectId === sprintProjectId) {
        sprintMap[code].push({
          sprintId,
          sprintCode
        });
      }
    });
  });

  return {
    billingCodes: [...new Set(billingCodeValues)].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    ),
    billingCodeToRecordsMap,
    sprintMap
  };
}

export function writeEntriesToTimesheet(entries, userId) {
  const cleanedEntries = entries.map((entry) => ({
    fields: {
      [Fields.TimesheetBillingCode]: entry.billingCode,
      [Fields.TimesheetStartTimeManual]: entry.startTime,
      [Fields.TimesheetNotes]: entry.notes,
      [Fields.TimesheetTeamMember]: [userId],
      [Fields.TimesheetMinutesEntered]: parseInt(entry.minutes, 10)
    }
  }));

  return new Promise((resolve, reject) => {
    TimesheetBase(Tables.Timesheets).create(cleanedEntries, (err, records) => {
      if (err) {
        console.log('Error creating record:', err);
        return reject(err);
      }
      resolve(records);
    });
  });
}

export async function findTeamMemberByEmail(email) {
  const result = await TimesheetBase(Tables.Teams)
    .select({
      filterByFormula: `{${Fields.TeamEmail}} = '${email}'`,
      maxRecords: 1
    })
    .firstPage();

  if (result.length === 0) {
    return null; // or throw new Error('User not found');
  }

  const user = result[0];
  return {
    id: user.id,
    fullName: user.fields[Fields.TeamFullName]
  };
}
