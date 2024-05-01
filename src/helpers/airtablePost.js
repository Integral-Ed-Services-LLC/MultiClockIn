import Airtable from "airtable";
const apiKey =
  import.meta.env.VITE_AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
const timeSheetHoursBase = "apps7roRhnziLR2ou";

let base = new Airtable({ apiKey: `${apiKey}` }).base(`${timeSheetHoursBase}`);

export function createMultiEntries(entry) {
    const { userRecordId, entryRows, startDateArr, jobCodeArr, durationArr, notesArr } = entry;
    const formattedEntries = Array.from({length: entryRows }).map((_, i) => {
      return {
        startDate: startDateArr[i] || "1980-01-01",
        jobCode: jobCodeArr[i]?.recordId || "recIqSwADvMHWL0c5",  //error -check other fields
        duration: Number(durationArr[i]) || 0,  
        notes: notesArr[i] || "Error in Entry"
      }
    })
    return Promise.all(formattedEntries.map(entry => {
      return new Promise((resolve, reject) => {
          base("Testing_Timesheet_Hours").create([{
              fields: {
                  Team_Member: [userRecordId],
                  Start_Time_Manual: `${entry.startDate}T06:59:00.000Z`,
                  Projects_Active: [entry.jobCode],
                  Timesheet_Duration_Minutes: entry.duration,
                  Notes: entry.notes,
              },
          }], function(err, records) {
              if (err) {
                  console.error(err);
                  reject(err);
              } else if (records && records.length > 0) {
                  resolve(records[0].getId());
              }
          });
      });
  }));
}