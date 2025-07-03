import { TimesheetBase } from './airtable-base';

export async function getTaskAndSprints(teamId) {
  const team = await TimesheetBase('team').find(teamId);
  const taskValues = team.get('task-ddl-timesheets') || [];

  const parsedTasks = taskValues.map((value) => {
    const [idPart, ...nameParts] = value.split(' - ');
    return {
      original: value,
      taskId: idPart.trim(),
      taskName: nameParts.join(' - ').trim()
    };
  });

  const taskIdList = parsedTasks.map((t) => t.taskId);

  const taskRecords = await TimesheetBase('tasks')
    .select({
      filterByFormula: `OR(${taskIdList.map((id) => `{Task_ID} = '${id}'`).join(',')})`
    })
    .all();

  const taskIdToRecordId = {};
  taskRecords.forEach((task) => {
    const taskId = task.get('Task_ID');
    if (taskId) {
      taskIdToRecordId[taskId] = {
        recordId: task.id,
        billingCode: task.fields['billing-code']
      };
    }
  });

  const sprints = await TimesheetBase('sprints')
    .select({ fields: ['tasks-linked'] })
    .all();

  const sprintsMap = {};

  parsedTasks.forEach((parsed) => {
    const { recordId } = taskIdToRecordId[parsed.taskId];
    sprintsMap[recordId] = [];

    if (recordId) {
      for (const sprint of sprints) {
        const linkedTasks = sprint.fields['tasks-linked'] || [];
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
  const user = await TimesheetBase('team').find(teamId);
  const billingCodeUnCleaned = user.get('billing-codes-timesheet-ddl') || [];
  const billingCodeValues =
    billingCodeUnCleaned.length > 0 ? billingCodeUnCleaned[0].split(';') : [];

  if (billingCodeValues.length === 0) {
    return {
      billingCodes: [],
      sprintMap: {}
    };
  }

  const billingCodeFilter = `OR(${billingCodeValues.map((v) => `{billing-code} = "${v}"`).join(',')})`;

  const billingCodeRecords = await TimesheetBase('billing-codes')
    .select({
      filterByFormula: billingCodeFilter,
      fields: ['billing-code', 'projects-link']
    })
    .all();

  const billingCodeToRecordsMap = {};

  const billingCodeMap = {};
  billingCodeRecords.forEach((record) => {
    const code = record.get('billing-code');
    billingCodeToRecordsMap[code] = record.id;
    const projectId = (record.get('projects-linked') || [])[0]; // single value
    if (code && projectId) {
      billingCodeMap[code] = projectId;
    }
  });

  // // Step 3: Get all relevant project IDs
  const projectIds = [...new Set(Object.values(billingCodeMap))];

  const sprintFilter = `OR(${projectIds.map((id) => `{project-link} = '${id}'`).join(',')})`;

  const sprints = await TimesheetBase('sprints')
    .select({
      filterByFormula: sprintFilter,
      fields: ['sprint-code', 'project-link']
    })
    .all();

  // Step 5: Build sprint map: billing-code → list of { sprintId, sprintCode }
  const sprintMap = {}; // billing-code → array of sprints
  billingCodeValues.forEach((code) => (sprintMap[code] = []));

  sprints.forEach((sprint) => {
    const sprintProjectId = (sprint.get('project-link') || [])[0];
    const sprintCode = sprint.get('sprint-code');
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
    billingCodes: billingCodeValues,
    billingCodeToRecordsMap,
    sprintMap
  };
}

export function writeEntriesToTimesheet(entries, userId) {
  const cleanedEntries = entries.map((entry) => ({
    fields: {
      'billing-code': entry.billingCode,
      Start_Time_Manual: entry.startTime,
      Notes: entry.notes,
      Team_Member: [userId],
      'minutes-entered': parseInt(entry.minutes, 10)
    }
  }));

  return new Promise((resolve, reject) => {
    TimesheetBase('timesheets').create(cleanedEntries, (err, records) => {
      if (err) {
        console.log('Error creating record:', err);
        return reject(err);
      }
      resolve(records);
    });
  });
}

export async function findTeamMemberByEmail(email) {
  const result = await TimesheetBase('team')
    .select({
      filterByFormula: `{email} = '${email}'`,
      maxRecords: 1
    })
    .firstPage();

  if (result.length === 0) {
    return null; // or throw new Error('User not found');
  }

  const user = result[0];
  return {
    id: user.id,
    ...user.fields
  };
}
