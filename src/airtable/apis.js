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

export async function getJobCodes(firstName) {
  const lowerName = firstName.toLowerCase();

  return new Promise((resolve, reject) => {
    TimesheetBase('team')
      .select({
        filterByFormula: `SEARCH("${lowerName}", LOWER({First Name}))`,
        maxRecords: 1
      })
      .firstPage(async (err, records) => {
        if (err) return reject(err);
        if (records.length === 0) return resolve([]);

        const userRecord = records[0];
        const taskIds = userRecord.fields['Tasks_Assigned'] || [];

        if (taskIds.length === 0) return resolve([]);

        // Step 2: Fetch all Tasks
        TimesheetBase('tasks')
          .select({
            filterByFormula: `OR(${taskIds.map((id) => `RECORD_ID() = '${id}'`).join(',')})`
          })
          .firstPage(async (err2, taskRecords) => {
            if (err2) return reject(err2);

            // Step 3: Collect all billing-code IDs
            const billingCodeIds = taskRecords
              .map((task) => task.fields['billing-code'])
              .flat()
              .filter(Boolean);

            // Remove duplicates
            const uniqueBillingCodeIds = [...new Set(billingCodeIds)];

            if (uniqueBillingCodeIds.length === 0) return resolve([]);

            // Step 4: Fetch billing code records
            TimesheetBase('billing-codes')
              .select({
                fields: ['billing-code'],
                filterByFormula: `AND(
                  OR(${uniqueBillingCodeIds.map((id) => `RECORD_ID() = '${id}'`).join(',')}),
                  NOT(Status = "Inactive"),
                  NOT(Status = "Complete and Closed")
                )`
              })
              .firstPage((err3, billingRecords) => {
                if (err3) return reject(err3);

                // Return list of billing code records
                const billingCodesList = billingRecords.map((billingCode) => ({
                  id: billingCode.id,
                  code: billingCode.fields['billing-code']
                }));
                resolve({ airtableUserId: userRecord.id, billingCodesList });
              });
          });
      });
  });
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

export async function findTeamMemberByFirstName(firstName) {
  const result = await TimesheetBase('team')
    .select({
      filterByFormula: `{First Name} = '${firstName}'`,
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
