import React, { useMemo, useState } from 'react';
import classes from './Timesheet.module.css';

function TimesheetEntry({
  jobCodes,
  arrayIndex,
  value,
  onCancelEntry,
  onChangeEntry
}) {
  function onChangeMinutes(val) {
    onChangeEntry('minutesWorked', val, arrayIndex);
  }

  function onChangeStartTime(val) {
    console.log(val);
    onChangeEntry('startTime', val, arrayIndex);
  }

  function onChangeNotes(val) {
    onChangeEntry('notes', val, arrayIndex);
  }

  function onChangeJobCode(val) {
    console.log(val);
    onChangeEntry('jobCode', val, arrayIndex);
  }

  const hoursString = useMemo(() => {
    const hrs = Math.floor(value.minutesWorked / 60);
    const mins = value.minutesWorked % 60;

    const paddedHrs = String(hrs).padStart(2, '0');
    const paddedMins = String(mins).padStart(2, '0');

    return `${paddedHrs}:${paddedMins}`;
  }, [value.minutesWorked]);

  return (
    <div className={classes['timesheet-form']}>
      <div
        style={{
          fontSize: 16,
          fontWeight: 'bold'
        }}
      >
        ({arrayIndex + 1}) Enter your time log:{' '}
      </div>
      <div className={classes['form-item']}>
        <label htmlFor="jobCode">Job Code</label>
        <select
          id="jobCode"
          name="jobCode"
          type="select"
          className={classes['timesheet-input']}
          style={{ width: 300 }}
          value={value.jobCode}
          onChange={(e) => onChangeJobCode(e.target.value)}
        >
          <option value="">-- Select Code --</option>
          {jobCodes.map((val) => (
            <option key={val.id} value={val.id}>
              {val.code}
            </option>
          ))}
        </select>
      </div>
      <div className={classes['form-item']}>
        <label htmlFor="startTime">Start Time</label>
        <input
          id="startTime"
          name="startTime"
          type="datetime-local"
          className={classes['timesheet-input']}
          value={value.startTime}
          onChange={(e) => onChangeStartTime(e.target.value)}
        />
      </div>
      <div className={classes['form-item']}>
        <label htmlFor="minutesWorked" style={{ textAlign: 'center' }}>
          Minutes Worked <br /> ({hoursString} Hours)
        </label>
        <input
          id="minutesWorked"
          name="minutesWorked"
          type="number"
          min={1}
          value={value.minutesWorked}
          className={classes['timesheet-input']}
          onChange={(e) => onChangeMinutes(e.target.value)}
        />
      </div>
      <div className={classes['form-item']}>
        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          name="notes"
          type="text"
          className={classes['timesheet-input']}
          style={{
            width: 500
          }}
          value={value.notes}
          onChange={(e) => onChangeNotes(e.target.value)}
        />
      </div>
      <div className={classes['form-item']}>
        <button
          className="btn-danger"
          onClick={() => onCancelEntry(arrayIndex)}
        >
          X Cancel
        </button>
      </div>
    </div>
  );
}

export default React.memo(TimesheetEntry, (prevProps, newProps) => {
  return (
    prevProps.arrayIndex === newProps.arrayIndex &&
    prevProps.value.jobCode === newProps.value.jobCode &&
    prevProps.value.startTime === newProps.value.startTime &&
    prevProps.value.notes === newProps.value.notes &&
    prevProps.value.minutesWorked === newProps.value.minutesWorked &&
    prevProps.value.minutesWorked === newProps.value.minutesWorked &&
    prevProps.jobCodes.length === newProps.jobCodes.length
  );
});
