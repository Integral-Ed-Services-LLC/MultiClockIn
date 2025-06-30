import { useState } from 'react';

import classes from './TimesheetPage.module.css';
import TimesheetEntry from '../../components/Timesheet/Timesheet-Entry';
import { writeEntriesToTimesheet } from '../../airtable/apis';

const getUserName = (user) => user['First Name'] + ' ' + user['Last Name'];

function isValidEntry(entry) {
  const notesFilled = entry.notes && entry.notes.trim() !== '';
  const minutesValid = parseInt(entry.minutes, 10) > 0;
  const doneIsTrue = entry.done === true;

  const taskFilled = entry.task && entry.task.trim() !== '';
  const jobSprintFilled = entry.jobCode && entry.sprintCode;

  const condition1 = notesFilled && minutesValid && doneIsTrue;
  const condition2 =
    taskFilled || (jobSprintFilled && jobSprintFilled.trim() !== '');

  return condition1 && condition2;
}

function TimesheetEntryTable({
  user,
  taskRecordsMap,
  taskSprintMap,
  tasksList
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
        minutes: 1,
        done: false
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
    }
    return value;
  }

  async function onSubmit() {
    const allValid = timeEntries.every(isValidEntry);
    if (!allValid) {
      setErrorMessage(
        'You have not filled a field in some entry, or have not checked some entry as done'
      );
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

  const minutesProgress = timeEntries.reduce(
    (sum, item) => (item.done ? sum + parseInt(item.minutes, 10) : sum),
    0
  );

  return (
    <div className={classes['timesheet-table-container']}>
      <h3>Timesheet Entries for {getUserName(user)}</h3>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <div className={classes['time-progress-div']}>
            <div className={classes['time-progress-bar']}>
              <div
                className={classes['minutes-progress']}
                style={{
                  width: Math.min(minutesProgress, 480) * 3
                }}
              >
                {minutesProgress >= 25
                  ? `${minutesProgress > 480 ? '480+' : minutesProgress}mins`
                  : ''}
              </div>
            </div>
            <div className={classes['time-labels']}>
              <div>0m</div>
              <div>80m</div>
              <div>160m</div>
              <div>240m</div>
              <div>320m</div>
              <div>400m</div>
              <div>480m</div>
            </div>
          </div>
          <div>
            Select Date:{' '}
            <input
              type="date"
              className={classes['date-time-input']}
              value={timeSheetDate}
              onChange={(e) => setTimesheetDate(e.target.value)}
            />
          </div>
          <button
            className={'btn-primary' + ' ' + classes['add-timesheet-btn']}
            style={
              !timeSheetDate
                ? { backgroundColor: '#0000ff75', cursor: 'not-allowed' }
                : {}
            }
            onClick={onAddTimeEntry}
            disabled={!timeSheetDate}
          >
            Add Timesheet Entry
          </button>
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
              onFormValueChange={onFormValueChange}
              onRemoveEntry={onRemoveEntry}
            />
          ))}
          {timeEntries.length > 0 ? (
            <button
              style={{ width: '81%', marginTop: 10, marginLeft: 3 }}
              className="btn-success"
              onClick={onSubmit}
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
