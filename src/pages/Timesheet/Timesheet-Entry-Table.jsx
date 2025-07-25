import { useState } from 'react';

import classes from './TimesheetPage.module.css';
import TimesheetEntry from '../../components/Timesheet/Timesheet-Entry';
import { writeEntriesToTimesheet } from '../../airtable/apis';
import Input from '../../utils/components/Input';

function isValidEntry(entry) {
  const notesFilled = entry.notes && entry.notes.trim() !== '';
  const minutesValid = parseInt(entry.minutes, 10) > 0;

  const taskFilled = entry.task && entry.task.trim() !== '';
  const jobCodeFilled = entry.jobCode.trim() !== '';

  const condition1 = notesFilled && minutesValid;
  const condition2 = taskFilled || jobCodeFilled;

  return condition1 && condition2;
}

function formatToHHMM(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function TimesheetEntryTable({
  user,
  taskRecordsMap,
  taskSprintMap,
  tasksList,
  billingCodesList,
  billingCodesMap,
  billingCodesSprints
}) {
  const [timeEntries, setTimeEntries] = useState([]);
  const [timeSheetDate, setTimesheetDate] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  function onAddTimeEntry() {
    setTimeEntries((prevArr) => {
      const newArray = prevArr.map((val) => ({ ...val }));
      newArray.push({
        jobCode: '',
        task: '',
        sprintCode: '',
        notes: '',
        minutes: ''
      });
      return newArray;
    });
  }

  function onFormValueChange(index, key, value) {
    setTimeEntries((prevArr) => {
      const newArray = prevArr.map((val) => ({ ...val }));
      newArray[index][key] = value;
      return newArray;
    });
  }

  function onRemoveEntry(index) {
    setTimeEntries((prevArr) => {
      const newArray = prevArr.map((val) => ({ ...val }));
      return [...newArray.slice(0, index), ...newArray.slice(index + 1)];
    });
  }

  function findFinalValues(entry) {
    const value = {
      notes: entry.notes,
      minutes: entry.minutes,
      startTime: `${timeSheetDate}T00:00`
    };
    if (entry.task) {
      value.billingCode = taskRecordsMap[entry.task].billingCode;
      value.sprintCode = taskSprintMap[taskRecordsMap[entry.task].recordId];
    } else if (entry.jobCode) {
      value.billingCode = [billingCodesMap[entry.jobCode]];
      value.sprintCode = entry.sprintCode;
    }
    return value;
  }

  async function onSubmit() {
    const allValid = timeEntries.every(isValidEntry);
    if (!allValid) {
      setErrorMessage('You have not filled a field in some entry!');
      return;
    }
    setLoading(true);
    const finalValues = timeEntries.map(findFinalValues);
    try {
      await writeEntriesToTimesheet(finalValues, user.id);
      alert('Timesheet entries pushed successfully!');
      setTimeEntries([]);
      setTimesheetDate('');
      setErrorMessage(null);
    } catch (e) {
      setErrorMessage('Unknown Error Occurred!');
    } finally {
      setLoading(false);
    }
  }

  const totalMinutes = timeEntries.reduce(
    (sum, item) => sum + parseInt(item.minutes || '0', 10),
    0
  );

  return (
    <div className={classes['timesheet-table-container']}>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <div className={classes['date-input-container']}>
            <b>Date:</b>
            <Input
              type="date"
              value={timeSheetDate}
              onChange={(e) => setTimesheetDate(e.target.value)}
            />
          </div>
          <div style={{ color: 'red' }}>{errorMessage}</div>
          {timeEntries.map((entry, index) => (
            <TimesheetEntry
              key={index}
              index={index}
              jobCode={entry.jobCode}
              task={entry.task}
              sprintCode={entry.sprintCode}
              notes={entry.notes}
              done={entry.done}
              minutes={entry.minutes}
              tasksList={tasksList}
              billingCodesList={billingCodesList}
              billingCodesSprints={billingCodesSprints}
              onFormValueChange={onFormValueChange}
              onRemoveEntry={onRemoveEntry}
            />
          ))}
          {timeEntries.length > 0 ? (
            <div className={classes['total-container-row']}>
              <div className={classes['total-container']}>
                <div>
                  <b>Total:</b>
                </div>
                <div>
                  <b>{formatToHHMM(totalMinutes)}</b>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          {timeSheetDate ? (
            <div className={classes['bottom-buttons-container']}>
              <div className={classes['add-timesheet-btn-container']}>
                <button
                  className={'btn-primary' + ' ' + classes['bottom-btn']}
                  onClick={onAddTimeEntry}
                  style={{
                    backgroundColor: '#FDBA4E',
                    color: '#2D3748'
                  }}
                >
                  Add Timesheet Entry
                </button>
              </div>
              {timeEntries.length > 0 ? (
                <div className={classes['submit-btn-container']}>
                  <button
                    className={'btn-success' + ' ' + classes['bottom-btn']}
                    onClick={onSubmit}
                  >
                    Submit All
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
}

export default TimesheetEntryTable;
