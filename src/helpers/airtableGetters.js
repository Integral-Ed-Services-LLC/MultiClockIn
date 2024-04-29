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

export function getProductNameAndID() {
  return new Promise((resolve, reject) => {
    const productNamesWithIds = {};

    base("Project_Product_JobCode3")
      .select({ view: "Grid view" })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach((record) => {
            productNamesWithIds[record.get("Product_Name")] = record.id;
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            // console.log(productNamesWithIds);
            resolve(productNamesWithIds);
          }
        }
      );
  });
}

export function getProductJobCode3IDs(projRecordID) {
  return new Promise((resolve, reject) => {
    base("Project_Product_JobCode3").find(projRecordID, (err, record) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(record);
      }
    });
  });
}
