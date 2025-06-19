import React, { useEffect, useState } from 'react';

import classes from './Timesheet.module.css';
import TimesheetEntry from '../../components/Timesheet/Timesheet-Entry';
import { getJobCodes, writeEntriesToTimesheet } from '../../airtable/apis';

const USER = {
  'First Name': 'David',
  'Last Name': 'Malbin'
};

const getUserName = (user) => user['First Name'] + ' ' + user['Last Name'];

function TimesheetEntryTable() {
  const [allBillingCodes, setAllBillingCodes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timesheetEntries, setTimesheetEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getJobCodes(USER['First Name'])
      .then(({ airtableUserId, billingCodesList }) => {
        setUserId(airtableUserId), setAllBillingCodes(billingCodesList);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function onAddTimesheetEntryForm() {
    setTimesheetEntries((prevVal) => {
      const previousArray = prevVal.map((val) => ({
        jobCode: val.jobCode,
        startTime: val.startTime,
        minutesWorked: val.minutesWorked,
        notes: val.notes
      }));
      const newArray = [
        ...previousArray,
        {
          jobCode: '',
          startTime: '',
          minutesWorked: 1,
          notes: ''
        }
      ];
      return newArray;
    });
  }

  function onRemoveTimeSheetEntry(timesheetEntryIndex) {
    setTimesheetEntries((prevVal) => {
      return prevVal.filter((_, index) => index !== timesheetEntryIndex);
    });
  }

  function onChangeEntry(entryChangeKey, entryChangeValue, index) {
    setTimesheetEntries((prevVal) => {
      const newArr = prevVal.map((val) => ({
        ...val
      }));
      newArr[index][entryChangeKey] = entryChangeValue;
      return newArr;
    });
  }

  async function onSubmitTimesheet() {
    const allFilled = timesheetEntries.every((entry) => {
      return (
        entry.jobCode && entry.startTime && entry.minutesWorked && entry.notes
      );
    });
    if (!allFilled) {
      setErrorMessage(
        'All fields are required. You have not filled a field in some timesheet entry.'
      );
      return;
    }

    setErrorMessage('');

    try {
      setIsLoading(true);
      await writeEntriesToTimesheet(timesheetEntries, userId);
      alert('New entries added to the timesheet.');
    } catch (e) {
      console.log(e);
      setErrorMessage(
        'Some error occurred in creating the entries. Try to re-enter them.'
      );
    } finally {
      setIsLoading(false);
      setTimesheetEntries([]);
    }
  }

  return (
    <div className={classes['timesheet-table-container']}>
      <h3>Multiple Timesheet Entries Table for {getUserName(USER)}</h3>
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          <button
            className={'btn-primary' + ' ' + classes['add-timesheet-btn']}
            onClick={onAddTimesheetEntryForm}
          >
            Add New Timesheet Entry to the Table
          </button>
          {errorMessage ? (
            <div style={{ color: 'red', fontWeight: 'bold' }}>
              Error: {errorMessage}
            </div>
          ) : (
            ''
          )}
          {timesheetEntries.map((entry, index) => (
            <TimesheetEntry
              key={index}
              value={entry}
              arrayIndex={index}
              jobCodes={allBillingCodes}
              onCancelEntry={onRemoveTimeSheetEntry}
              onChangeEntry={onChangeEntry}
            />
          ))}
          {timesheetEntries.length > 0 ? (
            <button
              className="btn-success"
              style={{
                width: 200,
                marginTop: 10
              }}
              onClick={onSubmitTimesheet}
            >
              Submit Entries
            </button>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
}

export default TimesheetEntryTable;
