import { TimesheetBase } from './airtable-base';

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
      'billing-code': [entry.jobCode],
      Start_Time_Manual: entry.startTime,
      Notes: entry.notes,
      Team_Member: [userId],
      'minutes-entered': parseInt(entry.minutesWorked, 10)
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
