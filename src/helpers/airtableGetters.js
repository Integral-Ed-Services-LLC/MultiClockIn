import Airtable from "airtable";
const apiKey =
  import.meta.env.VITE_AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
const timeSheetHoursBase = "apps7roRhnziLR2ou";

let base = new Airtable({ apiKey: `${apiKey}` }).base(`${timeSheetHoursBase}`);

export function getTeammateRecord(userRecordID) {
    return new Promise((resolve, reject) => {
      base("Team").find(userRecordID, (err, record) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
            // console.log(record.fields["Full Name"])
          //   console.log(record.fields.All_Assigned_Jobcodes_txt)
          resolve(record);
        }
      });
    });
  }
