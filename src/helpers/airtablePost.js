import Airtable from "airtable";
const apiKey =
  import.meta.env.VITE_AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
const timeSheetHoursBase = "apps7roRhnziLR2ou";

let base = new Airtable({ apiKey: `${apiKey}` }).base(`${timeSheetHoursBase}`);

export function createMultiEntries(
  entry
) {
    const { userRecordId, entryRows, startDateArr, jobCodeArr, durationArr, notesArr } = entry;
  return Promise.all(Array.from({ length: entryRows }).map((val, i) => {
    return new Promise((resolve, reject) => {
      base("Testing_Timesheet_Hours").create([{
        fields: {
          Team_Member: [userRecordId],
          Start_Time_Manual: `${startDateArr[i]}T06:59:00.000Z`,
          Projects_Active: [jobCodeArr[i].recordId],
          Timesheet_Duration_Minutes: Number(durationArr[i]),
          Notes: notesArr[i],
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
  })
);
}